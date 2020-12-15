import {MutableRefObject} from "react";
import {Object3D} from "three";
import {useBody} from "../../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";

export const usePhysics = (ref: MutableRefObject<Object3D>) => {

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        linearDamping: 4,
        fixtures: [{
            shape: BodyShape.box,
            hx: 0.6,
            hy: 1.2,
            fixtureOptions: {},
        }],
    }), {
        fwdRef: ref,
    })

    return [api]

}