import {proxy, useProxy} from "valtio";
import create from "zustand";

export const playerDucklingsRangeState: {
    largeRange: {
        [id: string]: number,
    },
    mediumRange: {
        [id: string]: number,
    },
} = proxy({
    largeRange: {},
    mediumRange: {},
})

export const setDucklingInMediumRange = (id: string, inRange: boolean) => {
    if (inRange) {
        playerDucklingsRangeState.mediumRange[id] = Date.now()
    } else {
        delete playerDucklingsRangeState.mediumRange[id]
    }
}

export const setDucklingInLargeRange = (id: string, inRange: boolean) => {
    if (inRange) {
        playerDucklingsRangeState.largeRange[id] = Date.now()
    } else {
        delete playerDucklingsRangeState.largeRange[id]
    }
}

export const useDucklingsInRange = (): string[] => {
    const ducklingsLargeRange = useProxy(playerDucklingsRangeState).largeRange
    return Object.keys(ducklingsLargeRange)
}