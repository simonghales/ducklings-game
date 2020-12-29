import React, {Suspense, useEffect} from "react"
import {useGLTF} from "@react-three/drei";
import {MeshBasicMaterial, MeshStandardMaterial, Object3D} from "three";
import {radians} from "../../utils/angles";
import {useTweaks} from "use-tweaks";

const url = "/assets/models/island.glb"

const Land: React.FC = () => {

    const gltf = useGLTF(url)

    useEffect(() => {
        const tempGltf: any = gltf as any
        // Object.keys(tempGltf.materials).forEach((materialKey: string) => {
        //     tempGltf.materials[materialKey] = new MeshBasicMaterial({
        //         color: 'blue',
        //     })
        // })
        Object.values(tempGltf.nodes).forEach((node: any) => {
            node.receiveShadow = true
            node.castShadow = true
            if (node.material) {
                node.material = new MeshStandardMaterial({
                    color: '#1d1922',
                })
            }
        })
        // console.log('gltf', gltf)
    }, [gltf])

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

const Wrapper: React.FC = () => {
    return (
        <Suspense fallback={null}>
            <Land/>
        </Suspense>
    )
}

export default Wrapper