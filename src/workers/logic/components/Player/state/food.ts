import {proxy, useProxy} from "valtio";

export const availableFoodSources = proxy<{
    foodSources: {
        [id: string]: number,
    }
}>({
    foodSources: {},
})

export const useAvailableFoodSources = (): string[] => {
    return Object.keys(useProxy(availableFoodSources).foodSources)
}

export const addAvailableFoodSource = (id: string) => {
    availableFoodSources.foodSources[id] = Date.now()
}

export const removeAvailableFoodSource = (id: string) => {
    delete availableFoodSources.foodSources[id]
}