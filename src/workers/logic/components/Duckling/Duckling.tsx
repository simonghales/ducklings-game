import * as React from "react"
import {useEffect, useRef} from "react";
import {Object3D} from "three";
import {useBodyApi} from "../../../../physics/components/Physics/hooks";
import {useBrain} from "./hooks/useBrain";
import {useSyncBody} from "../LogicApp/hooks/useSyncBody";
import {getDucklingUuid} from "../../../../shared/uuids";
import {useStoreMesh} from "../../state/meshes";
import { DucklingContext } from "./context";
import {useCollisionHandling} from "./hooks/useCollisionHandling";
import {useMessages} from "./hooks/useMessages";

const Duckling: React.FC<{
    id: string,
}> = ({id}) => {

    const ref = useRef(new Object3D())
    const uuid = getDucklingUuid(id)
    const api = useBodyApi(uuid)
    useStoreMesh(uuid, ref.current)
    useSyncBody(uuid, ref)
    useCollisionHandling(uuid, id)
    useBrain(id, ref, api)
    useMessages(id)

    useEffect(() => {

        setInterval(() => {
            // console.log(`Duckling ${id}`, ref.current.position.x, ref.current.position.y)
            // api.applyForceToCenter(Vec2(50, 50))
        }, 5000)

    }, [])

    return null
}

const DucklingWrapper: React.FC<{
    id: string,
}> = ({id}) => {
    return (
        <DucklingContext.Provider value={{
            id,
        }}>
            <Duckling id={id}/>
        </DucklingContext.Provider>
    )
}


export default DucklingWrapper