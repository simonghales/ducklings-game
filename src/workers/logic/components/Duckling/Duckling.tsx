import * as React from "react"
import {useEffect, useRef} from "react";
import {Object3D} from "three";
import {useBodyApi, useRafBodySync} from "../../../../physics/components/Physics/hooks";
import {Vec2} from "planck-js";

const Duckling: React.FC<{
    id: string,
}> = ({id}) => {

    const ref = useRef(new Object3D())

    const api = useBodyApi(`duckling-${id}`)
    useRafBodySync(ref, `duckling-${id}`, true, true)

    useEffect(() => {

        setInterval(() => {
            // console.log(`Duckling ${id}`, ref.current.position.x, ref.current.position.y)
            // api.applyForceToCenter(Vec2(50, 50))
        }, 5000)

    }, [])

    return null
}

export default Duckling