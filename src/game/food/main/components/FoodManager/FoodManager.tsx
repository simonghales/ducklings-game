import React, {useCallback, useEffect, useState} from "react";
import Food from "../../../../../components/Game/components/Food/Food";
import {useSubscribeToMessage} from "../../../../../components/Messages/context";
import {getFoodSourceManagerKey} from "../../../../../shared/messaging/keys";
import {
    FoodSourceMessage,
    FoodSourceMessageAddFoodData,
    FoodSourceMessageDataType, FoodSourceMessageRemoveFoodData
} from "../../../../../shared/messaging/types";
import create from "zustand";
import {V2} from "../../../../../shared/types";
import {FoodSourceData} from "../../data";

type StateManager = {
    foodSources: {
        [id: string]: FoodSourceData
    },
    addFoodSource: (id: string, position: V2) => void,
    removeFoodSource: (id: string) => void,
}

const generateState = () => {
    return create<StateManager>(set => ({
        foodSources: {},
        addFoodSource: (id: string, position: V2) => set(state => {
            return {
                foodSources: {
                    ...state.foodSources,
                    [id]: {
                        id,
                        position,
                    }
                }
            }
        }),
        removeFoodSource: (id: string) => set(state => {
            const foodSources = state.foodSources
            delete foodSources[id]
            return {
                ...foodSources,
            }
        }),
    }))
}

const FoodManager: React.FC = () => {

    const [useStateManager] = useState(() => generateState())
    const {
        foodSources,
        addFoodSource,
        removeFoodSource
    } = useStateManager(state => ({
        foodSources: state.foodSources,
        addFoodSource: state.addFoodSource,
        removeFoodSource: state.removeFoodSource,
    }))

    const subscribeToMessage = useSubscribeToMessage()

    const onMessage = useCallback(({type, data}: FoodSourceMessage) => {

        switch (type) {
            case FoodSourceMessageDataType.ADD_FOOD:
                const {id: addId, position} = data as FoodSourceMessageAddFoodData
                addFoodSource(addId, position)
                break;
            case FoodSourceMessageDataType.REMOVE_FOOD:
                const {id: removeId} = data as FoodSourceMessageRemoveFoodData
                removeFoodSource(removeId)
                break;
        }

    }, [addFoodSource, removeFoodSource])

    useEffect(() => {

        const unsubscribe = subscribeToMessage(getFoodSourceManagerKey(), onMessage)

        return () => {
            unsubscribe()
        }

    }, [subscribeToMessage, onMessage])

    return (
        <>
            {
                Object.values(foodSources).map((foodSource) => (
                    <Food data={foodSource} key={foodSource.id}/>
                ))
            }
        </>
    );
};

export default FoodManager;