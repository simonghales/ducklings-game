import {useMessagesContext} from "../../../../../../Messages/context";
import {useCallback, useEffect} from "react";
import {getDucklingMessageKey} from "../../../../../../../shared/messaging/keys";
import {DucklingMessageData, DucklingMessageDataType} from "../../../../../../../shared/messaging/types";
import {useDucklingContext} from "../context";


export const useMessages = (id: string) => {

    const {state} = useDucklingContext()

    const {
        subscribeToMessage
    } = useMessagesContext()

    const onMessage = useCallback((data: DucklingMessageData) => {
        switch (data.type) {
            case DucklingMessageDataType.QUACK:
                state.lastQuack = Date.now()
                break;
        }
    }, [id])

    useEffect(() => {

        const unsubscribe = subscribeToMessage(getDucklingMessageKey(id), onMessage)

        return () => {
            unsubscribe()
        }

    }, [id, subscribeToMessage])

}