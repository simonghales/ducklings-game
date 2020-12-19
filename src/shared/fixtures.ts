import {ValidUUID} from "../utils/ids";

export enum FixtureType {
    DUCKLING,
}

export type FixtureUserData = {
    uuid: ValidUUID,
    fixtureIndex: number,
    fixtureType?: FixtureType,
    [key: string]: any,
}