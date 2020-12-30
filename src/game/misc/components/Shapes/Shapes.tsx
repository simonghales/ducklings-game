import React, {useMemo} from "react"
import {Shape} from "three";
import {radians} from "../../../../utils/angles";

const Shapes: React.FC = () => {

    const shapeGeom = useMemo(() => {
        const shape = new Shape()
        shape.moveTo(0, 0)
        shape.lineTo(1, 1)
        shape.lineTo(-1, 1)
        shape.lineTo(0, 0)
        return shape
    }, [])

    console.log('shapeGeom', shapeGeom)

    return (
        <mesh>
            <shapeGeometry args={[shapeGeom]} />
            <meshBasicMaterial color={`red`} />
        </mesh>
    )
}

export default Shapes