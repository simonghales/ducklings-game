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