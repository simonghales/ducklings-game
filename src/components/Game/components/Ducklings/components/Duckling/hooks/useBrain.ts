import {MutableRefObject, useRef} from "react";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {getStoredRef, storedRefs} from "../../../../../../../global/state/refs";
import {radians} from "../../../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../../../utils/numbers";
import {BodyApi} from "../../../../../../../physics/components/Physics/hooks";
import {Vec2} from "planck-js";

let tick = 0

const vector = Vec2(0, 0)

export const useBrain = (ref: MutableRefObject<Object3D>, followRefKey: string, api: BodyApi, targetRef: MutableRefObject<Object3D>) => {

    const localStateRef = useRef({
        previousX: 0,
        previousY: 0,
        previousXDir: 0,
        previousYDir: 0,
        previousTargetX: 0,
        previousTargetY: 0,
    })

    const followRef = useRef<Object3D | null>(getStoredRef(followRefKey))

    useFrame((state, delta) => {
        if (!followRef.current) {
            followRef.current = getStoredRef(followRefKey)
        }
        const followObject = followRef.current
        if (!followObject) {
            console.log('no follow object?', followRefKey)
            return
        }
        const debug = tick % 10 === 0 && followRefKey === 'player'
        if (followRefKey === 'player') {
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

        const moveXDiff = targetX - ref.current.position.x
        const moveYDiff = targetY - ref.current.position.y

        // console.log('moveXDiff', moveXDiff, moveYDiff)

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


            // if (xDiffCalc > 0.005 || yDiffCalc > 0.005) {
                const adjustedXDir = numLerp(xDir, localState.previousXDir, 55 * delta)
                const adjustedYDir = numLerp(yDir, localState.previousYDir, 55 * delta)



                // targetX = targetX + ((adjustedXDir))
                // targetY = targetY + ((adjustedYDir * -1))
                localState.previousXDir = adjustedXDir
                localState.previousYDir = adjustedYDir
            // } else {
                // targetX = targetX + ((localState.previousXDir))
                // targetY = targetY + ((localState.previousYDir * -1))
            // }

            // console.log('vectorAngle', xDir, yDir)
        // }

        // targetX = numLerp(targetX, localState.previousTargetX, 55 * delta)
        // targetY = numLerp(targetY, localState.previousTargetX, 55 * delta)


        targetRef.current.position.x = targetX
        targetRef.current.position.y = targetY

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

        // console.log('xVel', xVel, (moveXDiff) * 7.5)

        vector.set(xVel * 2, yVel * 2)

        api.applyForceToCenter(vector)

        // ref.current.position.x = targetX
        // ref.current.position.y = targetY

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousX = followObject.position.x
        localState.previousY = followObject.position.y
    })

}