import React from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {getFoodUuid} from "../../../../shared/uuids";
import {FixtureType} from "../../../../shared/fixtures";
import {FoodSourceData} from "../../../../game/food/main/data";

export const radius = 0.2

const color = '#48792a'

const Food: React.FC<{
    data: FoodSourceData,
}> = ({data}) => {
    const {id, position} = data
    return (
        <group position={[position[0], position[1], 0]}>
            <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                <meshBasicMaterial color={color} transparent opacity={1} />
            </Cylinder>
        </group>
    )
}

export default Food