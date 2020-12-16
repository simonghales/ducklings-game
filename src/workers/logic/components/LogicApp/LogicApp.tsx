import * as React from "react"
import Ducklings from "../Ducklings/Ducklings";
import {proxy, useProxy} from "valtio";
import {useEffect, useState} from "react";
import PhysicsProvider, {useBuffers} from "../../../../physics/components/PhysicsProvider/PhysicsProvider";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../physics/types";
import {handleBeginCollision, handleEndCollision, storedPhysicsData} from "../../../../physics/components/Physics/data";

export const workerStorage: {
    worker: Worker | null,
} = {
    worker: null,
}

export const logicAppState = proxy({
    workerLoaded: false,
})

const LogicApp: React.FC = () => {

    const buffers = useBuffers()
    const stateProxy = useProxy(logicAppState)
    const [worker, setWorker] = useState<Worker | null>(null)
    const workerLoaded = stateProxy.workerLoaded



    useEffect(() => {

        if (workerLoaded && workerStorage.worker) {
            setWorker(workerStorage.worker)
        }

    }, [workerLoaded])

    useEffect(() => {

        if (!worker) return

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                worker.postMessage({ type: WorkerMessageType.LOGIC_FRAME, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        loop()

        worker.onmessage = (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.FRAME:

                    if (event.data.bodies) {
                        storedPhysicsData.bodies = event.data.bodies.reduce(
                            (acc: { [key: string]: number }, id: string) => ({
                                ...acc,
                                [id]: (event.data as any).bodies.indexOf(id)
                            }),
                            {}
                        )
                    }

                    const positions = event.data.positions as Float32Array
                    const angles = event.data.angles as Float32Array
                    buffers.positions = positions
                    buffers.angles = angles
                    requestAnimationFrame(loop);
                    break
                case WorkerOwnerMessageType.SYNC_BODIES:
                    storedPhysicsData.bodies = event.data.bodies.reduce(
                        (acc: { [key: string]: number }, id: string) => ({
                            ...acc,
                            [id]: (event.data as any).bodies.indexOf(id)
                        }),
                        {}
                    )
                    break
                case WorkerOwnerMessageType.BEGIN_COLLISION:
                    handleBeginCollision(event.data.props as any)
                    break
                case WorkerOwnerMessageType.END_COLLISION:
                    handleEndCollision(event.data.props as any)
                    break
            }

        }



    }, [worker])

    if (!worker) return null

    return (
        <PhysicsProvider worker={worker} buffers={buffers}>
            <Ducklings/>
        </PhysicsProvider>
    )
}

export default LogicApp