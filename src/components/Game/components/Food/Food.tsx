import React, {useCallback, useRef} from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
import {FoodSourceData} from "../../../../game/food/logic/state";
import { useSpring } from "react-spring";
import {Group, Object3D} from "three";
import {useFrame} from "react-three-fiber";
import {numLerp} from "../../../../utils/numbers";
import {useBodySync} from "../../../../physics/components/Physics/hooks";
import {getFoodUuid} from "../../../../shared/uuids";

export const radius = 0.2

const color = '#48792a'

const Food: React.FC<{
    data: FoodSourceData,
}> = ({data}) => {
    const {id, food} = data
    const ref = useRef<Object3D>(new Object3D())
    const uuid = getFoodUuid(id)
    useBodySync(ref, uuid, true)

    const spring = useSpring({
        food: food,
        config: {
            mass: 1,
            tension: 40,
            friction: 26,
        },
    })

    const onFrame = useCallback(() => {
        if (!ref.current) return
        const value = (spring.food.getValue() as number) / 50
        const lerped = numLerp(value, ref.current.scale.x, 0.5)
        ref.current.scale.x = lerped
        ref.current.scale.y = lerped
    }, [ref, spring])

    useFrame(onFrame)

    return (
        <group ref={ref}>
            {/*<a.group scale-x={scale} scale-y={scale}>*/}
                <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                    <meshBasicMaterial color={color} transparent opacity={1} />
                </Cylinder>
            {/*</a.group>*/}
        </group>
    )
}

export default Food