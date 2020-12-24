import React from "react";
import {Plane} from "@react-three/drei";

const InteractivePlane: React.FC = () => {
    return (
        <>
            <Plane visible={false} args={[50, 50]} position={[0, 0, 0.05]} receiveShadow onClick={event => console.log('clicked', event.point)}/>
        </>
    );
};

export default InteractivePlane;