/* eslint-disable no-restricted-globals */

import {WorkerMessageType, WorkerOwnerMessageType} from "./types";
import {initPhysicsListeners, stepWorld} from "../../physics/world";
import {syncBodies} from "./functions";
import {addBody, removeBody, setBody, updateBody} from "../../physics/bodies";
import {dynamicBodiesUuids, unsyncedBodies} from "../../physics/shared";
import {maxNumberOfDynamicPhysicObjects} from "../../physics/components/Physics/data";

const selfWorker = self as unknown as Worker

// let aiWorkerPort: MessagePort
//
// const onMessageFromAiWorker = (event: MessageEvent) => {
//     console.log("Worker 1 received a message from worker 2: " + event.data);
// };

const init = () => {
    syncBodies()
    initPhysicsListeners()
}

init()

const localPositions = new Float32Array(maxNumberOfDynamicPhysicObjects * 2)
const localAngles = new Float32Array(maxNumberOfDynamicPhysicObjects)

const step = (positions: Float32Array, angles: Float32Array) => {

    stepWorld(positions, localPositions, angles, localAngles)

    const data: any = {
        type: WorkerOwnerMessageType.FRAME,
        positions,
        angles,
    }

    // const physicsData: PhysicsData = {
    //     positions: localPositions,
    //     angles: localAngles,
    //     bodies: dynamicBodiesUuids,
    // }

    if (unsyncedBodies) {
        data['bodies'] = dynamicBodiesUuids
    }

    // const aiData: any = {
    //     type: AiWorkerMessageType.PHYSICS_UPDATE,
    //     ...physicsData,
    // }

    selfWorker.postMessage(data, [positions.buffer, angles.buffer])
    // if (aiWorkerPort) {
    //     aiWorkerPort.postMessage(aiData)
    // }

}

self.onmessage = (event: MessageEvent) => {

    // if (event.data.command) {
    //     if (event.data.command === "connect") {
    //         aiWorkerPort = event.ports[0];
    //         aiWorkerPort.onmessage = onMessageFromAiWorker;
    //         return
    //     } else if (event.data.command === "forward") {
    //         // Forward messages to worker 2
    //         aiWorkerPort.postMessage( event.data.message )
    //         return
    //     }
    // }

    const {type, props = {}} = event.data as {
        type: WorkerMessageType,
        props: any,
    };
    switch (type) {
        case WorkerMessageType.STEP:
            const {positions, angles} = event.data
            step(positions, angles)
            break;
        case WorkerMessageType.ADD_BODY:
            addBody(props)
            break;
        case WorkerMessageType.REMOVE_BODY:
            removeBody(props)
            break;
        case WorkerMessageType.SET_BODY:
            setBody(props)
            break;
        case WorkerMessageType.UPDATE_BODY:
            updateBody(props)
            break;
    }
}

export {};