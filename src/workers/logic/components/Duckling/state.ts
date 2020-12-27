import {proxy} from "valtio";
import {ValidUUID} from "../../../../utils/ids";

export type DucklingLocalState = {
    foodLevel: number,
    physicalCollisions: {
      [uuid: string]: ValidUUID,
    },
    foodSourcesInRange: {
        [id: string]: {
            added: number,
        }
    },
}

export const generateDucklingLocalState = (): DucklingLocalState => {
    return proxy({
        foodLevel: 50,
        physicalCollisions: {},
        foodSourcesInRange: {},
    })
}

export const increaseFoodLevel = (localState: DucklingLocalState, amount: number) => {
    localState.foodLevel += amount
}

export const addPhysicalCollision = (localState: DucklingLocalState, uuid: ValidUUID) => {
    localState.physicalCollisions[uuid] = uuid
}

export const removePhysicalCollision = (localState: DucklingLocalState, uuid: ValidUUID) => {
    delete localState.physicalCollisions[uuid]
}

export const addFoodSourceToDucklingRange = (localState: DucklingLocalState, foodId: string) => {
    localState.foodSourcesInRange[foodId] = {
        added: Date.now()
    }
}

export const removeFoodSourceFromDucklingRange = (localState: DucklingLocalState, foodId: string) => {
    delete localState.foodSourcesInRange[foodId]
}