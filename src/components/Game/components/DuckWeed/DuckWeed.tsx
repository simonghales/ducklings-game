import React, {useState} from "react"
import {radians} from "../../../../utils/angles";
import {Cylinder} from "@react-three/drei";
import {useBody} from "../../../../physics/components/Physics/hooks";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {getPlantUuid} from "../../../../shared/uuids";
import { getLilypadColor } from "../../../../game/plants/shared/data";

const radius = 0.3

const useLilypadColors = (): string[] => {
    return []
}

const useLilypadColor = (id: string): string => {
    const colors = useLilypadColors()
    const [lilypadColor] = useState(() => getLilypadColor(id, colors))
    return lilypadColor
}

const DuckWeed: React.FC<{
    id: string,
    initialPosition: [number, number]
}> = ({id, initialPosition}) => {

    const [ref] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(initialPosition[0], initialPosition[1]),
        linearDamping: 5,
        attachToRope: true,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.02,
            fixtureOptions: {
                density: 5,
                userData: {
                    reactToWater: true,
                }
            },
        }],
    }), {
        applyAngle: true,
        uuid: getPlantUuid(id)
    })

    const lilypadColor = useLilypadColor(id)

    return (
        <group ref={ref}>
            <Cylinder args={[radius, radius, 0.1, 20]} rotation={[radians(90), 0, 0]} receiveShadow castShadow>
                <meshPhongMaterial color={lilypadColor} />
            </Cylinder>
        </group>
    )
}

export default DuckWeed