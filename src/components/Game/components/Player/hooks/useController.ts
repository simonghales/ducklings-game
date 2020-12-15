import {BodyApi} from "../../../../../physics/components/Physics/hooks";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import {playerInputsState} from "../state/inputs";

const vel = Vec2(0, 0)

export const useController = (api: BodyApi) => {

    useFrame((state, delta) => {

        if (playerInputsState.active) {
            vel.set(playerInputsState.xVel * 250 * delta, playerInputsState.yVel * 250 * delta)
            api.applyForceToCenter(vel)
        }

        // api.applyLinearImpulse(Vec2(0, 0.01), Vec2(0, 0))

    })

}