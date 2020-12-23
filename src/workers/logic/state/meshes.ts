import {Object3D} from "three";
import {ValidUUID} from "../../../utils/ids";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";

const storedMeshes: {
    [uuid: string]: Object3D,
} = {}

export const addStoredMesh = (uuid: ValidUUID, object: Object3D) => {
    storedMeshes[uuid] = object
}

export const deleteStoredMesh = (uuid: ValidUUID) => {
    delete storedMeshes[uuid]
}

export const getStoredMesh = (uuid: ValidUUID): Object3D | null => {
    return storedMeshes[uuid] ?? null
}

export const useStoreMesh = (uuid: ValidUUID, object: Object3D) => {

    useLayoutEffect(() => {

        addStoredMesh(uuid, object)

        return () => {
            deleteStoredMesh(uuid)
        }

    }, [uuid, object])

}

export const useTargetObject = (uuid: ValidUUID | null): [Object3D | null, () => void] => {

    const [targetObject, setTargetObject] = useState(() => uuid ? getStoredMesh(uuid) : null)

    const fetch = useCallback(() => {
        const object = uuid ? getStoredMesh(uuid) : null
        setTargetObject(object)
        return object
    }, [uuid])

    useEffect(() => {
        fetch()
    }, [uuid])

    return [targetObject, fetch]

}
