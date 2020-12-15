import {MutableRefObject} from "react";
import {Group} from "three";
import {useFrame} from "react-three-fiber";
import {playerGroupRef} from "../../../../../global/state/refs";

export const useFollow = (ref: MutableRefObject<Group>) => {

    useFrame(() => {
        const playerX = playerGroupRef.ref.position.x
        const playerY = playerGroupRef.ref.position.y

        ref.current.position.x = playerX
        ref.current.position.y = playerY

    })

}