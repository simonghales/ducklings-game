import React from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";

const radius = 0.2

const color = '#48792a'

const Food: React.FC = () => {
    return (
        <group position={[-2, -2, 0]}>
            <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                <meshBasicMaterial color={color} transparent opacity={1} />
            </Cylinder>
        </group>
    )
}

export default Food