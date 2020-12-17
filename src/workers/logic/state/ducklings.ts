import {proxy} from "valtio";

export type DucklingState = {
    id: string,
    order: number,
}

const generateDucklingState = (id: string, order: number): DucklingState => {
    return proxy({
        id,
        order,
    })
}

export const ducklingsState = proxy<{
    [id: string]: DucklingState,
}>({
    'A': generateDucklingState('A', 0),
    'B': generateDucklingState('B', 1),
    'C': generateDucklingState('C', 2),
    'D': generateDucklingState('D', 3),
    'E': generateDucklingState('E', 4),
})

export const getSortedDucklings = (): DucklingState[] => {
    return Object.values(ducklingsState).sort((ducklingA, ducklingB) => {
        return ducklingA.order - ducklingB.order
    })
}

export const getDucklingState = (id: string): DucklingState => {
    const state = ducklingsState[id]
    if (!state) {
        throw new Error(`No duckling found for: ${id}`)
    }
    return state
}