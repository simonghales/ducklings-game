import * as React from "react"
import Ducklings from "../Ducklings/Ducklings";
import {proxy, useProxy} from "valtio";
import {useCallback, useEffect, useState} from "react";
import PhysicsProvider, {useBuffers} from "../../../../physics/components/PhysicsProvider/PhysicsProvider";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../physics/types";
import {
    applyPositionAngle,
    Buffers,
    storedPhysicsData
} from "../../../../physics/components/Physics/data";
import { LogicAppContext } from "./context";
import {Object3D} from "three";
import {ValidUUID} from "../../../../utils/ids";
import Player from "../Player/Player";
import CollisionsProvider from "../../../../physics/components/CollisionsProvider/CollisionsProvider";
import {useCollisionsProviderContext} from "../../../../physics/components/CollisionsProvider/context";
import WorkerCommunication from "../WorkerCommunication/WorkerCommunication";
import {MessageData} from "../../../../shared/messaging/types";

export const workerStorage: {
    worker: Worker | null,
} = {
    worker: null,
}

export const logicAppState = proxy({
    workerLoaded: false,
})

type MeshSubscription = {
    uuid: ValidUUID,
    object: Object3D,
    includeAngle: boolean,
}

const updateMeshes = (meshSubscriptions: Map<ValidUUID, MeshSubscription>, buffers: Buffers) => {

    meshSubscriptions.forEach(({uuid, object, includeAngle}) => {
        if (object && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            applyPositionAngle(buffers, object, index, includeAngle)
        }
    })

}

const LogicApp: React.FC = () => {

    const buffers = useBuffers()
    const stateProxy = useProxy(logicAppState)
    const [worker, setWorker] = useState<Worker | null>(null)
    const workerLoaded = stateProxy.workerLoaded
    const {handleBeginCollision, handleEndCollision} = useCollisionsProviderContext()

    const [meshSubscriptions] = useState(() => new Map<ValidUUID, MeshSubscription>())

    const subscribeMesh = useCallback((uuid: ValidUUID, object: Object3D, includeAngle: boolean) => {
        meshSubscriptions.set(uuid, {
            uuid: uuid,
            object,
            includeAngle
        })
    }, [])
    const unsubscribeMesh = useCallback((key: ValidUUID) => {
        meshSubscriptions.delete(key)
    }, [])

    useEffect(() => {

        if (workerLoaded && workerStorage.worker) {
            setWorker(workerStorage.worker)
        }

    }, [workerLoaded])

    useEffect(() => {

        if (!worker) return

        let lastUpdate = 0
        let lastRequest = 0

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                lastRequest = Date.now()
                worker.postMessage({ type: WorkerMessageType.LOGIC_FRAME, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        loop()

        worker.onmessage = (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.FRAME:
                    lastUpdate = Date.now()
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

                    updateMeshes(meshSubscriptions, buffers)

                    const timeSinceLastRequest = Date.now() - lastRequest

                    const frameDuration = 1000 / 60

                    if (timeSinceLastRequest >= frameDuration) {
                        loop()
                    } else {
                        const wait = frameDuration - timeSinceLastRequest
                        setTimeout(loop, wait)
                    }

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
        <LogicAppContext.Provider value={{
            subscribeMesh,
            unsubscribeMesh
        }}>
            <PhysicsProvider worker={worker} buffers={buffers}>
                <Player/>
                <Ducklings/>
            </PhysicsProvider>
        </LogicAppContext.Provider>
    )
}

const LogicAppWrapper: React.FC<{
    sendMessageToMain: (message: MessageData) => void,
}> = ({sendMessageToMain}) => {
    return (
        <WorkerCommunication sendMessageToMain={sendMessageToMain}>
            <CollisionsProvider>
                <LogicApp/>
            </CollisionsProvider>
        </WorkerCommunication>
    )
}

export default LogicAppWrapper