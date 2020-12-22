import {useEffect} from "react";
import {
    DucklingFoodSourceMessage,
    DucklingMessageType,
    subscribeToDucklingMessages
} from "../../../../../messaging/ducklings";
import {startFollowingPlayer, stopFollowingPlayer} from "../../../state/ducklings";
import {useDucklingLocalState} from "../context";
import {addFoodSourceToDucklingRange, removeFoodSourceFromDucklingRange} from "../state";

export const useMessages = (id: string) => {

    const localState = useDucklingLocalState()

    useEffect(() => {

        const onMessage = (event: any) => {
            const data = (event as unknown as CustomEvent).detail
            switch (data.type) {
                case DucklingMessageType.FOOD_SOURCE:
                    const foodData = data.data as unknown as DucklingFoodSourceMessage['data']
                    if (foodData.inRange) {
                        addFoodSourceToDucklingRange(localState, foodData.id)
                    } else {
                        removeFoodSourceFromDucklingRange(localState, foodData.id)
                    }
                    break;
            }
        }

        const unsubscribe = subscribeToDucklingMessages(onMessage)

        return () => {
            unsubscribe()
        }

    }, [id, localState])

}