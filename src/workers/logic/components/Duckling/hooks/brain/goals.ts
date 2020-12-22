import {useEffect} from "react";
import {startFollowingPlayer, stopFollowingPlayer} from "../../../../state/ducklings";

export const useGoals = (id: string, targetFoodSources: string[], isFollowingPlayer: boolean) => {

    const availableFood = targetFoodSources.length > 0

    useEffect(() => {

        if (!availableFood && !isFollowingPlayer) {
            startFollowingPlayer(id)
        } else if (availableFood && isFollowingPlayer) {
            stopFollowingPlayer(id)
        }

    }, [id, availableFood, isFollowingPlayer])

}