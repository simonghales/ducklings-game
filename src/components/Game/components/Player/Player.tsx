import React, {useLayoutEffect, useRef} from "react";
import Duck from "../../../../3d/Duck/Duck";
import {useController} from "./hooks/useController";
import {Object3D} from "three";
import {usePhysics} from "./hooks/usePhysics";
import {playerGroupRef, useStoreRef} from "../../../../global/state/refs";
import PlayerUIHelper from "./components/PlayerUIHelper/PlayerUIHelper";
import Debugging from "./components/Debugging/Debugging";
import {useCollisionsHandling} from "./hooks/useCollisionsHandling";
import InteractivePlane from "../../../../game/player/main/components/InteractivePlane/InteractivePlane";

const Player: React.FC = () => {

    const ref = useRef<Object3D>(null as unknown as Object3D)

    useLayoutEffect(() => {
        playerGroupRef.ref = ref.current
    }, [])

    useCollisionsHandling()
    const [api] = usePhysics(ref)

    useStoreRef("player", ref.current)
    useController(ref, api)

    return (
        <group ref={ref}>
            <Duck/>
            <Debugging/>
            <PlayerUIHelper/>
        </group>
    );
};

export default Player;