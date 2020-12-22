export type FoodSourceData = {
    id: string,
    position: [number, number],
}

export const tempFoodSourceData: {
    [key: string]: FoodSourceData
} = {
    food1: {
        id: 'food1',
        position: [-3, 0],
    },
    food2: {
        id: 'food2',
        position: [-3, -2],
    },
    food3: {
        id: 'food3',
        position: [-3, -4],
    }
}