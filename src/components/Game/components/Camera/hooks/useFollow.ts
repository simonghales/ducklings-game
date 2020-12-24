import {MutableRefObject, useCallback, useEffect, useMemo} from "react";
import {Group, Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {playerGroupRef} from "../../../../../global/state/refs";
import {numLerp} from "../../../../../utils/numbers";
import {useDucklingsInRange} from "../../Player/state/ducklings";
import {getStoredMesh} from "../../../../../workers/logic/state/meshes";
import {getDucklingUuid} from "../../../../../shared/uuids";
import {useProxy} from "valtio";
import {miscPlayerState} from "../../Player/state/misc";
import {useSpring} from "react-spring";

const localState = {
    playerPreviousX: 0,
    playerPreviousY: 0,
    previousXDiff: 0,
    previousYDiff: 0,
}

const useDucklingsInRangeObjects = () => {
    const ducklingsInRange = useDucklingsInRange()

    return useMemo(() => {
        let objects: Object3D[] = []
        ducklingsInRange.forEach((ducklingId) => {
            const object = getStoredMesh(getDucklingUuid(ducklingId))
            if (object) {
                objects.push(object)
            }
        })
        return objects
    }, [ducklingsInRange])

}

const calculateAveragePosition = (objects: Object3D[]): [x: number, y: number] | null => {
    if (objects.length === 0) return null
    let totalX = 0
    let totalY = 0
    objects.forEach((object, index) => {
        if (index === 0) {
            totalX = object.position.x
            totalY = object.position.y
        } else {
            totalX += object.position.x
            totalY += object.position.y
        }
    })
    const avgX = totalX / objects.length
    const avgY = totalY / objects.length
    return [avgX, avgY]
}

const useDucklingsFollowSpring = () => {

    const availableFoodSources = useProxy(miscPlayerState).availableFoodSources

    const spring = useSpring({
        ducklingsWeight: availableFoodSources ? 1 : 0,
        config: {
            mass: 1,
            tension: 40,
            friction: 26,
        }
    })

    return spring

}

export const useFollow = (ref: MutableRefObject<Group>) => {

    const ducklingsInRange = useDucklingsInRangeObjects()
    const spring = useDucklingsFollowSpring()

    const onFrame = useCallback((state: any, delta: number) => {

        const averagePosition = calculateAveragePosition(ducklingsInRange)

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

        let cameraX = playerX + adjustedXDiff
        let cameraY = playerY + adjustedYDiff

        if (averagePosition) {
            const weight = numLerp(0.66, 0.15, spring.ducklingsWeight.getValue() as number)
            cameraX = numLerp(averagePosition[0], cameraX, weight)
            cameraY = numLerp(averagePosition[1], cameraY, weight)
        }

        ref.current.position.x = numLerp(cameraCurrentX, cameraX, 0.05)
        ref.current.position.y = numLerp(cameraCurrentY, cameraY, 0.05)

    }, [ducklingsInRange, spring])

    useFrame(onFrame)

}