import {proxy} from "valtio";

export const miscPlayerState = proxy({
    availableFoodSources: false,
})

export const setAvailableFoodSources = (available: boolean) => {
    miscPlayerState.availableFoodSources = available
}