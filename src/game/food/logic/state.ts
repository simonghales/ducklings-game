import {proxy, useProxy} from "valtio";
import {V2} from "../../../shared/types";
import create from "zustand";

export type FoodSourceData = {
    id: string,
    position: V2,
    food: number,
}

const createFoodSource = (id: string, position: V2): FoodSourceData => {
    return {
        id,
        position,
        food: 50,
    }
}

export const useFoodManager = create<{
    foodSources: {
        [id: string]: FoodSourceData
    }
}>(set => ({
    foodSources: {
        food1: createFoodSource('food1', [-3, 0]),
        food2: createFoodSource('food2', [-3, -2]),
        food3: createFoodSource('food3', [-3, -4]),
    },
}))

export const useFoodSources = (): string[] => {
    const foodSources = useFoodManager(state => state.foodSources)
    return Object.values(foodSources).filter((foodSource) => {
        return foodSource.food > 0
    }).map(foodSource => foodSource.id)
}

export const updateFoodLevel = (id: string, amount: number) => {
    useFoodManager.setState(state => {
        const {foodSources} = state
        return {
            foodSources: {
                ...foodSources,
                [id]: {
                    ...foodSources[id],
                    food: foodSources[id].food - amount
                }
            }
        }
    })
}