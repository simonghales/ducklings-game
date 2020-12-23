import {MutableRefObject} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../../../physics/bodies";
import {getDucklingUuid} from "../../../../../../../shared/uuids";
import {FixtureType} from "../../../../../../../shared/fixtures";

export const usePhysics = (id: string, ref: MutableRefObject<Object3D>) => {

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        linearDamping: 6,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.1,
            fixtureOptions: {
                density: 2,
                userData: {
                    reactToWater: true,
                    fixtureType: FixtureType.DUCKLING,
                    ducklingId: id,
                }
            },
        }],
    }), {
        uuid: getDucklingUuid(id),
        fwdRef: ref,
        applyAngle: true,
        listenForCollisions: true,
    })

    return [api]

}