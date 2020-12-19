import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useWorkerCommunicationContext} from "../../WorkerCommunication/context";
import {getDucklingMessageKey} from "../../../../../shared/messaging/keys";
import {DucklingMessageDataType} from "../../../../../shared/messaging/types";

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

export const useCollisionHandling = (uuid: ValidUUID, id: string) => {

    const onDucklingCollide = useOnDucklingCollide(id)

    const onCollisionStart = useCallback(({fixtureType}: FixtureUserData) => {

        if (fixtureType === FixtureType.DUCKLING) {
            onDucklingCollide()
        }

    }, [id])

    const onCollisionEnd = useCallback(({fixtureType}: FixtureUserData) => {
    }, [])

    useCollisionEvents(uuid, onCollisionStart, onCollisionEnd)

}