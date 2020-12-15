import React from "react";
import {Canvas} from "react-three-fiber";
import Water from "../../../../3d/Water/Water";
import Camera from "../Camera/Camera";
import Lights from "../Lights/Lights";
import Player from "../Player/Player";
import Ducklings from "../Ducklings/Ducklings";

const GameCanvas: React.FC = () => {
    return (
        <Canvas shadowMap>
            <Lights/>
            <Camera/>
            <Player/>
            <Water/>
            <Ducklings/>
        </Canvas>
    );
};

export default GameCanvas;