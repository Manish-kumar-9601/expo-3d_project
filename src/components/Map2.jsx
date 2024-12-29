﻿/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Digital screen official (https://sketchfab.com/ck212575)
License: SKETCHFAB Standard (https://sketchfab.com/licenses)
Source: https://sketchfab.com/3d-models/low-poly-forest-1-e7bb0600ee7c47a9aadf5598861837aa
Title: low poly forest 1
*/
import React, { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from "@react-three/fiber"
import { RigidBody } from '@react-three/rapier';
export const Map2 = React.memo((props) =>
{
    const { nodes, materials } = useLoader(GLTFLoader, '/assets/models/map2.glb')
    const groundRef = useRef()
    return (
        <>
            <RigidBody type='fixed' colliders='trimesh' position={[0, -.5, 0]}  >

                <group {...props} dispose={null} ref={groundRef} position={[0, -.0, 0]} >
                    <group name="Sketchfab_Scene">
                        <group
                            name="Sketchfab_model"
                            rotation={[-Math.PI / 2, 0, 0]}
                            userData={{ name: 'Sketchfab_model' }}>
                            <group
                                name="low_poly_forest_1objcleanermaterialmergergles"
                                userData={{ name: 'low poly forest 1.obj.cleaner.materialmerger.gles' }}>
                                <mesh
                                    name="Object_2"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.Object_2.geometry}
                                    material={materials.Material}
                                    userData={{ name: 'Object_2' }}
                                />
                                <mesh
                                    name="Object_3"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.Object_3.geometry}
                                    material={materials.Material}
                                    userData={{ name: 'Object_3' }}
                                />
                                <mesh
                                    name="Object_4"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.Object_4.geometry}
                                    material={materials.Material}
                                    userData={{ name: 'Object_4' }}
                                />
                                <mesh
                                    name="Object_5"
                                    castShadow
                                    receiveShadow
                                    geometry={nodes.Object_5.geometry}
                                    material={materials.Material}
                                    userData={{ name: 'Object_5' }}
                                />
                            </group>
                        </group>
                    </group>
                </group>
            </RigidBody>
        </>

    )
}
)

useLoader.preload(GLTFLoader, '/assets/models/map2.glb')
