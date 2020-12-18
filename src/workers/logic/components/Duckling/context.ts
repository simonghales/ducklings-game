import {createContext, useContext} from "react";

export type DucklingContextState = {
    id: string,
}

export const DucklingContext = createContext(null as unknown as DucklingContextState)

export const useDucklingContext = (): DucklingContextState => {
    return useContext(DucklingContext)
}

export const useDucklingId = (): string => {
    return useDucklingContext().id
}