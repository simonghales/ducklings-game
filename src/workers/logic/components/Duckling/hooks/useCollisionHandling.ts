import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useWorkerCommunicationContext} from "../../WorkerCommunication/context";
import {getDucklingMessageKey} from "../../../../../shared/messaging/keys";
import {DucklingMessageDataType} from "../../../../../shared/messaging/types";
import {getNumberOfFollowingDucklings, updateDuckling} from "../../../state/ducklings";

const useOnDucklingCollide = (id: string) => {

    const {
        sendMessageToMain
    } = useWorkerCommunicationContext()

    const onCollide = useCallback(() => {
        sendMessageToMain({
            key: getDucklingMessageKey(id),
            data: {
                type: DucklingMessageDataType.QUACK,
            }
        })
    }, [id])

    return onCollide

}

const useOnPlayerCollide = (id: string) => {
    return useCallback(() => {

        updateDuckling(id, {
            isFollowingPlayer: true,
            order: getNumberOfFollowingDucklings(),
        })

    }, [id])
}

export const useCollisionHandling = (uuid: ValidUUID, id: string) => {

    const onDucklingCollide = useOnDucklingCollide(id)
    const onPlayerCollide = useOnPlayerCollide(id)

    const onCollisionStart = useCallback(({fixtureType}: FixtureUserData) => {

        switch (fixtureType) {
            case FixtureType.PLAYER:
                onPlayerCollide()
                break;
            case FixtureType.DUCKLING:
                onDucklingCollide()
                break;
        }

    }, [id])

    const onCollisionEnd = useCallback(({fixtureType}: FixtureUserData) => {
    }, [])

    useCollisionEvents(uuid, onCollisionStart, onCollisionEnd)

}