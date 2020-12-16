import {WorkerMessageType} from "../../../workers/physics/types";
import {AddBodyProps, RemoveBodyProps, SetBodyProps, UpdateBodyProps} from "../../bodies";
import {wrap} from "comlink";
// import {AiWorkerMessageType, AiWorkerOwnerMessageType} from "../../../workers/ai/types";
// import {NetworkMessageType, sendNetworkMessage} from "../../../networking/networking";

// export const aiWorker = new Worker('../../../workers/ai', { name: 'aiWorker', type: 'module' });
// export const aiWorkerApi = wrap<import('../../../workers/ai').AiWorker>(aiWorker);
export const gamePhysicsWorker = new Worker('../../../workers/physics', { name: 'gamePhysicsWorker', type: 'module' });

const logicWorker = new Worker('../../../workers/logic', { name: 'logicWorker', type: 'module' });

logicWorker.postMessage("hello world")

logicWorker.onmessage = (event: MessageEvent) => {
    console.log('logic worker message', event.data)
}

// const channel = new MessageChannel();

// gamePhysicsWorker.postMessage({command: "connect"}, [channel.port1])
// aiWorker.postMessage({command: "connect"}, [channel.port2])


export const workerAddBody = (props: AddBodyProps) => {
    gamePhysicsWorker.postMessage({
        type: WorkerMessageType.ADD_BODY,
        props: props
    })
}

export const workerRemoveBody = (props: RemoveBodyProps) => {
    gamePhysicsWorker.postMessage({
        type: WorkerMessageType.REMOVE_BODY,
        props
    })
}

export const workerSetBody = (props: SetBodyProps) => {
    gamePhysicsWorker.postMessage({
        type: WorkerMessageType.SET_BODY,
        props,
    })
}

export const workerUpdateBody = (props: UpdateBodyProps) => {
    gamePhysicsWorker.postMessage({
        type: WorkerMessageType.UPDATE_BODY,
        props,
    })
}