import React from "react"
import {Cylinder} from "@react-three/drei";
import {radians} from "../../../../../../utils/angles";
import {collisionRadius} from "../../hooks/usePhysics";

const Debugging: React.FC = () => {
    return (
        <Cylinder args={[collisionRadius, collisionRadius, 0.05, 20]} rotation={[radians(90), 0, 0]}>
            <meshBasicMaterial color="black" transparent opacity={0.1} />
        </Cylinder>
    )
}

export default Debugging