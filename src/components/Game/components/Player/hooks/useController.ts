import {BodyApi} from "../../../../../physics/components/Physics/hooks";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import {playerInputsState} from "../state/inputs";
import {MutableRefObject, useCallback} from "react";
import {Object3D} from "three";
import {calculateAngleBetweenVectors, radians} from "../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";
import {useProxy} from "valtio";
import {calcVector} from "../../../../../utils/vectors";

const vel = Vec2(0, 0)

const localState = {
    prevXVel: 0,
    prevYVel: 0,
}

export const useController = (ref: MutableRefObject<Object3D>, api: BodyApi) => {

    const targetPosition = useProxy(playerInputsState).targetPosition

    const applyVelocity = useCallback((delta: number, xVel: number, yVel: number, applyVelocity: boolean) => {

        localState.prevXVel = numLerp(xVel, localState.prevXVel, 50 * delta)
        localState.prevYVel = numLerp(yVel, localState.prevYVel, 50 * delta)

        const xVelDiff = Math.floor(Math.abs(xVel - localState.prevXVel) * 1000) * 0.01
        const yVelDiff = Math.floor(Math.abs(yVel - localState.prevYVel) * 1000) * 0.01

        const diff = xVelDiff + yVelDiff

        const diffCapped = diff > 50 ? 50 : diff

        const speedLimit = (Math.abs(diffCapped - 50) / 50) * 80 * delta

        let prevAngle = ref.current.rotation.z // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        const vectorAngle = Math.atan2(yVel, xVel) - radians(90)
        api.setAngle(lerpRadians(prevAngle, vectorAngle, 3 * delta))

        if (applyVelocity) {

            vel.set(xVel * speedLimit, yVel * speedLimit)
            api.applyForceToCenter(vel)

        }

    }, [ref, api])

    const travelToDestination = useCallback((delta: number) => {

        // todo - calculate velocity to reach the target...

        if (!targetPosition) return

        const [targetX, targetY] = targetPosition

        const playerX = ref.current.position.x
        const playerY = ref.current.position.y

        const xDiff = Math.abs(targetX - playerX)
        const yDiff = Math.abs(targetY - playerY)

        if (xDiff < 0.07 && yDiff < 0.07) {
            playerInputsState.targetPosition = null
            return
        }

        const vector = calcVector(targetX, playerX, targetY, playerY)

        let xVel = vector[0] * 7
        let yVel = vector[1] * 7

        if (xDiff < 0.5 && yDiff < 0.5) {
            console.log('slow down...', playerX, playerY)
            xVel = xVel / 2
            yVel = yVel / 2
        }

        applyVelocity(delta, xVel, yVel, true)

    }, [applyVelocity, targetPosition])

    const onFrame = useCallback((state: any, delta: number) => {

        if (playerInputsState.targetPosition) {
            travelToDestination(delta)
            return
        }

        const xVel = playerInputsState.xVel * 7
        const yVel = playerInputsState.yVel * 7

        applyVelocity(delta, xVel, yVel, playerInputsState.active)

    }, [ref, api, travelToDestination, applyVelocity])

    useFrame(onFrame)

}