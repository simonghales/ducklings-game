import {BodyApi} from "../../../../../../physics/components/Physics/hooks";
import {MutableRefObject, useCallback} from "react";
import {useIntervalFrame} from "../../../../../../shared/hooks/frame";
import {Object3D} from "three";
import {useTargetObject} from "../../../../state/meshes";
import {useDuckling} from "../useDuckling";
import {useDucklingTargetUuid, useFollowMethod, useForageMethod, useMoveTowards, useTempTargetObject} from "./movement";
import {useTargetFoodSources} from "./food";
import {useGoals} from "./goals";


export const useBrain = (id: string, ref: MutableRefObject<Object3D>, api: BodyApi) => {

    const {order, isFollowingPlayer} = useDuckling(id)
    const targetFoodSources = useTargetFoodSources(ref.current)
    useGoals(id, targetFoodSources, isFollowingPlayer)

    const targetUuid = useDucklingTargetUuid(id, order)
    const [targetObject, refetchTargetObject] = useTargetObject(targetUuid)
    const [tempTarget, setTempTarget, isValidTarget] = useTempTargetObject(order)
    const moveTowards = useMoveTowards(api)
    const followMethod = useFollowMethod(ref, api, targetUuid, setTempTarget, isValidTarget, tempTarget, moveTowards)
    const isForaging = !isFollowingPlayer
    const forageMethod = useForageMethod(ref.current, targetFoodSources, moveTowards, isForaging)

    const onFrame = useCallback((delta: number) => {

        if (isForaging) {
            forageMethod(delta)
            return
        }

        if (tempTarget) {
            return followMethod(delta, tempTarget.object, true)
        }

        if (!targetObject) {
            if (targetUuid != null) {
                refetchTargetObject()
            }
            return
        }

        followMethod(delta, targetObject)

    }, [targetUuid, targetObject, refetchTargetObject, tempTarget, forageMethod, followMethod, isForaging])

    useIntervalFrame(onFrame)

}