import {proxy} from "valtio";

export type DucklingLocalState = {
    foodSourcesInRange: {
        [id: string]: {
            added: number,
        }
    },
}

export const generateDucklingLocalState = (): DucklingLocalState => {
    return proxy({
        foodSourcesInRange: {},
    })
}

export const addFoodSourceToDucklingRange = (localState: DucklingLocalState, foodId: string) => {
    localState.foodSourcesInRange[foodId] = {
        added: Date.now()
    }
}

export const removeFoodSourceFromDucklingRange = (localState: DucklingLocalState, foodId: string) => {
    delete localState.foodSourcesInRange[foodId]
}