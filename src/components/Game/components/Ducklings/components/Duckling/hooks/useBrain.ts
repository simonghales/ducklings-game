import {MutableRefObject, useEffect, useRef} from "react";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {getStoredRef} from "../../../../../../../global/state/refs";
import {radians} from "../../../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../../../utils/numbers";
import {BodyApi} from "../../../../../../../physics/components/Physics/hooks";
import {Vec2} from "planck-js";
import {ducklingTargets} from "../../../state/targets";
import {useDucklingsStore} from "../../../../../../../global/state/ducklings";

let tick = 0

const vector = Vec2(0, 0)

const calculateCheapDistance = (x: number, x2: number, y: number, y2: number): number => {
    return Math.pow(Math.abs(x - x2), 2) + Math.pow(Math.abs(y - y2), 2)
}

export const useOLDBrain = (ducklingKey: string, ref: MutableRefObject<Object3D>, followRefKey: string, api: BodyApi, targetRef: MutableRefObject<Object3D>, extendedTargetRef: MutableRefObject<Object3D>, position: number | null, debug: boolean) => {

    const updateDucklingPosition = useDucklingsStore(state => state.updateDucklingPosition)

    const localStateRef = useRef({
        previousX: 0,
        previousY: 0,
        previousXDir: 0,
        previousYDir: 0,
        previousTargetX: 0,
        previousTargetY: 0,
    })

    const changeDesireRef = useRef<{
        desire: number,
        targetPosition: number | null,
        lockedTargetPosition: number | null,
        lockedTargetPositionTimestamp: number,
        lastUpdated: number,
    }>({
        desire: 0,
        targetPosition: null,
        lockedTargetPosition: null,
        lockedTargetPositionTimestamp: 0,
        lastUpdated: 0,
    })

    useEffect(() => {
        console.log(`DUCK-${ducklingKey}: position: ${position}`)
        changeDesireRef.current.lockedTargetPosition = null
    }, [position])

    const followRef = useRef<MutableRefObject<Object3D> | null>(getStoredRef(followRefKey))

    useEffect(() => {
        followRef.current = getStoredRef(followRefKey)
    }, [followRefKey])

    useFrame((state, delta) => {
        if (!followRef.current) {
            followRef.current = getStoredRef(followRefKey)
        }
        const followObject = followRef.current?.current
        if (!followObject) {
            console.log('no follow object?', followRefKey)
            return
        }
        const tickDebug = tick % 20 === 0
        if (debug) {
            tick += 1
        }
        const localState = localStateRef.current

        let targetX = followObject.position.x
        let targetY = followObject.position.y

        let followAngle = followObject.rotation.z
        if (followAngle > PI) {
            followAngle -= PI_TIMES_TWO
        }

        const followXDir = Math.sin(followAngle)
        const followYDir = Math.cos(followAngle)

        const offset = followRefKey === 'player' ? 1 : 0.5

        targetX += followXDir * offset
        targetY += followYDir * -1 * offset

        const {lockedTargetPosition, lockedTargetPositionTimestamp} = changeDesireRef.current

        // if (lockedTargetPosition != null) {
        //
        //     const timeElapsed = Date.now() - lockedTargetPositionTimestamp
        //
        //     if (timeElapsed > 5000) {
        //         if (lockedTargetPosition < 5) {
        //             changeDesireRef.current.lockedTargetPositionTimestamp = Date.now()
        //             changeDesireRef.current.lockedTargetPosition = 4
        //             console.log('try a new position')
        //         } else {
        //             changeDesireRef.current.lockedTargetPosition = null
        //             console.log('give up?', lockedTargetPosition)
        //         }
        //     }
        //
        //     const {x, y} = ducklingTargets[lockedTargetPosition]
        //     targetX = x
        //     targetY = y
        //     const distance = calculateCheapDistance(targetX, ref.current.position.x, targetY, ref.current.position.y)
        //     if (distance < 0.33) {
        //         updateDucklingPosition(ducklingKey, lockedTargetPosition)
        //         changeDesireRef.current.lockedTargetPosition = null
        //         changeDesireRef.current.lastUpdated = Date.now()
        //         console.log(`DUCK-${ducklingKey}: lock in target position`)
        //     } else if (distance < 0.5) {
        //         // console.log('semi close to new target')
        //     }
        // }

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

        if (position != null && changeDesireRef.current.lockedTargetPosition == null) {
            ducklingTargets[position].x = targetX
            ducklingTargets[position].y = targetY
        }

        const xValue = Math.floor(Math.abs(moveXDiff) * 1000) / 1000
        let xVel = Math.pow(xValue, 1.75)

        const yValue = Math.floor(Math.abs(moveYDiff) * 1000) / 1000
        let yVel = Math.pow(yValue, 1.75)

        if (moveXDiff < 0) {
            xVel *= -1
        }

        if (moveYDiff < 0) {
            yVel *= -1
        }

        vector.set(xVel * 2, yVel * 2)

        api.applyForceToCenter(vector)

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousX = followObject.position.x
        localState.previousY = followObject.position.y

        // if (lockedTargetPosition == null && changeDesireRef.current.lastUpdated < Date.now() - 5000) {
        //     const distance = Math.pow(Math.abs(moveXDiff), 2) + Math.pow(Math.abs(moveYDiff), 2)
        //
        //     let newCloserTarget = false
        //
        //     for (let i = 0; i < (position ?? 5); i++) {
        //         if (!newCloserTarget) {
        //             const {x,y} = ducklingTargets[i]
        //             const otherTargetDistance = calculateCheapDistance(x, ref.current.position.x, y, ref.current.position.y)
        //             if (otherTargetDistance < distance) {
        //                 const difference = distance - otherTargetDistance
        //                 if (difference > 0.1) {
        //                     changeDesireRef.current.targetPosition = i
        //                     console.log(`DUCK-${ducklingKey}: setting target position...`, i)
        //                     newCloserTarget = true
        //                 }
        //             }
        //         }
        //     }
        //
        //     let newDesire = changeDesireRef.current.desire
        //
        //     if (newCloserTarget) {
        //         newDesire = newDesire + (500 * delta)
        //         if (newDesire > 100) {
        //             newDesire = 100
        //         }
        //     } else {
        //         changeDesireRef.current.targetPosition = null
        //         newDesire = newDesire - (500 * delta)
        //         if (newDesire < 0) {
        //             newDesire = 0
        //         }
        //     }
        //
        //     changeDesireRef.current.desire = newDesire
        //
        // }
        //
        // if (changeDesireRef.current.targetPosition != null && changeDesireRef.current.desire >= 100) {
        //     console.log(`change position from ${position} to ${changeDesireRef.current.targetPosition}`)
        //     changeDesireRef.current.lockedTargetPositionTimestamp = Date.now()
        //     changeDesireRef.current.lockedTargetPosition = changeDesireRef.current.targetPosition
        //     updateDucklingPosition(ducklingKey, null)
        //     changeDesireRef.current.targetPosition = null
        //     changeDesireRef.current.desire = 0
        // }

    })

}