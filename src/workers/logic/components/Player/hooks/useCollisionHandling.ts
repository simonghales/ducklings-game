import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {Fixtures} from "../../../../../components/Game/components/Player/hooks/useCollisionsHandling";

const handleFixtureResponse = (
    fixtureIndex: number,
    callbacks: {
        largeCallback?: () => void,
        mediumCallback?: () => void,
        closeCallback?: () => void,
        physicalCallback?: () => void
    } = {}
) => {
    const {
        largeCallback,
        mediumCallback,
        closeCallback,
        physicalCallback,
    } = callbacks
    switch (fixtureIndex as Fixtures) {
        case Fixtures.BODY:
            if (physicalCallback) {
                physicalCallback()
            }
            break;
        case Fixtures.LARGE_SENSOR:
            if (largeCallback) {
                largeCallback()
            }
            break;
        case Fixtures.MEDIUM_SENSOR:
            if (mediumCallback) {
                mediumCallback()
            }
            break;
        case Fixtures.SMALL_SENSOR:
            if (closeCallback) {
                closeCallback()
            }
            break;
    }
}

export const useCollisionHandling = (uuid: ValidUUID) => {

    const onCollisionStart = useCallback(({fixtureType}: FixtureUserData, fixtureIndex: number) => {
        switch (fixtureType) {
            case FixtureType.FOOD_PLANT:
                handleFixtureResponse(fixtureIndex, {
                    closeCallback: () => {
                        console.log('om nom nom???')
                    },
                    mediumCallback: () => {
                        console.log('in medium distance')
                    }
                })
                break;
        }
    }, [])

    const onCollisionEnd = useCallback(({fixtureType}: FixtureUserData, fixtureIndex: number) => {
        switch (fixtureType) {
            case FixtureType.FOOD_PLANT:
                handleFixtureResponse(fixtureIndex, {
                    closeCallback: () => {
                        console.log('left close')
                    },
                    mediumCallback: () => {
                        console.log('left medium distance')
                    }
                })
                break;
        }
    }, [])

    useCollisionEvents(uuid, onCollisionStart, onCollisionEnd)

}