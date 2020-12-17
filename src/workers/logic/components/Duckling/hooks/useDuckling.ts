import {DucklingState, getDucklingState} from "../../../state/ducklings";
import {useProxy} from "valtio";

export const useDuckling = (id: string): DucklingState => {

    return useProxy(getDucklingState(id))

}