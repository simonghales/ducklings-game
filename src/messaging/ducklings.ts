
export const eventTarget = new EventTarget()

export enum DucklingMessageType {
    FOOD_SOURCE
}

export type DucklingFoodSourceMessage = {
    type: DucklingMessageType,
    data: {
        id: string,
        inRange: boolean,
    }
}

export const sendDucklingMessage = (message: any) => {
    eventTarget.dispatchEvent(new CustomEvent('ducklings', {
        detail: message,
    }))
}

export const subscribeToDucklingMessages = (callback: (message: any) => void) => {

    eventTarget.addEventListener('ducklings', callback)

    const unsubscribe = () => {
        eventTarget.removeEventListener('ducklings', callback)
    }

    return unsubscribe

}