import {proxy} from "valtio";
import create from "zustand";

export const usePlayerDucklingsState = create<{
    ducklingsInRange: {
        [id: string]: number,
    },
    setDucklingInRange: (id: string, inRange: boolean) => void,
}>(set => ({
    ducklingsInRange: {},
    setDucklingInRange: (id: string, inRange: boolean) => {
        return set(state => {
            const ducklingsInRange = {...state.ducklingsInRange}
            if (inRange) {
                ducklingsInRange[id] = Date.now()
            } else {
                delete ducklingsInRange[id]
            }
            return {
                ducklingsInRange,
            }
        })
    },
}))

export const useDucklingsInRange = (): string[] => {
    return usePlayerDucklingsState(state => Object.keys(state.ducklingsInRange))
}

const {setDucklingInRange} = usePlayerDucklingsState.getState()

export {
    setDucklingInRange
}