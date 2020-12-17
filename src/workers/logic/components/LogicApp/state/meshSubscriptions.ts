import {Object3D} from "three";

export const meshSubscriptions: {
    [key: string]: {
        object: Object3D,
        angle: boolean,
    },
} = {}