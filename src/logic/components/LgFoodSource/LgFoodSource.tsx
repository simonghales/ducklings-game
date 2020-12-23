import React, {useEffect, useRef} from "react";
import {FoodSourceData} from "../../data/foodSource";
import {useWorkerCommunicationContext} from "../../../workers/logic/components/WorkerCommunication/context";
import {getFoodSourceManagerKey} from "../../../shared/messaging/keys";
import {FoodSourceMessageDataType} from "../../../shared/messaging/types";
import {Object3D} from "three";
import {getFoodUuid} from "../../../shared/uuids";
import {useStoreMesh} from "../../../workers/logic/state/meshes";
import {useBody, useBodyRaw} from "../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../physics/bodies";
import {Vec2} from "planck-js";
import {FixtureType} from "../../../shared/fixtures";
import {radius} from "../../../components/Game/components/Food/Food";

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
    const {id, position} = data
    const uuid = getFoodUuid(id)
    const ref = useRef(new Object3D())
    useBodyRaw(() => ({
        type: BodyType.static,
        position: Vec2(position[0], position[1]),
        fixtures: [{
            shape: BodyShape.circle,
            radius,
            fixtureOptions: {
                isSensor: true,
                userData: {
                    fixtureType: FixtureType.FOOD_PLANT,
                    id,
                }
            },
        }],
    }), {
        uuid,
        fwdRef: ref,
    })

    useStoreMesh(uuid, ref.current)

    useSyncWithMain(getFoodSourceManagerKey(), {
        type: FoodSourceMessageDataType.ADD_FOOD,
        data: {
            id: data.id,
            position: data.position
        }
    }, {
        type: FoodSourceMessageDataType.REMOVE_FOOD,
        data: {
            id: data.id,
        }
    })

    return null;
};

export default LgFoodSource;