import React, {useRef} from "react"
import {Box} from "@react-three/drei";
import {Object3D} from "three";
import {useStoreRef} from "../../../../global/state/refs";

const TargetHelper: React.FC<{
    refKey: string,
    yOffset: number,
}> = ({yOffset, refKey}) => {

    const ref = useRef<Object3D>(new Object3D())

    useStoreRef(refKey, ref.current)

    return (
        <Box ref={ref} args={[0.2, 0.2, 0.2]} position={[0, yOffset, 0]}>
            <meshPhongMaterial color={`orange`} />
        </Box>
    )
}

export default TargetHelper