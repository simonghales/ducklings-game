import {Object3D} from "three";
import {MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
// import {workerAddBody, workerRemoveBody, workerSetBody, workerUpdateBody} from "./worker";
import {AddBodyDef, BodyType, UpdateBodyData} from "../../bodies";
import {Vec2} from "planck-js";
import {useFrame} from "react-three-fiber";
import {applyPositionAngle, collisionEndedEvents, collisionStartedEvents, storedPhysicsData} from "./data";
import {PhysicsCacheKeys} from "../../cache";
import {usePhysicsProvider} from "../PhysicsProvider/context";
import {ValidUUID} from "../../../utils/ids";

export type BodyApi = {
    applyForceToCenter: (vec: Vec2) => void,
    applyLinearImpulse: (vec: Vec2, pos: Vec2) => void,
    setPosition: (vec: Vec2) => void,
    setLinearVelocity: (vec: Vec2) => void,
    setAngle: (angle: number) => void,
    updateBody: (data: UpdateBodyData) => void,
}

export const useIntervalBodySync = (ref: MutableRefObject<Object3D>, uuid: ValidUUID, isDynamic: boolean, applyAngle: boolean = true) => {

    const {buffers} = usePhysicsProvider()

    useEffect(() => {

        let interval = setInterval(() => {
            if (!isDynamic) {
                return
            }
            if (ref.current && buffers.positions.length && buffers.angles.length) {
                const index = storedPhysicsData.bodies[uuid]
                applyPositionAngle(buffers, ref.current, index, applyAngle)
            }
        }, 1000 / 60)

        return () => {
            clearInterval(interval)
        }

    }, [])

}

export const useBodySync = (ref: MutableRefObject<Object3D>, uuid: ValidUUID, isDynamic: boolean, applyAngle: boolean = true) => {

    const {buffers} = usePhysicsProvider()

    const onFrame = useCallback(() => {
        if (!isDynamic) {
            return
        }
        if (ref.current && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            applyPositionAngle(buffers, ref.current, index, applyAngle)
        }
    }, [isDynamic, ref, uuid, applyAngle])

    useFrame(onFrame)

}

export const useBodyApi = (uuid: ValidUUID): BodyApi => {

    const {
        workerSetBody,
        workerUpdateBody
    } = usePhysicsProvider()

    const api = useMemo<BodyApi>(() => {

        return  {
            applyForceToCenter: (vec) => {
                workerSetBody({uuid, method: 'applyForceToCenter', methodParams: [vec, true]})
            },
            applyLinearImpulse: (vec, pos) => {
                workerSetBody({uuid, method: 'applyLinearImpulse', methodParams: [vec, pos, true]})
            },
            setPosition: (vec) => {
                workerSetBody({uuid, method: 'setPosition', methodParams: [vec]})
            },
            setLinearVelocity: (vec) => {
                workerSetBody({uuid, method: 'setLinearVelocity', methodParams: [vec]})
            },
            updateBody: (data: UpdateBodyData) => {
                workerUpdateBody({uuid, data})
            },
            setAngle: (angle: number) => {
                workerSetBody({uuid, method: 'setAngle', methodParams: [angle]})
            }
        }
    }, [uuid])

    return api

}

export const useBody = (propsFn: () => AddBodyDef, {
    applyAngle = false,
    cacheKey,
    uuid: passedUUID,
    fwdRef,
    onCollideEnd,
    onCollideStart,
    debug
}: {
    applyAngle?: boolean,
    cacheKey?: PhysicsCacheKeys,
    uuid?: string | number,
    fwdRef?: MutableRefObject<Object3D>,
    onCollideStart?: (data: any, fixtureIndex: number) => void,
    onCollideEnd?: (data: any, fixtureIndex: number) => void,
    debug?: string
}): [any, BodyApi, string | number] => {
    const localRef = useRef<Object3D>((null as unknown) as Object3D)
    const ref = fwdRef ? fwdRef : localRef
    const [uuid] = useState(() => {
        if (passedUUID) return passedUUID
        if (!ref.current) {
            ref.current = new Object3D()
        }
        return ref.current.uuid
    })
    const [isDynamic] = useState(() => {
        const props = propsFn()
        return props.type !== BodyType.static
    })
    const {
        workerAddBody,
        workerRemoveBody,
        workerSetBody,
        workerUpdateBody
    } = usePhysicsProvider()
    useLayoutEffect(() => {

        const props = propsFn()

        ref.current.position.x = props.position?.x || 0
        ref.current.position.z = props.position?.y || 0

        const listenForCollisions = !!onCollideStart || !!onCollideEnd

        if (listenForCollisions) {
            collisionStartedEvents[uuid] = onCollideStart ? onCollideStart : () => {}
            collisionEndedEvents[uuid] = onCollideEnd ? onCollideEnd : () => {}
        }

        workerAddBody({
            uuid,
            listenForCollisions,
            cacheKey,
            ...props,
        })

        return () => {

            if (listenForCollisions) {
                delete collisionStartedEvents[uuid]
                delete collisionEndedEvents[uuid]
            }

            workerRemoveBody({uuid, cacheKey})
        }

    }, [])

    useBodySync(ref, uuid, isDynamic, applyAngle)

    const api = useBodyApi(uuid)

    return [ref, api, uuid]
}