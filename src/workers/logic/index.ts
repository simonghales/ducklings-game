/* eslint-disable no-restricted-globals */

import {logicAppState} from "./components/LogicApp/LogicApp";

(self as any).$RefreshReg$ = () => {};
(self as any).$RefreshSig$ = () => () => {};

const setWorker = require("./test").setWorker

let physicsWorkerPort: MessagePort

const selfWorker = self as unknown as Worker

selfWorker.onmessage = (event: MessageEvent) => {

    switch( event.data.command )
    {
        // Setup connection to worker 1
        case "connect":
            physicsWorkerPort = event.ports[0];
            setWorker(physicsWorkerPort as unknown as Worker)
            return

        // Forward messages to worker 1
        case "forward":
            // Forward messages to worker 1
            physicsWorkerPort.postMessage( event.data.message );
            return
    }

}

selfWorker.postMessage("hey this is the logic worker...")

export {}