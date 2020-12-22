import {wrap} from "comlink";

const fluidWorker = new Worker('../fluid', { name: 'fluidWorker', type: 'module' })

export const fluidWorkerApi =  wrap<import('../fluid').FluidWorker>(fluidWorker);