import React, {useCallback, useRef} from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
// import { a, useSpring } from 'react-spring/three'
import {FoodSourceData} from "../../../../game/food/logic/state";
import { useSpring } from "react-spring";
import {Group} from "three";
import {useFrame} from "react-three-fiber";
import {numLerp} from "../../../../utils/numbers";

export const radius = 0.2

const color = '#48792a'

const Food: React.FC<{
    data: FoodSourceData,
}> = ({data}) => {
    const {id, position, food} = data
    const ref = useRef<Group>(null as unknown as Group)

    const { spring } = useSpring({
        spring: food,
        config: {
            mass: 1,
            tension: 40,
            friction: 26,
        },
    })

    const scale = spring.to([0, 50], [0.1, 1])

    const onFrame = useCallback(() => {
        const value = scale.get()
        const lerped = numLerp(value, ref.current.scale.x, 0.5)
        ref.current.scale.x = lerped
        ref.current.scale.y = lerped
    }, [ref, scale])

    useFrame(onFrame)

    return (
        <group ref={ref} position={[position[0], position[1], 0]}>
            {/*<a.group scale-x={scale} scale-y={scale}>*/}
                <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                    <meshBasicMaterial color={color} transparent opacity={1} />
                </Cylinder>
            {/*</a.group>*/}
        </group>
    )
}

export default Food