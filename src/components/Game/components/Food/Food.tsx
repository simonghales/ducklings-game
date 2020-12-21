import React from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {getFoodUuid} from "../../../../shared/uuids";
import {FixtureType} from "../../../../shared/fixtures";

const radius = 0.2

const color = '#48792a'

const Food: React.FC = () => {

    const uuid = getFoodUuid()

    const [ref] = useBody(() => ({
        type: BodyType.static,
        position: Vec2(-2, -2),
        fixtures: [{
            shape: BodyShape.circle,
            radius,
            fixtureOptions: {
                isSensor: true,
                userData: {
                    fixtureType: FixtureType.FOOD_PLANT,
                }
            },
        }],
    }), {
        uuid,
    })

    return (
        <group ref={ref}>
            <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                <meshBasicMaterial color={color} transparent opacity={1} />
            </Cylinder>
        </group>
    )
}

export default Food