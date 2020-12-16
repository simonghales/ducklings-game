import React, {useRef} from "react";
import Duck from "../../../../../../3d/Duck/Duck";
import {useStoreRef} from "../../../../../../global/state/refs";
import {Object3D} from "three";
import {useBrain} from "./hooks/useBrain";
import {usePhysics} from "./hooks/usePhysics";
import { Box } from "@react-three/drei";
import TargetHelper from "../../../TargetHelper/TargetHelper";

const scale: [number, number, number] = [0.3, 0.3, 0.3]

export const getDucklingRefKey = (id: string): string => {
    return `duckling-${id}`
}

export const getDucklingTargetRefKey = (id: string): string => {
    return `duckling-target-${id}`
}

export const getDucklingTargetHelperRefKey = (id: string): string => {
    return `duckling-target-helper-${id}`
}

export const getDefaultObject = (x: number, y: number): Object3D => {
    const object = new Object3D()
    object.position.x = x
    object.position.y = y
    return object
}

const Duckling: React.FC<{
    id: string,
    position: number | null,
    closestDuckRefKey: string,
    initialX: number,
    initialY: number,
}> = ({
    id,
    position,
    closestDuckRefKey,
    initialX,
    initialY
                      }) => {

    const ref = useRef<Object3D>(getDefaultObject(initialX, initialY))
    const targetRef = useRef<Object3D>(getDefaultObject(initialX, initialY))
    const extendedTargetRef = useRef<Object3D>(getDefaultObject(initialX, initialY))
    useStoreRef(getDucklingRefKey(id), ref.current)
    useStoreRef(getDucklingTargetRefKey(id), targetRef.current)
    const [api] = usePhysics(ref)
    useBrain(id, ref, closestDuckRefKey, api, targetRef, extendedTargetRef, position, (id === 'C'))

    return (
        <>
            <group ref={ref} scale={scale} position={[initialX, initialY, 0]}>
                <Duck/>
            </group>
            <Box args={[0.15, 0.15, 0.15]} ref={targetRef}>
                <meshPhongMaterial color={`red`} />
            </Box>
            <Box args={[0.15, 0.15, 0.15]} ref={extendedTargetRef}>
                <meshPhongMaterial color={`pink`} />
            </Box>
        </>
    );
};

export default Duckling;