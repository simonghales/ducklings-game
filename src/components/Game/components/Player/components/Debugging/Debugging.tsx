import React from "react"
import {Box, Cylinder} from "@react-three/drei";
import {radians} from "../../../../../../utils/angles";
import {closeRadius, collisionRadius, mediumRadius, waterLength, waterOffset, waterWidth} from "../../hooks/usePhysics";

const Debugging: React.FC = () => {
    return (
        <>
            {/*<Cylinder args={[collisionRadius, collisionRadius, 0.05, 20]} rotation={[radians(90), 0, 0]}>*/}
            {/*</Cylinder>*/}
            <Box args={[waterWidth, waterLength, 0.05]} position={[0, waterOffset, 0]}>
                <meshBasicMaterial color="black" transparent opacity={0.5} />
            </Box>
            <Cylinder args={[mediumRadius, mediumRadius, 0.06, 20]} rotation={[radians(90), 0, 0]}>
                <meshBasicMaterial color="blue" transparent opacity={0.1} />
            </Cylinder>
            <Cylinder args={[closeRadius, closeRadius, 0.07, 20]} rotation={[radians(90), 0, 0]}>
                <meshBasicMaterial color="green" transparent opacity={0.1} />
            </Cylinder>
        </>
    )
}

export default Debugging