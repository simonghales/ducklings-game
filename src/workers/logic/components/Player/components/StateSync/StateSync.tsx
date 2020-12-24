import * as React from "react";
import {useProxy} from "valtio";
import {availableFoodSources} from "../../state/food";
import {useEffect} from "react";
import {useWorkerCommunicationContext} from "../../../WorkerCommunication/context";
import {getPlayerStateSyncKey, getStateSyncKey} from "../../../../../../shared/messaging/keys";

const useHasAvailableFoodSources = () => {
    const foodSources = useProxy(availableFoodSources).foodSources
    return Object.keys(foodSources).length > 0
}

export enum StateSyncUpdateType {
    AVAILABLE_FOOD_SOURCES,
}

export type StateSyncUpdate = {
    type: StateSyncUpdateType,
    value?: any,
}

const useSyncValue = (key: string, update: StateSyncUpdate, value: any) => {

    const {
        sendMessageToMain
    } = useWorkerCommunicationContext()

    useEffect(() => {

        const combinedUpdate: StateSyncUpdate = {
            ...update,
            value,
        }

        sendMessageToMain({
            key,
            data: combinedUpdate,
        })

    }, [key, value, update])

}

const syncAvailableFoodSourcesUpdate: StateSyncUpdate = {
    type: StateSyncUpdateType.AVAILABLE_FOOD_SOURCES,
}

const StateSync: React.FC = () => {

    const hasAvailableFoodSources = useHasAvailableFoodSources()
    useSyncValue(getPlayerStateSyncKey(), syncAvailableFoodSourcesUpdate, hasAvailableFoodSources)

    return null;
};

export default StateSync;