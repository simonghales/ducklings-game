import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {Fixtures} from "../../../../../components/Game/components/Player/hooks/useCollisionsHandling";
import {addInRange, RangeType, removeInRange} from "../state/area";

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

    const onCollisionStart = useCallback(({fixtureType, uuid}: FixtureUserData, fixtureIndex: number) => {
        switch (fixtureType) {
            case FixtureType.FOOD_PLANT:
                handleFixtureResponse(fixtureIndex, {
                    closeCallback: () => {
                        addInRange(uuid, RangeType.FOOD_PLANT, undefined, true)
                    },
                    mediumCallback: () => {
                        addInRange(uuid, RangeType.FOOD_PLANT, true, undefined)
                    }
                })
                break;
        }
    }, [])

    const onCollisionEnd = useCallback(({fixtureType, uuid}: FixtureUserData, fixtureIndex: number) => {
        switch (fixtureType) {
            case FixtureType.FOOD_PLANT:
                handleFixtureResponse(fixtureIndex, {
                    closeCallback: () => {
                        removeInRange(uuid, undefined, true)
                    },
                    mediumCallback: () => {
                        removeInRange(uuid, true, undefined)
                    }
                })
                break;
        }
    }, [])

    useCollisionEvents(uuid, onCollisionStart, onCollisionEnd)

}