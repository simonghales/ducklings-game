import React, {useEffect, useRef} from "react";
import {useWorkerCommunicationContext} from "../../../workers/logic/components/WorkerCommunication/context";
import {getFoodSourceManagerKey} from "../../../shared/messaging/keys";
import {FoodSourceMessageDataType} from "../../../shared/messaging/types";
import {Object3D} from "three";
import {getFoodUuid} from "../../../shared/uuids";
import {useStoreMesh} from "../../../workers/logic/state/meshes";
import {useBodyRaw} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {FixtureType} from "../../../shared/fixtures";
import {radius} from "../../../components/Game/components/Food/Food";
import {FoodSourceData, useFoodManager} from "../../../game/food/logic/state";
import {useSyncBody} from "../../../workers/logic/components/LogicApp/hooks/useSyncBody";

const useSyncWithMain = (messageKey: string, addData: any, removeData: any) => {

    const {
        sendMessageToMain
    } = useWorkerCommunicationContext()

    useEffect(() => {

        sendMessageToMain({
            key: messageKey,
            data: addData,
        })

        return () => {

            sendMessageToMain({
                key: messageKey,
                data: removeData,
            })

        }

    }, [])

}

const LgFoodSource: React.FC<{
    data: FoodSourceData
}> = ({data}) => {
    const {id, position, food} = data
    const uuid = getFoodUuid(id)
    const ref = useRef(new Object3D())
    useBodyRaw(() => ({
        type: BodyType.dynamic,
        linearDamping: 5,
        position: Vec2(position[0], position[1]),
        attachToRope: true,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.1,
            fixtureOptions: {
                density: 10,
                userData: {
                    reactToWater: true,
                    fixtureType: FixtureType.FOOD_PLANT,
                    id,
                }
            },
        }],
    }), {
        uuid,
        fwdRef: ref,
    })
    useSyncBody(uuid, ref)
    useStoreMesh(uuid, ref.current)

    useSyncWithMain(getFoodSourceManagerKey(), {
        type: FoodSourceMessageDataType.ADD_FOOD,
        data: {
            ...data
        }
    }, {
        type: FoodSourceMessageDataType.REMOVE_FOOD,
        data: {
            id,
        }
    })

    const {
        sendMessageToMain
    } = useWorkerCommunicationContext()

    useEffect(() => {

        sendMessageToMain({
            key: getFoodSourceManagerKey(),
            data: {
                type: FoodSourceMessageDataType.UPDATE_FOOD,
                data: {
                    id,
                    update: {
                        food,
                    }
                }
            },
        })

    }, [food, id])

    return null;
};

const Wrapper: React.FC<{
    id: string,
}> = ({id}) => {

    const data = useFoodManager(state => state.foodSources[id])

    return <LgFoodSource data={data}/>

}

export default Wrapper;