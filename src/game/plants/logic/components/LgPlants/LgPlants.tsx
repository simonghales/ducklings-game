import React, {useRef} from "react"
import {plants} from "../../../../../shared/data";
import {Object3D} from "three";
import {getPlantUuid} from "../../../../../shared/uuids";
import {useStoreMesh} from "../../../../../workers/logic/state/meshes";
import {useSyncBody} from "../../../../../workers/logic/components/LogicApp/hooks/useSyncBody";

const LgPlant: React.FC<{
    id: string,
}> = ({id}) => {

    const ref = useRef(new Object3D())
    const uuid = getPlantUuid(id)
    useStoreMesh(uuid, ref.current)
    useSyncBody(uuid, ref)

    return null
}

const LgPlants: React.FC = () => {
    return (
        <>
            {
                plants.map(({id}) => (
                    <LgPlant id={id} key={id}/>
                ))
            }
        </>
    )
}

export default LgPlants