import {Object3D} from "three";
import {useEffect, useLayoutEffect} from "react";
import {proxy, useProxy} from "valtio";

export const playerGroupRef = {
    ref: new Object3D(),
}

export const storedRefs: {
    [key: string]: Object3D,
} = {}

const refsMap = new Map<string, Object3D>()

export const addRef = (key: string, object: Object3D) => {
    refsMap.set(key, object)
    // console.log('addRef', key)
    // storedRefs[key] = object
}

export const getStoredRef = (key: string): Object3D | null => {
    // console.log('getStoredRef', key)
    return refsMap.get(key) ?? null
    // return storedRefs[key] ?? null
}

// export const useStoredRef = (key: string): Object3D | null => {
//     const proxyState = useProxy(storedRefs)
//     return proxyState[key] as unknown as Object3D ?? null
// }

export const removeRef = (key: string) => {
    refsMap.delete(key)
    // console.log('remove ref', key)
    // delete storedRefs[key]
}

export const useStoreRef = (key: string, object: Object3D) => {

    useLayoutEffect(() => {
        addRef(key, object)
        return () => {
            removeRef(key)
        }
    }, [key, object])

}