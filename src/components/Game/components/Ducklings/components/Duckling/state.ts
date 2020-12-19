import {proxy} from "valtio";

export type DucklingState = {
    lastQuack: number,
}

export const generateDucklingState = () => {
    return proxy<DucklingState>({
        lastQuack: 0,
    })
}