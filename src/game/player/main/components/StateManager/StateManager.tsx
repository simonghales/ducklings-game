import React, {useCallback, useEffect} from "react";
import {useSubscribeToMessage} from "../../../../../components/Messages/context";
import {getPlayerStateSyncKey} from "../../../../../shared/messaging/keys";
import {PlayerSyncStateMessage} from "../../../../../shared/messaging/types";
import {StateSyncUpdateType} from "../../../../../workers/logic/components/Player/components/StateSync/StateSync";
import {setAvailableFoodSources} from "../../../../../components/Game/components/Player/state/misc";

const StateManager: React.FC = ({children}) => {

    const subscribeToMessage = useSubscribeToMessage()

    const onMessage = useCallback(({type, value}: PlayerSyncStateMessage) => {

        switch (type) {
            case StateSyncUpdateType.AVAILABLE_FOOD_SOURCES:
                setAvailableFoodSources(value)
                break;
        }

    }, [])

    useEffect(() => {

        const unsubscribe = subscribeToMessage(getPlayerStateSyncKey(), onMessage)

        return () => {
            unsubscribe()
        }

    }, [subscribeToMessage, onMessage])

    return (
        <>
            {children}
        </>
    );
};

export default StateManager;