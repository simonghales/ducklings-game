import React from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
// import { a, useSpring } from 'react-spring/three'
import {FoodSourceData} from "../../../../game/food/logic/state";
import { useSpring } from "react-spring";

export const radius = 0.2

const color = '#48792a'

const Food: React.FC<{
    data: FoodSourceData,
}> = ({data}) => {
    const {id, position, food} = data

    const { spring } = useSpring({
        spring: food / 50,
        config: { mass: 5, tension: 400, friction: 50 },
    })

    const scale = spring.to([0, 1], [0.1, 1])

    return (
        <group position={[position[0], position[1], 0]}>
            {/*<a.group scale-x={scale} scale-y={scale}>*/}
                <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                    <meshBasicMaterial color={color} transparent opacity={1} />
                </Cylinder>
            {/*</a.group>*/}
        </group>
    )
}

export default Food