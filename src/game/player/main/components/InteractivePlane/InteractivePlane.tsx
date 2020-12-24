import React, {useCallback} from "react";
import {Plane} from "@react-three/drei";
import {MouseEvent} from "react-three-fiber/canvas";
import {playerInputsState} from "../../../../../components/Game/components/Player/state/inputs";

const InteractivePlane: React.FC = () => {

    const onClick = useCallback((event: MouseEvent) => {
        const {point} = event
        const {x, y} = point
        playerInputsState.targetPosition = [x, y]
        playerInputsState.active = false
    }, [])

    return (
        <>
            <Plane visible={false} args={[100, 100]} position={[0, 0, 0.05]} receiveShadow onClick={onClick}/>
        </>
    );
};

export default InteractivePlane;