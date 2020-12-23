import {createContext, useContext} from "react";
import {DucklingLocalState} from "./state";

export type DucklingContextState = {
    id: string,
    localState: DucklingLocalState,
}

export const DucklingContext = createContext(null as unknown as DucklingContextState)

export const useDucklingContext = (): DucklingContextState => {
    return useContext(DucklingContext)
}

export const useDucklingId = (): string => {
    return useDucklingContext().id
}

export const useDucklingLocalState = (): DucklingLocalState => {
    return useDucklingContext().localState
}