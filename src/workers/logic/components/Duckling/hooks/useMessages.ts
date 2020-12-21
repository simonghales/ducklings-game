import {useEffect} from "react";
import {
    DucklingFoodSourceMessage,
    DucklingMessageType,
    subscribeToDucklingMessages
} from "../../../../../messaging/ducklings";
import {startFollowingPlayer, stopFollowingPlayer} from "../../../state/ducklings";

export const useMessages = (id: string) => {

    useEffect(() => {

        const onMessage = (event: any) => {
            const data = (event as unknown as CustomEvent).detail
            switch (data.type) {
                case DucklingMessageType.FOOD_SOURCE:
                    const foodData = data.data as unknown as DucklingFoodSourceMessage['data']
                    if (foodData.inRange) {
                        stopFollowingPlayer(id)
                    } else {
                        startFollowingPlayer(id)
                    }
                    break;
            }
        }

        const unsubscribe = subscribeToDucklingMessages(onMessage)

        return () => {
            unsubscribe()
        }

    }, [id])

}