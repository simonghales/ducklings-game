import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useWorkerCommunicationContext} from "../../WorkerCommunication/context";
import {getDucklingMessageKey} from "../../../../../shared/messaging/keys";
import {DucklingMessageDataType} from "../../../../../shared/messaging/types";
import {getNumberOfFollowingDucklings, updateDuckling} from "../../../state/ducklings";
import {useDucklingLocalState} from "../context";
import {addPhysicalCollision, removePhysicalCollision} from "../state";

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

        // updateDuckling(id, {
        //     isFollowingPlayer: true,
        //     order: getNumberOfFollowingDucklings(),
        // })

    }, [id])
}

const usePhysicalCollisionHandlers = () => {

    const localState = useDucklingLocalState()

    const onBegin = useCallback((uuid: ValidUUID) => {
        addPhysicalCollision(localState, uuid)
    }, [localState])

    const onEnd = useCallback((uuid: ValidUUID) => {
        removePhysicalCollision(localState, uuid)
    }, [localState])

    return [onBegin, onEnd]

}

export const useCollisionHandling = (uuid: ValidUUID, id: string) => {

    const onDucklingCollide = useOnDucklingCollide(id)
    const onPlayerCollide = useOnPlayerCollide(id)
    const [onPhysicalBegin, onPhysicalEnd] = usePhysicalCollisionHandlers()

    const onCollisionStart = useCallback(({uuid, fixtureType}: FixtureUserData, fixtureIndex: number, isSensor: boolean) => {

        if (!isSensor) {
            onPhysicalBegin(uuid)
        }

        switch (fixtureType) {
            case FixtureType.PLAYER:
                onPlayerCollide()
                break;
            case FixtureType.DUCKLING:
                onDucklingCollide()
                break;
        }

    }, [id, onPhysicalBegin])

    const onCollisionEnd = useCallback(({uuid, fixtureType}: FixtureUserData, fixtureIndex: number, isSensor: boolean) => {

        if (!isSensor) {
            onPhysicalEnd(uuid)
        }

    }, [onPhysicalEnd])

    useCollisionEvents(uuid, onCollisionStart, onCollisionEnd)

}