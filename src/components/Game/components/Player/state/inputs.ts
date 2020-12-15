import {proxy} from "valtio";

export const playerInputsState = proxy<{
    xVel: number,
    yVel: number,
    active: boolean,
}>({
    xVel: 0,
    yVel: 0,
    active: false,
})