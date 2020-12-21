import {MutableRefObject} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {getPlayerUuid} from "../../../../../shared/uuids";
import {FixtureType} from "../../../../../shared/fixtures";
import {Vec2} from "planck-js";

export const collisionRadius = 8

export const usePhysics = (ref: MutableRefObject<Object3D>) => {

    const [,api] = useBody(() => ({
        position: Vec2(-2, 2),
        type: BodyType.dynamic,
        linearDamping: 4,
        fixtures: [
            {
                shape: BodyShape.circle,
                radius: 0.5,
                fixtureOptions: {
                    userData: {
                        fixtureType: FixtureType.PLAYER,
                    }
                },
            },
            {
                shape: BodyShape.circle,
                radius: collisionRadius,
                fixtureOptions: {
                    isSensor: true,
                    userData: {
                    }
                },
            }
        ],
    }), {
        fwdRef: ref,
        applyAngle: true,
        uuid: getPlayerUuid(),
        listenForCollisions: true,
    })

    return [api]

}