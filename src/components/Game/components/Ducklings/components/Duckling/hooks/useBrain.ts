import {MutableRefObject, useRef} from "react";
import {Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {getStoredRef, storedRefs} from "../../../../../../../global/state/refs";
import {radians} from "../../../../../../../utils/angles";

let tick = 0

export const useBrain = (ref: MutableRefObject<Object3D>, followRefKey: string) => {

    const localStateRef = useRef({
        previousX: 0,
        previousY: 0,
    })

    const followRef = useRef<Object3D | null>(getStoredRef(followRefKey))

    useFrame((state, delta) => {
        if (!followRef.current) {
            followRef.current = getStoredRef(followRefKey)
        }
        const followObject = followRef.current
        if (!followObject) {
            console.log('no follow object?', followRefKey)
            return
        }
        const debug = tick % 10 === 0 && followRefKey === 'player'
        if (followRefKey === 'player') {
            tick += 1
        }
        const localState = localStateRef.current
        ref.current.position.x = followObject.position.x + 0
        ref.current.position.y = followObject.position.y - (followRefKey === 'player' ? 1.2 : 0.8)

        if (debug) {

            const xDiff = followObject.position.x - localState.previousX
            const yDiff = followObject.position.y - localState.previousY

            const xDiffCalc = Math.abs(xDiff * 1000 * delta)
            const yDiffCalc = Math.abs(yDiff * 1000 * delta)

            const vectorAngle = Math.atan2(yDiff, xDiff) - radians(90)

            const xDir = Math.sin(vectorAngle)
            const yDir = Math.cos(vectorAngle)

            // if (xDiffCalc > 0.01 || yDiffCalc > 0.01) {
            //     console.log('moving', xDir, yDir)
            // } else {
            //     console.log('not moving')
            // }

            // console.log('vectorAngle', xDir, yDir)
        }

        localState.previousX = followObject.position.x
        localState.previousY = followObject.position.y
    })

}