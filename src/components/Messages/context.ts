import {createContext, useContext} from "react";
import {MessageData} from "../../shared/messaging/types";

export type MessagesContextState = {
    handleMessage: (message: MessageData) => void,
    subscribeToMessage: (messageKey: string, callback: (data: any) => void) => () => void,
}

export const MessagesContext = createContext(null as unknown as MessagesContextState)

export const useMessagesContext = () => {
    return useContext(MessagesContext)
}