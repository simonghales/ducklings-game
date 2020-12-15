import {MutableRefObject} from "react";
import {Group} from "three";
import {useFrame} from "react-three-fiber";
import {playerGroupRef} from "../../../../../global/state/refs";
import {numLerp} from "../../../../../utils/numbers";

const localState = {
    playerPreviousX: 0,
    playerPreviousY: 0,
    previousXDiff: 0,
    previousYDiff: 0,
}

export const useFollow = (ref: MutableRefObject<Group>) => {

    useFrame((state, delta) => {

        const cameraCurrentX = ref.current.position.x
        const cameraCurrentY = ref.current.position.y

        const playerPreviousX = localState.playerPreviousX
        const playerPreviousY = localState.playerPreviousY

        const playerX = playerGroupRef.ref.position.x
        const playerY = playerGroupRef.ref.position.y

        localState.playerPreviousX = playerX
        localState.playerPreviousY = playerY

        const playerXDiff = Math.round((playerX - playerPreviousX) * 5000) * delta
        const playerYDiff = Math.round((playerY - playerPreviousY) * 5000) * delta

        const xOffset = playerXDiff
        const yOffset = playerYDiff

        const adjustedXDiff = numLerp(xOffset, localState.previousXDiff, 0.98)
        const adjustedYDiff = numLerp(yOffset, localState.previousYDiff, 0.98)

        localState.previousXDiff = adjustedXDiff
        localState.previousYDiff = adjustedYDiff

        const cameraX = playerX + adjustedXDiff
        const cameraY = playerY + adjustedYDiff

        ref.current.position.x = numLerp(cameraCurrentX, cameraX, 0.05)
        ref.current.position.y = numLerp(cameraCurrentY, cameraY, 0.05)

    })

}