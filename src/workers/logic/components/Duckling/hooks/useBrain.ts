import {BodyApi} from "../../../../../physics/components/Physics/hooks";
import {MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useIntervalFrame} from "../../../../../shared/hooks/frame";
import {Object3D} from "three";
import {getStoredMesh, useTargetObject} from "../../../state/meshes";
import {ValidUUID} from "../../../../../utils/ids";
import {
    getSortedDucklings,
    updateDucklingsOrder,
    useSortedDucklings
} from "../../../state/ducklings";
import {getDucklingUuid, getPlayerUuid} from "../../../../../shared/uuids";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";
import {getRadianAngleDifference, radians} from "../../../../../utils/angles";
import {Vec2} from "planck-js";
import {useDuckling} from "./useDuckling";
import {useDucklingId} from "../context";
import {useMounted} from "../../../../../shared/hooks/mounted";
import {proxy} from "valtio";

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

const useTempTargetObject = (order: number): [TempTarget | null, UpdateFn, (id: string) => boolean] => {

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

        if (currentDistance < 1) {
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

const useDucklingTargetUuid = (id: string, order: number): ValidUUID | null => {

    const sortedDucklings = useSortedDucklings()

    const targetUuid = useMemo<ValidUUID | null>(() => {

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

const useMovementMethod = (
    ref: MutableRefObject<Object3D>,
    api: BodyApi, targetUuid: ValidUUID | null,
    setTempTarget: UpdateFn,
    isValidTarget: (id: string) => boolean,
    tempTarget: TempTarget | null,
) => {

    const localStateRef = useRef<{
        previousMeshX: number,
        previousMeshY: number,
        previousXVel: number,
        previousYVel: number,
        previousX: number,
        previousY: number,
        previousXDir: number,
        previousYDir: number,
        previousTargetX: number,
        previousTargetY: number,
        requestedPosition: null | number,
        requestedPositionTimestamp: number,
        positionCooldown: number,
        lerpedTargetX: number,
        lerpedTargetY: number,
    }>({
        previousX: 0,
        previousY: 0,
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
    })

    const checkForCloserTarget = useCheckForCloserTarget(setTempTarget, isValidTarget)
    const checkForReachedTarget = useCheckForReachedTarget(setTempTarget)

    const offset = useMemo(() => {
        return targetUuid === getPlayerUuid() ? 1 : 0.45
    }, [targetUuid])

    return useCallback((delta: number, targetObject: Object3D, isTempTarget: boolean = false) => {

        const movedXDiff = Math.abs(ref.current.position.x - localStateRef.current.previousMeshX)
        const movedYDiff = Math.abs(ref.current.position.y - localStateRef.current.previousMeshY)

        localStateRef.current.previousMeshX = ref.current.position.x
        localStateRef.current.previousMeshY = ref.current.position.y

        const localState = localStateRef.current

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

        // newAngle = vectorAngle

        const angleDifference = getRadianAngleDifference(prevAngle, newAngle)

        // todo - account for delta?
        // if (Math.abs(angleDifference) > 0.1) {
        //     if (angleDifference > 0) {
        //         newAngle = prevAngle + 0.1
        //     } else {
        //         newAngle = prevAngle - 0.1
        //     }
        // }
        //
        // if (newAngle > PI) {
        //     newAngle -= PI_TIMES_TWO
        // }

        // console.log('angleDifference', angleDifference)

        api.setAngle(newAngle)

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

        xVel = xVel * 2
        yVel = yVel * 2

        xVel = xVel * 35 * delta
        yVel = yVel * 35 * delta

        // todo - implement maximum

        vector.set(xVel, yVel)

        api.applyForceToCenter(vector)

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousX = targetObject.position.x
        localState.previousY = targetObject.position.y
        localState.previousXVel = xVel
        localState.previousYVel = yVel

        if (isTempTarget && tempTarget) {
            checkForReachedTarget(ref.current, targetObject, tempTarget.order)
        } else {
            checkForCloserTarget(ref.current, targetX, targetY)
        }

    }, [ref, api, offset, checkForReachedTarget, checkForCloserTarget, tempTarget])
}

export const useBrain = (id: string, ref: MutableRefObject<Object3D>, api: BodyApi) => {

    const {order} = useDuckling(id)

    const targetUuid = useDucklingTargetUuid(id, order)
    const [targetObject, refetchTargetObject] = useTargetObject(targetUuid)
    const [tempTarget, setTempTarget, isValidTarget] = useTempTargetObject(order)
    const movementMethod = useMovementMethod(ref, api, targetUuid, setTempTarget, isValidTarget, tempTarget)

    const onFrame = useCallback((delta: number) => {

        if (tempTarget) {
            return movementMethod(delta, tempTarget.object, true)
        }

        if (!targetObject) {
            if (targetUuid != null) {
                refetchTargetObject()
            }
            return
        }

        movementMethod(delta, targetObject)

    }, [targetUuid, targetObject, refetchTargetObject, tempTarget])

    useIntervalFrame(onFrame)

}