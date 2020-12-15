import { Plane } from "@react-three/drei";
import React from "react";
import {useTweaks} from "use-tweaks";

const Water: React.FC = () => {

    // const { color, y } = useTweaks({
    //     color: {
    //         r: 255,
    //         g: 255,
    //         b: 0,
    //         a: 1,
    //     },
    //     y: 0.2,
    // });
    //
    // const colorString = `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`

    return (
        <Plane args={[20, 20]} receiveShadow>
            <meshPhongMaterial color={`#223f56`} />
        </Plane>
    );
};

export default Water;