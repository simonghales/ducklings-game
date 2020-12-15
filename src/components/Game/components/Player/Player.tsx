import React, {useLayoutEffect, useRef} from "react";
import Duck from "../../../../3d/Duck/Duck";
import {useController} from "./hooks/useController";
import {Object3D} from "three";
import {usePhysics} from "./hooks/usePhysics";
import {playerGroupRef} from "../../../../global/state/refs";
import PlayerUIHelper from "./components/PlayerUIHelper/PlayerUIHelper";

const Player: React.FC = () => {

    const ref = useRef<Object3D>(new Object3D())

    useLayoutEffect(() => {
        playerGroupRef.ref = ref.current
    }, [])

    const [api] = usePhysics(ref)
    useController(api)

    return (
        <group ref={ref}>
            <Duck/>
            <PlayerUIHelper/>
        </group>
    );
};

export default Player;