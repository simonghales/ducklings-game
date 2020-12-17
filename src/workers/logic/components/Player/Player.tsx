import * as React from "react"
import {useSyncBody} from "../LogicApp/hooks/useSyncBody";
import {useRef} from "react";
import {Object3D} from "three";
import {getPlayerUuid} from "../../../../shared/uuids";
import {useStoreMesh} from "../../state/meshes";

const Player: React.FC = () => {

    const ref = useRef(new Object3D())
    const uuid = getPlayerUuid()
    useStoreMesh(uuid, ref.current)
    useSyncBody(uuid, ref)

    return null
}

export default Player