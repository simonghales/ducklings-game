import {V2} from "../types";
import {StateSyncUpdate} from "../../workers/logic/components/Player/components/StateSync/StateSync";
import {FoodSourceData} from "../../game/food/logic/state";

export type MessageData = {
    key: string,
    data: any,
}

export enum DucklingMessageDataType {
    QUACK,
}

export type DucklingMessageData = {
    type: DucklingMessageDataType,
}

export enum FoodSourceMessageDataType {
    ADD_FOOD,
    UPDATE_FOOD,
    REMOVE_FOOD,
}

export type FoodSourceMessageAddFoodData = {
    id: string,
    position: V2,
    food: number,
}

export type FoodSourceMessageRemoveFoodData = {
    id: string,
}

export type FoodSourceMessageUpdateFoodData = {
    id: string,
    update: Partial<FoodSourceData>
}

export type FoodSourceMessage = {
    type: FoodSourceMessageDataType,
    data: any
}

export type PlayerSyncStateMessage = StateSyncUpdate