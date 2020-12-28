import React, {useEffect, useRef} from "react";
import {useThree} from "react-three-fiber";
import {useFollow} from "./hooks/useFollow";
import {DirectionalLight, Group, PerspectiveCamera} from "three";

const Camera: React.FC = () => {

    const groupRef = useRef<Group>(null as unknown as Group)
    const lightRef = useRef<DirectionalLight>(null as unknown as DirectionalLight)
    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()

    useFollow(groupRef, lightRef)

    useEffect(() => void setDefaultCamera(cameraRef.current), [])

    return (
        <group ref={groupRef}>
            <perspectiveCamera ref={cameraRef} position={[0, 0, 30]} fov={20}>
                <directionalLight ref={lightRef}
                                  position={[100, 100, 100]}
                                  intensity={0.4}
                                  castShadow
                                  shadow-mapSize-width={2048}
                                  shadow-mapSize-height={2048} />
            </perspectiveCamera>
        </group>
    );
};

export default Camera;