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
import Food from "../Food/Food";

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
                    <DuckWeed initialPosition={[1, 1]}/>
                    <DuckWeed initialPosition={[1.5, 1.5]}/>
                    <DuckWeed initialPosition={[0.5, 1.75]}/>
                    <DuckWeed initialPosition={[0.5, 1.5]}/>
                    <DuckWeed initialPosition={[1.75, 0.75]}/>
                    <Food/>
                    <Ducklings/>
                </Physics>
            </Messages>
        </Canvas>
    );
};

export default GameCanvas;