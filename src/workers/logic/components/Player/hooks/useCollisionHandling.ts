import {ValidUUID} from "../../../../../utils/ids";
import {useCallback} from "react";
import {FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {Fixtures} from "../../../../../components/Game/components/Player/hooks/useCollisionsHandling";
import {addInRange, addToDisplacementRange, RangeType, removeFromDisplacementRange, removeInRange} from "../state/area";

const handleFixtureResponse = (
    fixtureIndex: number,
    callbacks: {
        largeCallback?: () => void,
        mediumCallback?: () => void,
        closeCallback?: () => void,
        physicalCallback?: () => void,
        displacementCallback?: () => void,
    } = {}
) => {
    const {
        largeCallback,
        mediumCallback,
        closeCallback,
        physicalCallback,
        displacementCallback,
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
        case Fixtures.DISPLACEMENT_SENSOR:
            if (displacementCallback) {
                displacementCallback()
            }
            break;
    }
}

export const useCollisionHandling = (uuid: ValidUUID) => {

    const onCollisionStart = useCallback(({fixtureType, id, uuid, reactToWater}: FixtureUserData, fixtureIndex: number) => {
        if (reactToWater) {
            handleFixtureResponse(fixtureIndex, {
                displacementCallback: () => {
                    addToDisplacementRange(uuid)
                }
            })
        }
        switch (fixtureType) {
            case FixtureType.FOOD_PLANT:
                handleFixtureResponse(fixtureIndex, {
                    closeCallback: () => {
                        addInRange(uuid, id, RangeType.FOOD_PLANT, undefined, true)
                    },
                    mediumCallback: () => {
                        addInRange(uuid, id, RangeType.FOOD_PLANT, true, undefined)
                    }
                })
                break;
        }
    }, [])

    const onCollisionEnd = useCallback(({fixtureType, uuid, reactToWater}: FixtureUserData, fixtureIndex: number) => {
        if (reactToWater) {
            handleFixtureResponse(fixtureIndex, {
                displacementCallback: () => {
                    removeFromDisplacementRange(uuid)
                }
            })
        }
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