import {useDucklingLocalState} from "../../context";
import {useProxy} from "valtio";
import {useEffect, useMemo} from "react";
import {getStoredMesh} from "../../../../state/meshes";
import {getFoodUuid} from "../../../../../../shared/uuids";
import {Object3D} from "three";

const getDistanceBetweenObjects = (objectA: Object3D, objectB: Object3D): number => {
    const x = objectA.position.x - objectB.position.x
    const y = objectA.position.y - objectB.position.y
    return Math.sqrt(x * x + y * y)
}

export const useTargetFoodSources = (currentObject: Object3D): string[] => {

    const localState = useDucklingLocalState()
    const {foodSourcesInRange} = useProxy(localState)

    const targetFoodSources = useMemo(() => {
        const foodSources = Object.keys(foodSourcesInRange).map((id) => {
            return {
                id,
                mesh: getStoredMesh(getFoodUuid(id))
            }
        }).filter((source) => !!source.mesh)
        return foodSources.sort((sourceA, sourceB) => {
            return (sourceA.mesh ? getDistanceBetweenObjects(currentObject, sourceA.mesh) : 9999) - (sourceB.mesh ? getDistanceBetweenObjects(currentObject, sourceB.mesh) : 9999)
        }).map(({id}) => id)
    }, [currentObject, foodSourcesInRange])

    return targetFoodSources

}