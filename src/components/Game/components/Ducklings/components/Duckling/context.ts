import {createContext, useContext} from "react";
import {DucklingState} from "./state";

export type DucklingContextState = {
    state: DucklingState,
}

export const DucklingContext = createContext(null as unknown as DucklingContextState)

export const useDucklingContext = (): DucklingContextState => {
    return useContext(DucklingContext)
}