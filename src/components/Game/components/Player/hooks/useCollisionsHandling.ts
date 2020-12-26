import {useCollisionEvents} from "../../../../../physics/components/Physics/hooks";
import {getPlayerUuid} from "../../../../../shared/uuids";
import {useCallback} from "react";
import {FixtureDucklingData, FixtureType, FixtureUserData} from "../../../../../shared/fixtures";
import {setDucklingInLargeRange, setDucklingInMediumRange} from "../state/ducklings";

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
        setDucklingInLargeRange(data.ducklingId, enter)
    }, [])

    const onDucklingInMediumRange = useCallback((enter: boolean, data: FixtureDucklingData) => {
        setDucklingInMediumRange(data.ducklingId, enter)
    }, [])

    const onLargeCollider = useCallback((enter: boolean, data: FixtureUserData) => {
        switch (data.fixtureType) {
            case FixtureType.DUCKLING:
                onDucklingInRange(enter, data as FixtureDucklingData)
                break;
        }
    }, [onDucklingInRange])

    const onMediumCollider = useCallback((enter: boolean, data: FixtureUserData) => {
        switch (data.fixtureType) {
            case FixtureType.DUCKLING:
                onDucklingInMediumRange(enter, data as FixtureDucklingData)
                break;
        }
    }, [onDucklingInMediumRange])

    const onCollideStart = useCallback((data: FixtureUserData, fixtureIndex: Fixtures) => {
        switch (fixtureIndex) {
            case Fixtures.BODY:
                break;
            case Fixtures.MEDIUM_SENSOR:
                onMediumCollider(true, data)
                break;
            case Fixtures.LARGE_SENSOR:
                onLargeCollider(true, data)
                break;
        }
    }, [onLargeCollider, onMediumCollider])

    const onCollideEnd = useCallback((data: FixtureUserData, fixtureIndex: Fixtures) => {
        switch (fixtureIndex) {
            case Fixtures.BODY:
                break;
            case Fixtures.MEDIUM_SENSOR:
                onMediumCollider(false, data)
                break;
            case Fixtures.LARGE_SENSOR:
                onLargeCollider(false, data)
                break;
        }
    }, [onLargeCollider, onMediumCollider])

    useCollisionEvents(getPlayerUuid(), onCollideStart, onCollideEnd)

}