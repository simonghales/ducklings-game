import {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {getStoredRef} from "../../../../../../../global/state/refs";
import {radians} from "../../../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../../../utils/numbers";
import {BodyApi} from "../../../../../../../physics/components/Physics/hooks";
import {Vec2} from "planck-js";
import {ducklingTargets} from "../../../state/targets";
import {getClosestDuckRefKey, getSortedDucklings} from "../../../shared";
import {useDucklingsStore} from "../../../../../../../global/state/ducklings";
import {getDucklingTargetRefKey} from "../Duckling";

let tick = 0

const vector = Vec2(0, 0)

const calculateCheapDistance = (x: number, x2: number, y: number, y2: number): number => {
    return Math.pow(Math.abs(x - x2), 2) + Math.pow(Math.abs(y - y2), 2)
}

let odd = false

export const useBrain = (ducklingKey: string,
                         ref: MutableRefObject<Object3D>,
                         followRefKey: string,
                         api: BodyApi,
                         targetRef: MutableRefObject<Object3D>,
                         extendedTargetRef: MutableRefObject<Object3D>,
                         position: number | null,
                         debug: boolean,) => {

    const updateDucklingPosition = useDucklingsStore(state => state.updateDucklingPosition)

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

    const [tempTargetKey, setTempTargetKey] = useState("")
    const [tempTarget, setTempTarget] = useState<Object3D | null>(null)
    const [tempPosition, setTempPosition] = useState<number | null>(null)
    const [initChain, setInitChain] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setInitChain(true)
        }, 50)
    }, [])

    const clearTempTarget = useCallback(() => {
        setTempTargetKey('')
        setTempTarget(null)
        setTempPosition(null)
        localStateRef.current.requestedPosition = null
        localStateRef.current.positionCooldown = Date.now()
    }, [])

    useEffect(() => {
        console.log('new? position', position)
        clearTempTarget()
    }, [position])

    const ducklingsInChain = useMemo(() => {

        let chain: {
            ref: MutableRefObject<Object3D>,
            refKey: string,
            position: number,
        }[] = []

        if (position != null) {
            const ducklings = useDucklingsStore.getState().ducklings
            const sortedDucklings = getSortedDucklings(ducklings)
            sortedDucklings.forEach((duckling, index) => {
                if (duckling.position != null && duckling.position < position) {
                    const ducklingRefKey = getDucklingTargetRefKey(duckling.id)
                    const ducklingRef = getStoredRef(ducklingRefKey)
                    if (ducklingRef) {
                        chain.push({
                            ref: ducklingRef,
                            refKey: ducklingRefKey,
                            position: duckling.position,
                        })
                    }
                }
            })
        }

        return chain

    }, [position, initChain])

    const setNewTempTarget = useCallback((position: number) => {
        console.log('setNewTempTarget', position)
        const ducklings = useDucklingsStore.getState().ducklings
        const sortedDucklings = getSortedDucklings(ducklings)
        const targetRefKey = getClosestDuckRefKey(position, sortedDucklings)
        const targetRef = getStoredRef(targetRefKey)
        if (targetRef && targetRef.current) {
            setTempTargetKey(targetRefKey)
            setTempTarget(targetRef.current)
            setTempPosition(position)
            localStateRef.current.requestedPositionTimestamp = Date.now()
        } else {
            setTempTargetKey("")
            setTempTarget(null)
            setTempPosition(null)
        }
    }, [])

    const changePosition = useCallback((newPosition: number) => {
        console.log('changePosition', newPosition)
        updateDucklingPosition(ducklingKey, newPosition)
    }, [updateDucklingPosition, ducklingKey])


    // useEffect(() => {
    //
    //     if (debug) {
    //         setInterval(() => {
    //             odd = !odd
    //             changePosition(odd ? 0 : 3)
    //         }, 5000)
    //     }
    //
    // }, [debug])


    const checkForCloseToTempTarget = useCallback(() => {

        if (!tempTarget || tempPosition == null) return

        if (localStateRef.current.requestedPositionTimestamp < Date.now() - 2000) {
            console.log('time is up...')
            clearTempTarget()
            return
        }

        if (localStateRef.current.requestedPosition === tempPosition) {
            return
        }

        const currentX = ref.current.position.x
        const currentY = ref.current.position.y

        const targetX = tempTarget.position.x
        const targetY = tempTarget.position.y

        const currentDistance = calculateCheapDistance(currentX, targetX, currentY, targetY)

        if (currentDistance < 1) {
            console.log('close enough so im claiming it...')
            changePosition(tempPosition)
            localStateRef.current.requestedPosition = tempPosition
        }

    }, [tempTarget, tempPosition, changePosition, clearTempTarget])

    const checkForCloserTarget = useCallback((currentTargetX: number, currentTargetY: number) => {

        if (localStateRef.current.positionCooldown > Date.now() - 2000) {
            return
        }

        const currentX = ref.current.position.x
        const currentY = ref.current.position.y

        const currentDistance = calculateCheapDistance(currentX, currentTargetX, currentY, currentTargetY)

        if (currentDistance > 2.5) {
            ducklingsInChain.forEach(({ref: ducklingRef, position: ducklingPosition}) => {
                const ducklingDistance = calculateCheapDistance(currentX, ducklingRef.current.position.x, currentY, ducklingRef.current.position.y)
                if (ducklingDistance < currentDistance) {
                    const difference = currentDistance - ducklingDistance
                    if (difference > 1.5) {
                        setNewTempTarget(ducklingPosition)
                    }
                }
            })
        }


    }, [ducklingsInChain])

    const moveTowardsTarget = useCallback((followObject: Object3D, targetRefKey: string, delta: number, tempTarget: boolean = false) => {

        const tickDebug = tick % 20 === 0

        if (debug) {
            tick += 1
        }

        const movedXDiff = Math.abs(ref.current.position.x - localStateRef.current.previousMeshX)
        const movedYDiff = Math.abs(ref.current.position.y - localStateRef.current.previousMeshY)

        if (movedXDiff > 3 || movedYDiff > 3) {
            console.log('movedXDiff', movedXDiff, movedYDiff, localStateRef.current.previousXVel, localStateRef.current.previousYVel)
        }

        localStateRef.current.previousMeshX = ref.current.position.x
        localStateRef.current.previousMeshY = ref.current.position.y


        const localState = localStateRef.current

        let targetX = followObject.position.x
        let targetY = followObject.position.y

        let followAngle = followObject.rotation.z
        if (followAngle > PI) {
            followAngle -= PI_TIMES_TWO
        }

        const followXDir = Math.sin(followAngle)
        const followYDir = Math.cos(followAngle)

        const offset = targetRefKey === 'player' ? 1 : 0.5

        targetX += followXDir * offset
        targetY += followYDir * -1 * offset

        // targetX = numLerp(targetX, localStateRef.current.lerpedTargetX, 55 * delta)
        // targetY = numLerp(targetY, localStateRef.current.lerpedTargetY, 55 * delta)
        //
        // localStateRef.current.lerpedTargetX = targetX
        // localStateRef.current.lerpedTargetY = targetY

        const extendedTargetX = targetX + (followXDir * 0.33)
        const extendedTargetY = targetY + (followYDir * -1 * 0.33)

        extendedTargetRef.current.position.x = extendedTargetX
        extendedTargetRef.current.position.y = extendedTargetY


        const moveXDiff = targetX - ref.current.position.x
        const moveYDiff = targetY - ref.current.position.y

        const moveAverage = (Math.abs(moveXDiff) + Math.abs(moveYDiff)) / 2

        const moveFactor = numLerp(0.25, 0.75, moveAverage < 1 ? moveAverage : 1)

        // const vectorAngle = followObject.rotation.z
        let vectorAngle = Math.atan2(moveYDiff, moveXDiff) - radians(90)
        vectorAngle = lerpRadians(followAngle, vectorAngle, moveFactor)

        if (vectorAngle > PI) {
            vectorAngle -= PI_TIMES_TWO
        }

        let prevAngle = ref.current.rotation.z // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        api.setAngle(lerpRadians(vectorAngle, prevAngle, 50 * delta))

        const xDir = Math.sin(vectorAngle)
        const yDir = Math.cos(vectorAngle)

        const xDiff = xDir - localState.previousXDir
        const yDiff = yDir - localState.previousYDir
        const xDiffCalc = Math.abs(xDiff * 1000 * delta)
        const yDiffCalc = Math.abs(yDiff * 1000 * delta)

        localState.previousXDir = xDir
        localState.previousYDir = yDir

        const adjustedXDir = numLerp(xDir, localState.previousXDir, 55 * delta)
        const adjustedYDir = numLerp(yDir, localState.previousYDir, 55 * delta)

        localState.previousXDir = adjustedXDir
        localState.previousYDir = adjustedYDir

        targetRef.current.position.x = targetX
        targetRef.current.position.y = targetY

        if (position != null) {
            ducklingTargets[position].x = targetX
            ducklingTargets[position].y = targetY
        }

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

        vector.set(xVel, yVel)

        api.applyForceToCenter(vector)

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousX = followObject.position.x
        localState.previousY = followObject.position.y
        localState.previousXVel = xVel
        localState.previousYVel = yVel

        const currentDistance = calculateCheapDistance(ref.current.position.x, targetX, ref.current.position.y, targetY)

        // if (debug) {
        //     if (currentDistance > 1) {
        //         console.log('currentDistance', currentDistance)
        //     }
        // }

        if (!tempTarget) {
            checkForCloserTarget(targetX, targetY)
        } else {
            checkForCloseToTempTarget()
        }

    }, [checkForCloserTarget, checkForCloseToTempTarget])

    const onFrame = useCallback((state: any, delta: number) => {

        if (tempTarget) {
            return moveTowardsTarget(tempTarget, tempTargetKey, delta, true)
        }

        if (!followRef.current) {
            followRef.current = getStoredRef(followRefKey)
        }
        const followObject = followRef.current?.current
        if (!followObject) {
            console.log('no follow object?', followRefKey)
            return
        }
        return moveTowardsTarget(followObject, followRefKey, delta)

    }, [tempTarget, tempTargetKey, moveTowardsTarget])

    const followRef = useRef<MutableRefObject<Object3D> | null>(getStoredRef(followRefKey))

    useEffect(() => {
        followRef.current = getStoredRef(followRefKey)
        console.log('followRefKey changed', followRefKey)
    }, [followRefKey])

    useFrame(onFrame)

}