import React, {useMemo} from "react"
import {Shape} from "three";

const Shapes: React.FC = () => {

    const shapeGeom = useMemo(() => {
        const shape = new Shape()
        shape.moveTo(0, 0)
        shape.moveTo(1, 1)
        shape.moveTo(-1, 1)
        return shape
    }, [])

    return null
}

export default Shapes