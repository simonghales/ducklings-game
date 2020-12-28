import React, {useRef} from "react"
import {Object3D} from "three";
import {getPlantUuid} from "../../../../../../../shared/uuids";
import {useStoreMesh} from "../../../../../../../workers/logic/state/meshes";
import {useSyncBody} from "../../../../../../../workers/logic/components/LogicApp/hooks/useSyncBody";
import {LilypadClump, lilypadClumps} from "../../../../../shared/data";

const LgLilypad: React.FC<{
    id: string,
}> = ({id}) => {

    const ref = useRef(new Object3D())
    const uuid = getPlantUuid(id)
    useStoreMesh(uuid, ref.current)
    useSyncBody(uuid, ref)

    return null
}

const LgLilypadsClump: React.FC<{
    clump: LilypadClump,
}> = ({clump}) => {
    return (
        <>
            {
                clump.lilypads.map((lilypad) => (
                    <LgLilypad key={lilypad.id} id={lilypad.id}/>
                ))
            }
        </>
    )
}

const LgLilypads: React.FC = () => {
    return (
        <>
            <LgLilypadsClump clump={lilypadClumps[0]}/>
            <LgLilypadsClump clump={lilypadClumps[1]}/>
            <LgLilypadsClump clump={lilypadClumps[2]}/>
        </>
    )
}

export default LgLilypads