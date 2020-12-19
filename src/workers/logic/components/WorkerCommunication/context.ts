import {createContext, useContext} from "react";
import {MessageData} from "../../../../shared/messaging/types";

export type WorkerCommunicationContextState = {
    sendMessageToMain: (message: MessageData) => void,
}

export const WorkerCommunicationContext = createContext(null as unknown as WorkerCommunicationContextState)

export const useWorkerCommunicationContext = (): WorkerCommunicationContextState => {
    return useContext(WorkerCommunicationContext)
}