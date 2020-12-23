import create from "zustand";
import {ValidUUID} from "../../../../../utils/ids";
import {proxy, useProxy} from "valtio";

export const displacementRange = proxy<{
    range: {
        [id: string]: ValidUUID,
    }
}>({
    range: {},
})

export const addToDisplacementRange = (uuid: ValidUUID) => {
    displacementRange.range[uuid] = uuid
}

export const removeFromDisplacementRange = (uuid: ValidUUID) => {
    delete displacementRange.range[uuid]
}

export const useDisplacementRange = (): string[] => {
    return Object.keys(useProxy(displacementRange).range)
}

export enum RangeType {
    FOOD_PLANT
}

type RangeElementsState = {
    range: {
        [uuid: string]: {
            id: string,
            rangeType: RangeType,
            short: boolean,
            medium: boolean,
        },
    },
    addInRange: (uuid: ValidUUID, id: string, rangeType: RangeType, medium?: boolean, short?: boolean) => void,
    removeInRange: (uuid: ValidUUID, medium?: boolean, short?: boolean) => void,
}

export const useRangeElements = create<RangeElementsState>(set => ({
    range: {},
    addInRange: (uuid, id, rangeType, medium, short) => {
        return set(state => {
            const {range} = state
            if (range[uuid]) {
                if (short) {
                    range[uuid].short = true
                } else if (medium) {
                    range[uuid].medium = true
                }
            } else {
                if (short) {
                    range[uuid] = {
                        id,
                        rangeType,
                        short: true,
                        medium: false,
                    }
                } else if (medium) {
                    range[uuid] = {
                        id,
                        rangeType,
                        short: false,
                        medium: true,
                    }
                }
            }
            return {
                range: {
                    ...range,
                }
            }
        })
    },
    removeInRange: (uuid, medium, short) => {
        return set(state => {
            const {range} = state
            if (range[uuid]) {
                if (short) {
                    range[uuid].short = false
                } else if (medium) {
                    range[uuid].medium = false
                }
                const element = range[uuid]
                if (!element.short && !element.medium) {
                    delete range[uuid]
                }
            }
            return {
                range: {
                    ...range,
                }
            }
        })
    },
}))

const {
    addInRange,
    removeInRange
} = useRangeElements.getState()

export {
    addInRange,
    removeInRange
}