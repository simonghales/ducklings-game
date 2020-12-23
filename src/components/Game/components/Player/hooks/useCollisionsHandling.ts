import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {getPlayerUuid} from "../../../../../shared/uuids";
import {useCallback} from "react";
import {FixtureDucklingData, FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {setDucklingInRange} from "../state/ducklings";

// matches usePhysics
export enum Fixtures {
    BODY,
    LARGE_SENSOR,
    MEDIUM_SENSOR,
    SMALL_SENSOR,
    DISPLACEMENT_SENSOR,
}

export const useCollisionsHandling = () => {

    const onDucklingInRange = useCallback((enter: boolean, data: FixtureDucklingData) => {
        setDucklingInRange(data.ducklingId, enter)
    }, [])

    const onLargeCollider = useCallback((enter: boolean, data: FixtureUserData) => {
        switch (data.fixtureType) {
            case FixtureType.DUCKLING:
                onDucklingInRange(enter, data as FixtureDucklingData)
                break;
        }
    }, [onDucklingInRange])

    const onCollideStart = useCallback((data: FixtureUserData, fixtureIndex: Fixtures) => {
        switch (fixtureIndex) {
            case Fixtures.BODY:
                break;
            case Fixtures.LARGE_SENSOR:
                onLargeCollider(true, data)
                break;
        }
    }, [onLargeCollider])

    const onCollideEnd = useCallback((data: FixtureUserData, fixtureIndex: Fixtures) => {
        switch (fixtureIndex) {
            case Fixtures.BODY:
                break;
            case Fixtures.LARGE_SENSOR:
                onLargeCollider(false, data)
                break;
        }
    }, [onLargeCollider])

    useCollisionEvents(getPlayerUuid(), onCollideStart, onCollideEnd)

}