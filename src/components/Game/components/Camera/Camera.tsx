import React, {useEffect, useRef} from "react";
import {useThree} from "react-three-fiber";

const Camera: React.FC = () => {

    const cameraRef = useRef<any>()
    const {setDefaultCamera} = useThree()

    useEffect(() => void setDefaultCamera(cameraRef.current), [])

    return (
        <perspectiveCamera ref={cameraRef} position={[0, 1, 30]} fov={20}>
            <directionalLight position={[100, 100, 100]}
                              intensity={0.4}
                              castShadow
                              shadow-mapSize-width={2048}
                              shadow-mapSize-height={2048} />
        </perspectiveCamera>
    );
};

export default Camera;