import {Object3D} from "three";
import {ValidUUID} from "../../../../../../utils/ids";
import {getSortedDucklings, updateDucklingsOrder, useSortedDucklings} from "../../../../state/ducklings";
import {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getDucklingUuid, getFoodUuid, getPlayerUuid} from "../../../../../../shared/uuids";
import {calculateAngleFromVector, radians} from "../../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../../utils/numbers";
import {BodyApi} from "../../../../../../physics/components/Physics/hooks";
import {calculateVectorFromAngle, limitVector} from "../../../../../../utils/vectors";
import {useMounted} from "../../../../../../shared/hooks/mounted";
import {useDucklingId, useDucklingLocalState} from "../../context";
import {useDuckling} from "../useDuckling";
import {getStoredMesh} from "../../../../state/meshes";
import {Vec2} from "planck-js";
import {useProxy} from "valtio";
import {increaseFoodLevel} from "../../state";
import {updateFoodLevel} from "../../../../../../game/food/logic/state";

const vector = Vec2(0, 0)

const calculateCheapDistance = (x: number, x2: number, y: number, y2: number): number => {
    return Math.pow(Math.abs(x - x2), 2) + Math.pow(Math.abs(y - y2), 2)
}

type TempTarget = {
    id: string,
    order: number,
    object: Object3D
}

type UpdateFn = (update: TempTarget | null) => void

export const useTempTargetObject = (order: number | null): [TempTarget | null, UpdateFn, (id: string) => boolean] => {

    const [targetCooldown, setTargetCooldown] = useState('')
    const [tempTarget, setTempTargetObject] = useState<TempTarget | null>(null)

    const setTempTarget = useCallback((update: TempTarget | null) => {
        setTempTargetObject(update)
    }, [setTempTargetObject])

    const tempTargetId = tempTarget ? tempTarget.id : ''

    const isValidTarget = useCallback((id: string) => {
        return id !== targetCooldown
    }, [targetCooldown])

    const ducklingId = useDucklingId()

    useEffect(() => {

        if (tempTargetId) {

            const timeout = setTimeout(() => {
                setTempTargetObject(null)
                setTargetCooldown(tempTargetId)
            }, 2000)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [tempTargetId, setTempTargetObject])

    useEffect(() => {
        setTempTargetObject(null)
    }, [order])

    useEffect(() => {

        if (targetCooldown) {

            const timeout = setTimeout(() => {
                setTargetCooldown('')
            }, 1000)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [targetCooldown, setTargetCooldown])

    return [tempTarget, setTempTarget, isValidTarget]
}

const useCheckForReachedTarget = (setTempTarget: UpdateFn) => {

    const id = useDucklingId()
    const {order} = useDuckling(id)

    const [claimedPosition, setClaimedPosition] = useState<number | null>(null)

    const checkForReachedTarget = useCallback((object: Object3D, target: Object3D, position: number) => {

        if (claimedPosition != null) return

        const currentX = object.position.x
        const currentY = object.position.y

        const targetX = target.position.x
        const targetY = target.position.y

        const currentDistance = calculateCheapDistance(currentX, targetX, currentY, targetY)

        if (currentDistance < 0.1) {
            setClaimedPosition(position)
        }

    }, [claimedPosition, setTempTarget])

    useEffect(() => {

        if (claimedPosition != null) {
            updateDucklingsOrder(id, claimedPosition)
        }

    }, [claimedPosition, id])

    useEffect(() => {

        setClaimedPosition(null)

    }, [order])

    return checkForReachedTarget

}

const useCheckForCloserTarget = (setTempTarget: UpdateFn, isValidTarget: (id: string) => boolean) => {

    const mounted = useMounted()
    const id = useDucklingId()
    const {order} = useDuckling(id)

    const ducklingsInChain = useMemo(() => {

        let chain: {
            id: string,
            object: Object3D,
            order: number,
        }[] = []

        if (order != null) {
            const sortedDucklings = getSortedDucklings()
            sortedDucklings.forEach((duckling) => {
                if (duckling.order != null && duckling.order < order && isValidTarget(duckling.id)) {
                    const ducklingObject = getStoredMesh(getDucklingUuid(duckling.id))
                    if (ducklingObject) {
                        chain.push({
                            id: duckling.id,
                            object: ducklingObject,
                            order: duckling.order,
                        })
                    }
                }
            })
        }

        return chain

    }, [mounted, order, id])

    const checkForCloserTarget = useCallback((object: Object3D, currentTargetX: number, currentTargetY: number) => {

        const currentX = object.position.x
        const currentY = object.position.y

        const currentDistance = calculateCheapDistance(currentX, currentTargetX, currentY, currentTargetY)

        let matched = false

        if (currentDistance > 2.5) {
            ducklingsInChain.forEach(({id: ducklingId, object: ducklingObject, order: ducklingPosition}) => {
                const ducklingDistance = calculateCheapDistance(currentX, ducklingObject.position.x, currentY, ducklingObject.position.y)
                if (ducklingDistance < currentDistance) {
                    const difference = currentDistance - ducklingDistance
                    if (difference > 2) {
                        setTempTarget({
                            id: ducklingId,
                            order: ducklingPosition,
                            object: ducklingObject,
                        })
                        matched = true
                        return
                    }
                }
            })
        }

    }, [ducklingsInChain, setTempTarget])

    return checkForCloserTarget

}

export const useDucklingTargetUuid = (id: string, order: number | null): ValidUUID | null => {

    const sortedDucklings = useSortedDucklings()

    const targetUuid = useMemo<ValidUUID | null>(() => {

        if (order == null) return null

        const ducklingIndex = sortedDucklings.findIndex((duckling) => duckling.id === id)

        if (ducklingIndex === 0) {
            return getPlayerUuid()
        }

        const previousDuckling = sortedDucklings[ducklingIndex - 1]

        const uuid = getDucklingUuid(previousDuckling.id)

        return uuid

    }, [id, order, sortedDucklings])

    return targetUuid
}

const useHasPhysicalCollision = (): boolean => {
    const localState = useDucklingLocalState()
    const proxyLocalState = useProxy(localState)
    return Object.keys(proxyLocalState.physicalCollisions).length > 0
}

type MoveTowardFn = (delta: number, self: Object3D, targetX: number, targetY: number, angle: number, allowedDistance?: number, speedLimit?: number) => void

export const useMoveTowards = (api: BodyApi) => {

    const localStateRef = useRef<{
        previousMeshX: number,
        previousMeshY: number,
        previousXVel: number,
        previousYVel: number,
        previousXDir: number,
        previousYDir: number,
        previousTargetX: number,
        previousTargetY: number,
        requestedPosition: null | number,
        requestedPositionTimestamp: number,
        positionCooldown: number,
        lerpedTargetX: number,
        lerpedTargetY: number,
        previousEarlyXVel: number,
        previousEarlyYVel: number,
        previousXPos: number,
        previousYPos: number,
        previousAdjustedXVel: number | null,
        previousAdjustedYVel: number | null,
    }>({
        previousXVel: 0,
        previousYVel: 0,
        previousMeshX: 0,
        previousMeshY: 0,
        previousXDir: 0,
        previousYDir: 0,
        previousTargetX: 0,
        previousTargetY: 0,
        requestedPosition: null,
        requestedPositionTimestamp: 0,
        positionCooldown: 0,
        lerpedTargetX: 0,
        lerpedTargetY: 0,
        previousEarlyXVel: 0,
        previousEarlyYVel: 0,
        previousXPos: 0,
        previousYPos: 0,
        previousAdjustedXVel: 0,
        previousAdjustedYVel: 0,
    })


    const hasPhysicalCollision = useHasPhysicalCollision()

    // const id = useDucklingId()
    //
    // useEffect(() => {
    //     console.log(`${id} hasPhysicalCollision`, hasPhysicalCollision)
    // }, [hasPhysicalCollision, id])

    const adjustIfStuck = useCallback((xVel: number, yVel: number, calculatedXVel: number, calculatedYVel: number, delta: number) => {

        const previousXVel = localStateRef.current.previousEarlyXVel
        const previousYVel = localStateRef.current.previousEarlyYVel

        const wasMoving = Math.abs(previousXVel) > 0 || Math.abs(previousYVel) > 0
        const isMoving = Math.abs(xVel) > 0 || Math.abs(yVel) > 0

        const threshold = 1 * delta
        const barelyMoved = (Math.abs(calculatedXVel) < threshold) && (Math.abs(calculatedYVel) < threshold)

        if (hasPhysicalCollision && wasMoving && isMoving && barelyMoved) {

            let angle = calculateAngleFromVector(xVel, yVel)

            if (xVel > 0) {

                if (yVel > 0) {
                    // moving top right
                    angle += radians(45)
                } else {
                    // moving bottom right
                    angle += radians(-45)
                }

            } else {

                if (yVel > 0) {
                    // moving top left
                    angle += radians(-45)
                } else {
                    // moving bottom left
                    angle += radians(45)
                }

            }

            const newVector = calculateVectorFromAngle(angle)

            return newVector
        }

        // todo - move away from physically colliding elements, rather than hard-coded angles

        return null

    }, [hasPhysicalCollision])

    return useCallback((delta: number, self: Object3D, targetX: number, targetY: number, angle: number, allowedDistance: number = 0, speedLimit = 60) => {

        const localState = localStateRef.current

        let moveXDiff = targetX - self.position.x
        let moveYDiff = targetY - self.position.y

        if (Math.abs(moveXDiff) < allowedDistance) {
            moveXDiff = 0
        }

        if (Math.abs(moveYDiff) < allowedDistance) {
            moveYDiff = 0
        }

        let vectorAngle = Math.atan2(moveYDiff, moveXDiff) - radians(90)

        if (vectorAngle > PI) {
            vectorAngle -= PI_TIMES_TWO
        }

        const xDir = Math.sin(vectorAngle)
        const yDir = Math.cos(vectorAngle)

        localState.previousXDir = xDir
        localState.previousYDir = yDir

        const adjustedXDir = numLerp(xDir, localState.previousXDir, 55 * delta)
        const adjustedYDir = numLerp(yDir, localState.previousYDir, 55 * delta)

        localState.previousXDir = adjustedXDir
        localState.previousYDir = adjustedYDir

        let xValue = Math.floor(Math.abs(moveXDiff) * 1000) / 1000

        if (xValue > 2) {
            xValue = 2
        }

        let xVel = Math.pow(xValue, 1.75)

        let yValue = Math.floor(Math.abs(moveYDiff) * 1000) / 1000

        if (yValue > 2) {
            yValue = 2
        }

        let yVel = Math.pow(yValue, 1.75)

        if (moveXDiff < 0) {
            xVel *= -1
        }

        if (moveYDiff < 0) {
            yVel *= -1
        }

        const calculatedXVel = self.position.x - localState.previousXPos
        const calculatedYVel = self.position.y - localState.previousYPos

        const velocityAdjusted = adjustIfStuck(xVel, yVel, calculatedXVel, calculatedYVel, delta)

        if (velocityAdjusted) {
            xVel = velocityAdjusted[0]
            yVel = velocityAdjusted[1]
            localState.previousAdjustedXVel = xVel
            localState.previousAdjustedYVel = yVel
        } else {

            if (localState.previousAdjustedXVel != null && localState.previousAdjustedYVel != null) {
                xVel = localState.previousAdjustedXVel
                yVel = localState.previousAdjustedYVel
            }

            localState.previousAdjustedXVel = null
            localState.previousAdjustedYVel = null
        }

        localState.previousEarlyXVel = xVel
        localState.previousEarlyYVel = yVel
        localState.previousXPos = self.position.x
        localState.previousYPos = self.position.y

        xVel = xVel * 2
        yVel = yVel * 2

        xVel = xVel * 35 * delta
        yVel = yVel * 35 * delta

        const maximumVel = speedLimit * delta

        const [finalX, finalY] = limitVector(xVel, yVel, maximumVel)

        vector.set(finalX, finalY)

        api.applyForceToCenter(vector)
        api.setAngle(angle)

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousXVel = finalX
        localState.previousYVel = finalY

    }, [api, adjustIfStuck])
}

export const useFollowMethod = (
    ref: MutableRefObject<Object3D>,
    api: BodyApi, targetUuid: ValidUUID | null,
    setTempTarget: UpdateFn,
    isValidTarget: (id: string) => boolean,
    tempTarget: TempTarget | null,
    moveTowards: MoveTowardFn,
) => {

    const checkForCloserTarget = useCheckForCloserTarget(setTempTarget, isValidTarget)
    const checkForReachedTarget = useCheckForReachedTarget(setTempTarget)

    const offset = useMemo(() => {
        return targetUuid === getPlayerUuid() ? 1 : 0.45
    }, [targetUuid])

    return useCallback((delta: number, targetObject: Object3D, isTempTarget: boolean = false) => {

        let targetX = targetObject.position.x
        let targetY = targetObject.position.y

        let followAngle = targetObject.rotation.z
        if (followAngle > PI) {
            followAngle -= PI_TIMES_TWO
        }

        const followXDir = Math.sin(followAngle)
        const followYDir = Math.cos(followAngle)

        targetX += followXDir * offset
        targetY += followYDir * -1 * offset

        const moveXDiff = targetX - ref.current.position.x
        const moveYDiff = targetY - ref.current.position.y

        const moveAverage = (Math.abs(moveXDiff) + Math.abs(moveYDiff)) / 2

        const moveFactor = numLerp(0.25, 0.75, moveAverage < 1 ? moveAverage : 1)

        let vectorAngle = Math.atan2(moveYDiff, moveXDiff) - radians(90)
        vectorAngle = lerpRadians(followAngle, vectorAngle, moveFactor)

        if (vectorAngle > PI) {
            vectorAngle -= PI_TIMES_TWO
        }

        let prevAngle = ref.current.rotation.z // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        let newAngle = lerpRadians(vectorAngle, prevAngle, 50 * delta)

        moveTowards(delta, ref.current, targetX, targetY, newAngle)

        if (isTempTarget && tempTarget) {
            checkForReachedTarget(ref.current, targetObject, tempTarget.order)
        } else {
            checkForCloserTarget(ref.current, targetX, targetY)
        }

    }, [ref, api, offset, checkForReachedTarget, checkForCloserTarget, tempTarget, moveTowards])
}

let tick = 0

export const useForageMethod = (self: Object3D, targetFoodSources: string[], moveTowards: MoveTowardFn, isForaging: boolean) => {

    const [withinEatingDistance, setWithinEatingDistance] = useState(false)
    const [justBeganForaging, setJustBeganForaging] = useState(false)
    const [isHurrying, setIsHurrying] = useState(false)
    const firstFoodSource = targetFoodSources.length > 0 ? targetFoodSources[0] : null
    const localState = useDucklingLocalState()

    const speedLimit = isHurrying ? 60 : 40

    const targetObject = useMemo(() => {

        if (firstFoodSource) {

            const uuid = getFoodUuid(firstFoodSource)

            return getStoredMesh(uuid)

        } else {
            return null
        }

    }, [firstFoodSource])

    const consumeFood = useCallback(() => {

        if (firstFoodSource) {
            increaseFoodLevel(localState, 2)
            updateFoodLevel(firstFoodSource, 2)
        }

    }, [firstFoodSource, localState])

    useEffect(() => {

        if (withinEatingDistance && isForaging) {

            const interval = setInterval(() => {
                consumeFood()
            }, 500)

            return () => {
                clearInterval(interval)
            }

        }

    }, [withinEatingDistance, isForaging, consumeFood])

    useEffect(() => {

        if (!isForaging) {
            setWithinEatingDistance(false)
        }

    }, [isForaging, setWithinEatingDistance])

    useEffect(() => {
        setIsHurrying(false)
        setJustBeganForaging(!!targetObject)
    }, [targetObject, setJustBeganForaging, setIsHurrying])

    useEffect(() => {
        setIsHurrying(justBeganForaging)
    }, [justBeganForaging, setIsHurrying])

    return useCallback((delta: number) => {

        if (!targetObject) return

        const targetX = targetObject.position.x
        const targetY = targetObject.position.y

        const moveXDiff = targetX - self.position.x
        const moveYDiff = targetY - self.position.y

        let angle = self.rotation.z
        let vectorAngle = Math.atan2(moveYDiff, moveXDiff) - radians(90)
        if (vectorAngle > PI) {
            vectorAngle -= PI_TIMES_TWO
        }
        let prevAngle = angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }
        angle = lerpRadians(vectorAngle, prevAngle, 50 * delta)
        moveTowards(delta, self, targetX, targetY, angle, 0.4, speedLimit)

        const distance = calculateCheapDistance(self.position.x, targetX, self.position.y, targetY)

        const withinRange = distance < 1

        setWithinEatingDistance(withinRange)

    }, [self, moveTowards, targetObject, speedLimit, setWithinEatingDistance])
}