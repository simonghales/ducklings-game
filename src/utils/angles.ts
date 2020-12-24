import {PI} from "./numbers";

export const radians = (degrees: number): number => {
    return (degrees * Math.PI) / 180
}


const TAU = 2 * PI;
const PITAU = PI + TAU;

export const getRadianAngleDifference = (a: number, b: number): number => {
    return ( b - a + PITAU ) % TAU - PI
}

export const calculateAngleBetweenVectors = (x1: number, x2: number, y1: number, y2: number): number => {
    return Math.atan2((x1 - x2), (y1 - y2))
}

export const calculateAngleFromVector = (x: number, y: number): number => {
    return Math.atan2(x, y)
}