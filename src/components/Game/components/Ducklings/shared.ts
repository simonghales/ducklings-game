import {DucklingData} from "../../../../global/state/ducklings";
import {getDucklingRefKey} from "./components/Duckling/Duckling";

export const getSortedDucklings = (ducklings: {[key: string]: DucklingData}): DucklingData[] => {
    return Object.values(ducklings).sort((duckA, duckB) => (duckA.position ?? 999) - (duckB.position ?? 999))
}

export const getClosestDuckRefKey = (index: number, sortedDucklings: DucklingData[]): string => {
    return index === 0 ? "player" : getDucklingRefKey(sortedDucklings[index - 1].id)
}