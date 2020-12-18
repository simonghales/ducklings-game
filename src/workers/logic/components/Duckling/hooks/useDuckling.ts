import {DucklingState, useDucklingState} from "../../../state/ducklings";

export const useDuckling = (id: string): DucklingState => {

    return useDucklingState(id)

}