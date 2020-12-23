import React, {useCallback, useEffect, useMemo, useRef} from "react"
import {useDisplacementRange} from "../../../workers/logic/components/Player/state/area";
import {getStoredMesh, useTargetObject} from "../../../workers/logic/state/meshes";
import {getPlayerUuid} from "../../../shared/uuids";
import {calculateCheapDistance, calcVector, getVectorMagnitude} from "../../../utils/vectors";
import {Vec2} from "planck-js";
import {useBodyApi} from "../../../physics/components/Physics/hooks";

const force = Vec2(0, 0)

const LgDisplacementRange: React.FC = () => {

    const bodyApi = useBodyApi('')

    const localStateRef = useRef({
        previousX: 0,
        previousY: 0,
    })

    const displacementRangeUuids = useDisplacementRange()
    const [playerObject, refetch] = useTargetObject(getPlayerUuid())

    const displacementRangeObjects = useMemo(() => {
        return displacementRangeUuids.map((uuid) => ({
            uuid,
            object: getStoredMesh(uuid)
        }))
    }, [displacementRangeUuids])

    const onUpdate = useCallback(() => {

        // todo - calculate delta...

        const player = playerObject ?? refetch()

        if (!player) return

        const localState = localStateRef.current

        const {
            previousX,
            previousY
        } = localState
        const {x, y} = player.position

        const xVel = x - previousX
        const yVel = y - previousY

        const magnitude = getVectorMagnitude(xVel, yVel)

        // console.log('magnitude', magnitude)

        localState.previousX = x
        localState.previousY = y

        displacementRangeObjects.forEach(rangeItem => {
            if (!rangeItem.object) {
                rangeItem.object = getStoredMesh(rangeItem.uuid)
            }
            const {uuid, object} = rangeItem
            if (!object) return
            const {x: objX, y: objY} = object.position

            const vector = calcVector(objY, y, objX, x)

            const objXVel = vector[0]
            const objYVel = vector[1]

            const cheapDistance = calculateCheapDistance(previousX, objX, previousY, objY)
            const delay = cheapDistance * 1000 / 25

            const finalXVel = objXVel * (magnitude / 10 / (cheapDistance / 2))
            const finalYVel = objYVel * (magnitude / 10 / (cheapDistance / 2))

            setTimeout(() => {

                // consider reducing force based upon distance

                force.set(finalXVel, finalYVel)
                bodyApi.applyForceToCenter(force, uuid)
            }, delay)


        })

    }, [displacementRangeObjects, playerObject, refetch, bodyApi])

    useEffect(() => {

        // const x = 1.75;
        // const y = 0.75;
        // const pX = 1.4937880039215088;
        // const pY = -0.4576660394668579;

        // const x = 0;
        // const y = -0.75;
        // const pX = 0;
        // const pY = 0;
        //
        // console.log('calcVector', calcVector(y, pY, x, pX))

        const interval = setInterval(() => {
            onUpdate()
        }, 1000 / 30)

        return () => {
            clearInterval(interval)
        }

    }, [onUpdate])

    return null
}

export default LgDisplacementRange