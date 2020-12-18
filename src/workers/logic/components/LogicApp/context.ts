import {createContext, useContext} from "react";
import {Object3D} from "three";
import {ValidUUID} from "../../../../utils/ids";

export type LogicAppContextState = {
    subscribeMesh: (uuid: ValidUUID, object: Object3D, includeAngle: boolean) => void,
    unsubscribeMesh: (uuid: ValidUUID) => void,
}

export const LogicAppContext = createContext(null as unknown as LogicAppContextState)

export const useLogicAppContext = (): LogicAppContextState => {
    return useContext(LogicAppContext)
}