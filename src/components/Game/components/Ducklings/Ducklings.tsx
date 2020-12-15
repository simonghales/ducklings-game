import React from "react";
import Duck from "../../../../3d/Duck/Duck";

const scale: [number, number, number] = [0.3, 0.3, 0.3]

const Ducklings: React.FC = () => {
    return (
        <>
            <group scale={scale} position={[0, -1.1, 0]}>
                <Duck/>
            </group>
            <group scale={scale} position={[0, -1.85, 0]}>
                <Duck/>
            </group>
            <group scale={scale} position={[0, -2.6, 0]}>
                <Duck/>
            </group>
            <group scale={scale} position={[0, -3.35, 0]}>
                <Duck/>
            </group>
        </>
    );
};

export default Ducklings;