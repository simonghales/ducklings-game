import {BodyApi} from "../../../../../physics/components/Physics/hooks";
import {MutableRefObject, useCallback, useMemo, useRef} from "react";
import {useDuckling} from "./useDuckling";
import {useIntervalFrame} from "../../../../../shared/hooks/frame";
import {Object3D} from "three";
import {getStoredMesh, useTargetObject} from "../../../state/meshes";
import {ValidUUID} from "../../../../../utils/ids";
import {getSortedDucklings} from "../../../state/ducklings";
import {getDucklingUuid, getPlayerUuid} from "../../../../../shared/uuids";
import {lerpRadians, numLerp, PI, PI_TIMES_TWO} from "../../../../../utils/numbers";
import {getRadianAngleDifference, radians} from "../../../../../utils/angles";
import {ducklingTargets} from "../../../../../components/Game/components/Ducklings/state/targets";
import {Vec2} from "planck-js";

const vector = Vec2(0, 0)

const useDucklingTargetUuid = (id: string, order: number): ValidUUID | null => {

    const targetUuid = useMemo<ValidUUID | null>(() => {

        const sortedDucklings = getSortedDucklings()

        const ducklingIndex = sortedDucklings.findIndex((duckling) => duckling.id === id)

        if (ducklingIndex === 0) {
            return getPlayerUuid()
        }

        const previousDuckling = sortedDucklings[ducklingIndex - 1]

        return getDucklingUuid(previousDuckling.id)

        return null
    }, [id, order])

    return targetUuid
}

const useMovementMethod = (ref: MutableRefObject<Object3D>, api: BodyApi, targetUuid: ValidUUID | null) => {

    const localStateRef = useRef<{
        previousMeshX: number,
        previousMeshY: number,
        previousXVel: number,
        previousYVel: number,
        previousX: number,
        previousY: number,
        previousXDir: number,
        previousYDir: number,
        previousTargetX: number,
        previousTargetY: number,
        requestedPosition: null | number,
        requestedPositionTimestamp: number,
        positionCooldown: number,
        lerpedTargetX: number,
        lerpedTargetY: number,
    }>({
        previousX: 0,
        previousY: 0,
        previousXVel: 0,
        previousYVel: 0,
        previousMeshX: 0,
        previousMeshY: 0,
        previousXDir: 0,
        previousYDir: 0,
        previousTargetX: 0,
        previousTargetY: 0,
        requestedPosition: null,
        requestedPositionTimestamp: 0,
        positionCooldown: 0,
        lerpedTargetX: 0,
        lerpedTargetY: 0,
    })

    const offset = useMemo(() => {
        return targetUuid === getPlayerUuid() ? 1 : 0.5
    }, [targetUuid])

    return useCallback((delta: number, targetObject: Object3D) => {

        const movedXDiff = Math.abs(ref.current.position.x - localStateRef.current.previousMeshX)
        const movedYDiff = Math.abs(ref.current.position.y - localStateRef.current.previousMeshY)

        localStateRef.current.previousMeshX = ref.current.position.x
        localStateRef.current.previousMeshY = ref.current.position.y

        const localState = localStateRef.current

        let targetX = targetObject.position.x
        let targetY = targetObject.position.y

        let followAngle = targetObject.rotation.z
        if (followAngle > PI) {
            followAngle -= PI_TIMES_TWO
        }

        const followXDir = Math.sin(followAngle)
        const followYDir = Math.cos(followAngle)

        targetX += followXDir * offset
        targetY += followYDir * -1 * offset

        const moveXDiff = targetX - ref.current.position.x
        const moveYDiff = targetY - ref.current.position.y

        const moveAverage = (Math.abs(moveXDiff) + Math.abs(moveYDiff)) / 2

        const moveFactor = numLerp(0.25, 0.75, moveAverage < 1 ? moveAverage : 1)

        let vectorAngle = Math.atan2(moveYDiff, moveXDiff) - radians(90)
        vectorAngle = lerpRadians(followAngle, vectorAngle, moveFactor)

        if (vectorAngle > PI) {
            vectorAngle -= PI_TIMES_TWO
        }

        let prevAngle = ref.current.rotation.z // convert to low equivalent angle
        if (prevAngle > PI) {
            prevAngle -= PI_TIMES_TWO
        }

        let newAngle = lerpRadians(vectorAngle, prevAngle, 50 * delta)

        const angleDifference = getRadianAngleDifference(prevAngle, newAngle)

        // todo - account for delta?
        if (Math.abs(angleDifference) > 0.1) {
            if (angleDifference > 0) {
                newAngle = prevAngle + 0.1
            } else {
                newAngle = prevAngle - 0.1
            }
        }

        if (newAngle > PI) {
            newAngle -= PI_TIMES_TWO
        }

        // console.log('angleDifference', angleDifference)

        // api.setAngle(newAngle)

        const xDir = Math.sin(vectorAngle)
        const yDir = Math.cos(vectorAngle)

        localState.previousXDir = xDir
        localState.previousYDir = yDir

        const adjustedXDir = numLerp(xDir, localState.previousXDir, 55 * delta)
        const adjustedYDir = numLerp(yDir, localState.previousYDir, 55 * delta)

        localState.previousXDir = adjustedXDir
        localState.previousYDir = adjustedYDir

        let xValue = Math.floor(Math.abs(moveXDiff) * 1000) / 1000

        if (xValue > 2) {
            xValue = 2
        }

        let xVel = Math.pow(xValue, 1.75)

        let yValue = Math.floor(Math.abs(moveYDiff) * 1000) / 1000

        if (yValue > 2) {
            yValue = 2
        }

        let yVel = Math.pow(yValue, 1.75)

        if (moveXDiff < 0) {
            xVel *= -1
        }

        if (moveYDiff < 0) {
            yVel *= -1
        }

        xVel = xVel * 2
        yVel = yVel * 2

        vector.set(xVel, yVel)

        api.applyForceToCenter(vector)

        localState.previousTargetX = targetX
        localState.previousTargetY = targetY
        localState.previousX = targetObject.position.x
        localState.previousY = targetObject.position.y
        localState.previousXVel = xVel
        localState.previousYVel = yVel

    }, [ref, api, offset])
}

export const useBrain = (id: string, ref: MutableRefObject<Object3D>, api: BodyApi) => {

    const {order} = useDuckling(id)

    const targetUuid = useDucklingTargetUuid(id, order)
    const [targetObject, refetchTargetObject] = useTargetObject(targetUuid)

    const movementMethod = useMovementMethod(ref, api, targetUuid)

    const onFrame = useCallback((delta: number) => {

        if (!targetObject) {
            if (targetUuid != null) {
                refetchTargetObject()
            }
            return
        }

        movementMethod(delta, targetObject)

    }, [targetUuid, targetObject, refetchTargetObject])

    useIntervalFrame(onFrame)

}