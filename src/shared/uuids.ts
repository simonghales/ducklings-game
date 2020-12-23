import {ValidUUID} from "../utils/ids";

export const getFoodUuid = (id: string): ValidUUID => {
    return `food-${id}`
}

export const getPlayerUuid = (): ValidUUID => {
    return `player`
}

export const getDucklingUuid = (id: string): ValidUUID => {
    return `duckling-${id}`
}

export const getPlantUuid = (id: string): ValidUUID => {
    return `plant-${id}`
}