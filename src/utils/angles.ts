import {PI} from "./numbers";

export const radians = (degrees: number): number => {
    return (degrees * Math.PI) / 180
}


const TAU = 2 * PI;
const PITAU = PI + TAU;

export const getRadianAngleDifference = (a: number, b: number): number => {
    return ( b - a + PITAU ) % TAU - PI
}