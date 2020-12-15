import React, {useRef} from "react";
import Duck from "../../../../../../3d/Duck/Duck";
import {useStoreRef} from "../../../../../../global/state/refs";
import {Object3D} from "three";
import {useBrain} from "./hooks/useBrain";
import {usePhysics} from "./hooks/usePhysics";
import { Box } from "@react-three/drei";

const scale: [number, number, number] = [0.3, 0.3, 0.3]

export const getDucklingRefKey = (id: number): string => {
    return `duckling-${id}`
}

const getDefaultObject = (x: number, y: number): Object3D => {
    const object = new Object3D()
    object.position.x = x
    object.position.y = y
    return object
}

const Duckling: React.FC<{
    id: number,
    followRefKey: string,
    initialX: number,
    initialY: number,
}> = ({
    id,
    followRefKey,
    initialX,
    initialY
                      }) => {

    const ref = useRef<Object3D>(getDefaultObject(initialX, initialY))
    const targetRef = useRef<Object3D>(getDefaultObject(initialX, initialY))
    useStoreRef(getDucklingRefKey(id), ref.current)
    const [api] = usePhysics(ref)
    useBrain(ref, followRefKey, api, targetRef)

    return (
        <>
            <group ref={ref} scale={scale} position={[initialX, initialY, 0]}>
                <Duck/>
            </group>
            {/*<Box args={[0.15, 0.15, 0.15]} ref={targetRef}>*/}
            {/*    <meshPhongMaterial color={`red`} />*/}
            {/*</Box>*/}
        </>
    );
};

export default Duckling;