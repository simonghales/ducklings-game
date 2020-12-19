/* eslint-disable no-restricted-globals */

import { render } from "react-nil"
import LogicApp, {logicAppState, workerStorage} from "./components/LogicApp/LogicApp";
import {WorkerOwnerMessageType} from "../physics/types";
import {MessageData} from "../../shared/messaging/types";

export const setWorker = (worker: Worker) => {
    console.log('setWorker')
    workerStorage.worker = worker
    logicAppState.workerLoaded = true
}

const selfWorker = self as unknown as Worker

const sendMessageToMain = (message: MessageData) => {

    const update = {
        type: WorkerOwnerMessageType.MESSAGE,
        message
    }

    selfWorker.postMessage(update)
}

render(<LogicApp sendMessageToMain={sendMessageToMain}/>)