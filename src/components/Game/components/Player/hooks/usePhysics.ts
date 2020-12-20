import {MutableRefObject} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {getPlayerUuid} from "../../../../../shared/uuids";

export const collisionRadius = 8

export const usePhysics = (ref: MutableRefObject<Object3D>) => {

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        linearDamping: 4,
        fixtures: [
            {
                shape: BodyShape.circle,
                radius: 0.5,
                fixtureOptions: {},
            },
            {
                shape: BodyShape.circle,
                radius: collisionRadius,
                fixtureOptions: {
                    isSensor: true,
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