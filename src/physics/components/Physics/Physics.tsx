import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    storedPhysicsData
} from "./data";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../workers/physics/types";
import PhysicsProvider, {useBuffers} from "../PhysicsProvider/PhysicsProvider";
import CollisionsProvider from "../CollisionsProvider/CollisionsProvider";
import {useCollisionsProviderContext} from "../CollisionsProvider/context";
import {useMessagesContext} from "../../../components/Messages/context";
import {MessageData} from "../../../shared/messaging/types";

const Physics: React.FC = ({children}) => {

    const [gamePhysicsWorker] = useState(() => new Worker('../../../workers/physics', { name: 'gamePhysicsWorker', type: 'module' }))
    const [logicWorker] = useState(() => new Worker('../../../workers/logic', { name: 'logicWorker', type: 'module' }))
    const buffers = useBuffers()
    const {handleBeginCollision, handleEndCollision} = useCollisionsProviderContext()

    useLayoutEffect(() => {

        const channel = new MessageChannel()

        gamePhysicsWorker.postMessage({command: "connect"}, [channel.port1])
        logicWorker.postMessage({command: "connect"}, [channel.port2])

    }, [])

    useEffect(() => {

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                gamePhysicsWorker.postMessage({ type: WorkerMessageType.STEP, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        gamePhysicsWorker.postMessage({
            type: WorkerMessageType.INIT,
            props: {
            }
        })

        loop()

        gamePhysicsWorker.onmessage = (event: MessageEvent) => {

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

    }, [])

    const {
        handleMessage,
    } = useMessagesContext()

    useEffect(() => {

        logicWorker.onmessage= (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.MESSAGE:
                    handleMessage(event.data.message as MessageData)
                    break;
            }

        }

    }, [])

    return (
        <PhysicsProvider buffers={buffers} worker={gamePhysicsWorker}>
            {children}
        </PhysicsProvider>
    )
};

const PhysicsWrapper: React.FC = ({children}) => {
    return (
        <CollisionsProvider>
            <Physics>
                {children}
            </Physics>
        </CollisionsProvider>
    )
}

export default PhysicsWrapper;