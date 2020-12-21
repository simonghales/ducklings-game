import * as React from "react"
import {useSyncBody} from "../LogicApp/hooks/useSyncBody";
import {useRef} from "react";
import {Object3D} from "three";
import {getPlayerUuid} from "../../../../shared/uuids";
import {useStoreMesh} from "../../state/meshes";
import {useCollisionHandling} from "./hooks/useCollisionHandling";

const Player: React.FC = () => {

    const ref = useRef(new Object3D())
    const uuid = getPlayerUuid()
    useStoreMesh(uuid, ref.current)
    useSyncBody(uuid, ref)
    useCollisionHandling(uuid)

    return null
}

export default Player