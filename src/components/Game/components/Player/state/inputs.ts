import {proxy} from "valtio";

export const playerInputsState = proxy<{
    targetPosition: [number, number] | null,
    xVel: number,
    yVel: number,
    active: boolean,
}>({
    targetPosition: null,
    xVel: 0,
    yVel: 0,
    active: false,
})