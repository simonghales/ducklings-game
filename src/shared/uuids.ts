import {ValidUUID} from "../utils/ids";

export const getPlayerUuid = (): ValidUUID => {
    return `player`
}

export const getDucklingUuid = (id: string): ValidUUID => {
    return `duckling-${id}`
}