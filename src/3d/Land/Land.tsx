import React, {Suspense, useEffect, useRef} from "react"
import {useGLTF} from "@react-three/drei";
import {Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D} from "three";
import {radians} from "../../utils/angles";
import {useTweaks} from "use-tweaks";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const url = "/assets/models/island.glb"

const Land: React.FC = () => {

    const gltf = useGLTF(url)

    useEffect(() => {
        const tempGltf: any = gltf as any
        Object.values(tempGltf.nodes).forEach((node: any) => {
            node.receiveShadow = true
            node.castShadow = true
            if (node.material) {
                node.material = new MeshStandardMaterial({
                    color: '#171411',
                })
            }
        })
    }, [gltf])

    // // @ts-ignore
    // const {color} = useTweaks({
    //     color: '#1d1922',
    // })
    //
    // useEffect(() => {
    //     const tempGltf: any = gltf as any
    //     Object.values(tempGltf.nodes).forEach((node: any) => {
    //         if (node.material) {
    //             node.material = new MeshStandardMaterial({
    //                 color: color,
    //             })
    //         }
    //     })
    // }, [color, gltf])

    // @ts-ignore
    // const {x, y, scale} = useTweaks({
    //     x: 1,
    //     y: 15,
    //     scale: 4,
    // })

    const x = 1
    const y = 15
    const scale = 4

    return (
        <group scale={[scale, scale, scale]} position={[x, y, 0]}>
            <primitive object={gltf.scene} position={[0, 0, 14]} rotation={[radians(90), 0, 0]} />
        </group>
    )
}

useGLTF.preload(url)

const Wrapper: React.FC = () => {
    return (
        <Suspense fallback={null}>
            <Land/>
        </Suspense>
    )
}

export default Wrapper