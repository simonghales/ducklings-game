/* eslint-disable no-restricted-globals */

import {initFluid} from "../../fluid/fluidManager";
import {V2} from "../../shared/types";
import {expose} from "comlink";

initFluid()

const selfWorker = self as unknown as Worker

selfWorker.onmessage = (event: MessageEvent) => {

}

const exports = {
    updatePlayerData: (position: V2, velocity: V2) => {
        // console.log('updatePlayerData')
    }
}

export type FluidWorker = typeof exports;

expose(exports);