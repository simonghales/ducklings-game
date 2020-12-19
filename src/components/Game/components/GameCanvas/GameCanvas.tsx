import React from "react";
import {Canvas} from "react-three-fiber";
import Water from "../../../../3d/Water/Water";
import Camera from "../Camera/Camera";
import Lights from "../Lights/Lights";
import Player from "../Player/Player";
import Ducklings from "../Ducklings/Ducklings";
import Physics from "../../../../physics/components/Physics/Physics";
import Messages from "../../../Messages/Messages";
import DuckWeed from "../DuckWeed/DuckWeed";

const GameCanvas: React.FC = () => {
    return (
        <Canvas shadowMap>
            <Messages>
                <Physics>
                    <Lights/>
                    <Camera/>
                    <Player/>
                    {/*<FollowTargets/>*/}
                    <Water/>
                    <DuckWeed/>
                    <Ducklings/>
                </Physics>
            </Messages>
        </Canvas>
    );
};

export default GameCanvas;