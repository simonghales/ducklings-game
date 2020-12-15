import {BodyApi} from "../../../../../physics/components/Physics/hooks";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import {playerInputsState} from "../state/inputs";
import {MutableRefObject} from "react";
import {Object3D} from "three";
import {radians} from "../../../../../utils/angles";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";

const vel = Vec2(0, 0)

const localState = {
    prevXVel: 0,
    prevYVel: 0,
}

export const useController = (ref: MutableRefObject<Object3D>, api: BodyApi) => {

    useFrame((state, delta) => {

        const xVel = playerInputsState.xVel * 7
        const yVel = playerInputsState.yVel * 7
        localState.prevXVel = numLerp(xVel, localState.prevXVel, 50 * delta)
        localState.prevYVel = numLerp(yVel, localState.prevYVel, 50 * delta)

        const xVelDiff = Math.floor(Math.abs(xVel - localState.prevXVel) * 1000) * 0.01
        const yVelDiff = Math.floor(Math.abs(yVel - localState.prevYVel) * 1000) * 0.01

        const diff = xVelDiff + yVelDiff

        const diffCapped = diff > 50 ? 50 : diff

        const speedLimit = Math.abs(diffCapped - 50) / 50

        let prevAngle = ref.current.rotation.z // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        const vectorAngle = Math.atan2(yVel, xVel) - radians(90)
        api.setAngle(lerpRadians(prevAngle, vectorAngle, 3 * delta))

        if (playerInputsState.active) {

            vel.set(xVel * speedLimit, yVel * speedLimit)
            api.applyForceToCenter(vel)

        }

    })

}