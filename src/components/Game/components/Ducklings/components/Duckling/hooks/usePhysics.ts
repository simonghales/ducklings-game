import {MutableRefObject} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../../../physics/bodies";

export const usePhysics = (ref: MutableRefObject<Object3D>) => {

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        linearDamping: 6,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.1,
            fixtureOptions: {
                density: 5,
            },
        }],
    }), {
        fwdRef: ref,
        applyAngle: true,
    })

    return [api]

}