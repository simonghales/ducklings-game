import React from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";

const radius = 0.3

const color = '#355d29'

const DuckWeed: React.FC<{
    initialPosition: [number, number]
}> = ({initialPosition}) => {

    const [ref] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(initialPosition[0], initialPosition[1]),
        linearDamping: 2,
        attachToRope: true,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.02,
            fixtureOptions: {
                density: 0.3,
                userData: {
                    reactToWater: true,
                }
            },
        }],
    }), {
        applyAngle: true,
    })

    return (
        <group ref={ref}>
            <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                <meshBasicMaterial color={color} transparent opacity={1} />
            </Cylinder>
        </group>
    )
}

export default DuckWeed