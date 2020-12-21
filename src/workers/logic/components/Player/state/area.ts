import create from "zustand";
import {ValidUUID} from "../../../../../utils/ids";

export enum RangeType {
    FOOD_PLANT
}

type RangeElementsState = {
    range: {
        [id: string]: {
            rangeType: RangeType,
            short: boolean,
            medium: boolean,
        },
    },
    addInRange: (uuid: ValidUUID, rangeType: RangeType, medium?: boolean, short?: boolean) => void,
    removeInRange: (uuid: ValidUUID, medium?: boolean, short?: boolean) => void,
}

export const useRangeElements = create<RangeElementsState>(set => ({
    range: {},
    addInRange: (uuid, rangeType, medium, short) => {
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
                        rangeType,
                        short: true,
                        medium: false,
                    }
                } else if (medium) {
                    range[uuid] = {
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