import { Box } from "@react-three/drei";
import React from "react";
import {radians} from "../../utils/angles";

const Duck: React.FC<{
    castShadow?: boolean,
    receiveShadow?: boolean,
}> = ({castShadow = true, receiveShadow = true}) => {

    return (
        <group>
            <group position={[0, 0, -0.05]}>
                <Box args={[0.28, 0.28, 0.7]} castShadow={castShadow} receiveShadow={receiveShadow} position={[0, 0.3, 0.35]} rotation={[0, 0, radians(45)]}>
                    <meshPhongMaterial color={`#795a44`} />
                </Box>
                <Box args={[0.2, 0.4, 0.2]} castShadow={castShadow} receiveShadow={receiveShadow} position={[0, 0.5, 0.45]}>
                    <meshPhongMaterial color={`#66483a`} />
                </Box>
                <Box args={[0.5, 1, 0.5]} castShadow={castShadow} receiveShadow={receiveShadow} position={[0, 0, 0.25]}>
                    <meshPhongMaterial color={`#66483a`} />
                </Box>
            </group>
        </group>
    );
};

const DuckWrapper: React.FC = () => {
    return (
        <>
            <Duck/>
            <group rotation={[0, radians(180), 0]}>
                <Duck castShadow={false} receiveShadow={false}/>
            </group>
        </>
    )
}

export default DuckWrapper;