import React, {useEffect, useRef} from "react";
import {Html} from "@react-three/drei";
import {playerState} from "../../../../../../global/state/player";
import {numLerp} from "../../../../../../utils/numbers";

const PlayerUIHelper: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)

    useEffect(() => {
        setInterval(() => {
            const parentTransform = ref.current.parentElement?.style.transform
            const transformSplit = parentTransform?.split("(")[1].split(",") ?? ["0", "0"]
            const parentX = Number(transformSplit[0].trim().replace('px', ''))
            const parentY = Number(transformSplit[1].trim().replace('px', ''))
            playerState.screenPosX = numLerp(parentX, playerState.screenPosX, 0.5)
            playerState.screenPosY = numLerp(parentY, playerState.screenPosY, 0.5)
        }, 500)
    }, [])

    return (
        <Html center ref={ref}/>
    );
};

export default PlayerUIHelper;