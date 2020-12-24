import React, {useRef, useState} from "react";
import Duck from "../../../../../../3d/Duck/Duck";
import {useStoreRef} from "../../../../../../global/state/refs";
import {Object3D} from "three";
import {useBrain} from "./hooks/useBrain";
import {usePhysics} from "./hooks/usePhysics";
import {Box, Cylinder, Html} from "@react-three/drei";
import TargetHelper from "../../../TargetHelper/TargetHelper";
import {useMessages} from "./hooks/useMessages";
import { DucklingContext } from "./context";
import {generateDucklingState} from "./state";
import Quack from "./components/Quack/Quack";
import {useStoreMesh} from "../../../../../../workers/logic/state/meshes";
import {getDucklingUuid} from "../../../../../../shared/uuids";
import {closeRadius} from "../../../Player/hooks/usePhysics";
import {radians} from "../../../../../../utils/angles";

const scale: [number, number, number] = [0.3, 0.3, 0.3]

export const getDucklingRefKey = (id: string): string => {
    return `duckling-${id}`
}

export const getDucklingTargetRefKey = (id: string): string => {
    return `duckling-target-${id}`
}

type DucklingProps = {
    id: string,
    position: number | null,
    closestDuckRefKey: string,
    initialX: number,
    initialY: number,
}

const Duckling: React.FC<DucklingProps> = ({
    id,
                      }) => {

    const ref = useRef<Object3D>(null as unknown as Object3D)
    useStoreMesh(getDucklingUuid(id), ref.current)
    usePhysics(id, ref)
    useMessages(id)

    return (
        <>
            <group ref={ref}>
                <group scale={scale}>
                    <Duck/>
                    <Quack/>
                </group>
                {/*<Cylinder args={[0.1, 0.1, 0.5, 20]} rotation={[radians(90), 0, 0]}>*/}
                {/*    <meshBasicMaterial color="green" transparent opacity={0.5} />*/}
                {/*</Cylinder>*/}
            </group>
        </>
    );
};

const DucklingWrapper: React.FC<DucklingProps> = (props) => {

    const [state] = useState(() => generateDucklingState())

    return (
        <DucklingContext.Provider value={{
            state,
        }}>
            <Duckling {...props}/>
        </DucklingContext.Provider>
    )
}

export default DucklingWrapper;