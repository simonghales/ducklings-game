/* eslint-disable no-restricted-globals */

import { render } from "react-nil"
import LogicApp, {logicAppState, workerStorage} from "./components/LogicApp/LogicApp";

export const setWorker = (worker: Worker) => {
    console.log('setWorker')
    workerStorage.worker = worker
    logicAppState.workerLoaded = true
}

render(<LogicApp/>)