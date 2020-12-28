import React, {useCallback, useEffect, useState} from "react";
import Food from "../../../../../components/Game/components/Food/Food";
import {useSubscribeToMessage} from "../../../../../components/Messages/context";
import {getFoodSourceManagerKey} from "../../../../../shared/messaging/keys";
import {
    FoodSourceMessage,
    FoodSourceMessageAddFoodData,
    FoodSourceMessageDataType, FoodSourceMessageRemoveFoodData, FoodSourceMessageUpdateFoodData
} from "../../../../../shared/messaging/types";
import create from "zustand";
import {V2} from "../../../../../shared/types";
import {FoodSourceData} from "../../../logic/state";

type StateManager = {
    foodSources: {
        [id: string]: FoodSourceData
    },
    addFoodSource: (id: string, position: V2, food: number) => void,
    removeFoodSource: (id: string) => void,
    updateFoodSource: (id: string, update: Partial<FoodSourceData>) => void,
}

const generateState = () => {
    return create<StateManager>(set => ({
        foodSources: {},
        addFoodSource: (id, position, food) => set(state => {
            return {
                foodSources: {
                    ...state.foodSources,
                    [id]: {
                        id,
                        position,
                        food,
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
        updateFoodSource: (id, update) => {
            return set(state => {
                const foodSources = state.foodSources
                return {
                    foodSources: {
                        ...foodSources,
                        [id]: {
                            ...foodSources[id],
                            ...update,
                        }
                    }
                }
            });
        },
    }))
}

const FoodManager: React.FC = () => {

    const [useStateManager] = useState(() => generateState())
    const {
        foodSources,
        addFoodSource,
        removeFoodSource,
        updateFoodSource,
    } = useStateManager(state => ({
        foodSources: state.foodSources,
        addFoodSource: state.addFoodSource,
        removeFoodSource: state.removeFoodSource,
        updateFoodSource: state.updateFoodSource,
    }))

    const subscribeToMessage = useSubscribeToMessage()

    const onMessage = useCallback(({type, data}: FoodSourceMessage) => {

        switch (type) {
            case FoodSourceMessageDataType.ADD_FOOD:
                const {id: addId, position, food} = data as FoodSourceMessageAddFoodData
                addFoodSource(addId, position, food)
                break;
            case FoodSourceMessageDataType.REMOVE_FOOD:
                const {id: removeId} = data as FoodSourceMessageRemoveFoodData
                removeFoodSource(removeId)
                break;
            case FoodSourceMessageDataType.UPDATE_FOOD:
                const {id: updateId, update} = data as FoodSourceMessageUpdateFoodData
                updateFoodSource(updateId, update)
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