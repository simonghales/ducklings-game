import React from "react"
import Lights from "../../../../../components/Game/components/Lights/Lights";
import Camera from "../../../../../components/Game/components/Camera/Camera";
import Player from "../../../../../components/Game/components/Player/Player";
import Land from "../../../../../3d/Land/Land";
import Water from "../../../../../3d/Water/Water";
import Plants from "../../../../plants/main/components/Plants/Plants";
import FoodManager from "../../../../food/main/components/FoodManager/FoodManager";
import Ducklings from "../../../../../components/Game/components/Ducklings/Ducklings";
import Shapes from "../../../../misc/components/Shapes/Shapes";

const Scene: React.FC = () => {
    return (
        <>
            <fog attach="fog" args={["#132d39", 30, 32]} />
            <Lights/>
            <Camera/>
            <Player/>
            <Land/>
            <Water/>
            <Plants/>
            <FoodManager/>
            <Ducklings/>
            {/*<Shapes/>*/}
        </>
    )
}

export default Scene