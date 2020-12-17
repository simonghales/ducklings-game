import {ValidUUID} from "../../../../../utils/ids";
import {useLogicAppContext} from "../context";
import {MutableRefObject, useEffect} from "react";
import {Object3D} from "three";


export const useSyncBody = (uuid: ValidUUID, ref: MutableRefObject<Object3D>, includeAngle: boolean = true) => {

    const {
        subscribeMesh,
        unsubscribeMesh
    } = useLogicAppContext()

    useEffect(() => {

        subscribeMesh(uuid, ref.current, includeAngle)

        return () => {
            unsubscribeMesh(uuid)
        }

    }, [uuid, ref, includeAngle])

}