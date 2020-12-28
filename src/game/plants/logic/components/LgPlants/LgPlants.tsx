import React, {useRef} from "react"
import {plants} from "../../../../../shared/data";
import {Object3D} from "three";
import {getPlantUuid} from "../../../../../shared/uuids";
import {useStoreMesh} from "../../../../../workers/logic/state/meshes";
import {useSyncBody} from "../../../../../workers/logic/components/LogicApp/hooks/useSyncBody";
import LgLilypads from "./components/LgLilypads/LgLilypads";

const LgPlants: React.FC = () => {
    return (
        <>
            <LgLilypads/>
        </>
    )
}

export default LgPlants