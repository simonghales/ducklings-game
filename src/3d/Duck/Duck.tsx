import { Box } from "@react-three/drei";
import React from "react";
import {radians} from "../../utils/angles";

const Duck: React.FC = () => {

    return (
        <group>
            <group position={[0, 0, -0.05]}>
                <Box args={[0.28, 0.28, 1]} castShadow receiveShadow position={[0, 0.3, 0]} rotation={[0, 0, radians(45)]}>
                    <meshPhongMaterial color={`#795a44`} />
                </Box>
                <Box args={[0.2, 0.4, 0.2]} castShadow receiveShadow position={[0, 0.5, 0.3]}>
                    <meshPhongMaterial color={`#66483a`} />
                </Box>
                <Box args={[0.5, 1, 0.5]} castShadow receiveShadow>
                    <meshPhongMaterial color={`#66483a`} />
                </Box>
            </group>
        </group>
    );
};

export default Duck;