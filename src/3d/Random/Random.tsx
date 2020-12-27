import React from "react"
import {Box} from "@react-three/drei";
import {radians} from "../../utils/angles";

const Random: React.FC = () => {
    return (
        <Box args={[1, 1, 6]} position={[0, 0, -2.5]} rotation={[radians(20), radians(15), 0]} castShadow/>
    )
}

export default Random