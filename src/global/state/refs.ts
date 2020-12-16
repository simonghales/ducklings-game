import {Object3D} from "three";
import {MutableRefObject, useEffect, useLayoutEffect} from "react";
import {proxy, useProxy} from "valtio";

export const playerGroupRef = {
    ref: new Object3D(),
}

const refsMap = new Map<string, {
    current: Object3D,
}>()

export const setRef = (key: string, object: Object3D) => {
    if (refsMap.has(key)) {
        const ref = refsMap.get(key)
        if (ref) {
            ref.current = object
            return
        }
    }
    refsMap.set(key, {
        current: object,
    })
}

export const getStoredRef = (key: string): MutableRefObject<Object3D> | null => {
    return refsMap.get(key) ?? null
}

export const removeRef = (key: string) => {
    refsMap.delete(key)
}

export const useStoreRef = (key: string, object: Object3D) => {

    useLayoutEffect(() => {
        setRef(key, object)
        // return () => {
        //     removeRef(key)
        // }
    }, [key, object])

}