import { Plane } from "@react-three/drei";
import React from "react";
import Material from 'component-material'
import {useTweaks} from "use-tweaks";
import {radians} from "../../utils/angles";
import {MeshPhongMaterial} from "three";
import {numLerp} from "../../utils/numbers";

const Mat = Material as any

const CustomMaterial: React.FC = () => {

    // todo - responsive screen size

    const originalA = [3, 8, 22]
    const originalB = [3, 13, 16]

    // const { colorA, colorB } = useTweaks({
    //     colorA: {
    //         r: originalA[0],
    //         g: originalA[1],
    //         b: originalA[2],
    //         a: 1,
    //     },
    //     colorB: {
    //         r: originalB[0],
    //         g: originalB[1],
    //         b: originalB[2],
    //         a: 1,
    //     },
    // });
    //
    // const colorAValue = [colorA.r / 255, colorA.g / 255, colorA.b / 255]
    // const colorBValue = [colorB.r / 255, colorB.g / 255, colorB.b / 255]

    const colorAValue = [originalA[0] / 255, originalA[1] / 255, originalA[2] / 255]
    const colorBValue = [originalB[0] / 255, originalB[1] / 255, originalB[2] / 255]

    return (
        <Mat
            from={MeshPhongMaterial}
            uniforms={{
                screenWidth: { value: window.innerWidth, type: 'float' },
                screenHeight: { value: window.innerHeight, type: 'float' },
                colorA: {
                    value: colorAValue,
                    type: 'vec3',
                },
                colorB: {
                    value: colorBValue,
                    type: 'vec3',
                },
            }}
            colorA={colorAValue}
            colorB={colorBValue}
            varyings={{
                posX: { type: 'float' },
                posY: { type: 'float' },
            }}
            >
            <Material.Vert.fog_vertex
                children={`
                    vec4 v = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    posX = v.x / v.z;
                    posY = v.y / v.z;
                `}
            />
            <Material.Frag.logdepthbuf_fragment
                children={`
                    // vec3 test = vec3( 0.5 * posX + 0.5, - 0.5 * posY + 0.5, 0.0);
                    vec3 test = vec3(0.5 * posX + 0.5, - 0.5 * posY + 0.5, 0.0);
                    // test.rgb *= vec3(1.0, 0.0, 0.0);
                    diffuseColor = vec4(mix(colorA, colorB, test), 1.0);
                `}
            />
        </Mat>
    )
}

const Water: React.FC = () => {

    // const { color, y } = useTweaks({
    //     color: {
    //         r: 255,
    //         g: 255,
    //         b: 0,
    //         a: 1,
    //     },
    //     y: 0.2,
    // });
    //
    // const colorString = `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`

    return (
        <>
            <Plane args={[20, 20]} receiveShadow>
                {/*<meshPhongMaterial color={`#223f56`} />*/}
                <CustomMaterial/>
            </Plane>
            {/*<gridHelper args={[20, 20, 'black', 'black']} rotation={[radians(90), 0, 0]}/>*/}
        </>
    );
};

export default Water;