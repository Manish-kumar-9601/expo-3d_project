import React, { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from "@react-three/fiber"
import { RigidBody } from '@react-three/rapier';

export const Map2 = React.memo((props) => {
    const { nodes, materials } = useLoader(GLTFLoader, '/assets/models/map2.glb')
    const groundRef = useRef()

    // Modify the material colors and properties
   
    materials.Material.roughness = 0.4
    materials.Material.metalness = 1.1
    materials.Material.envMapIntensity = 1.2

    return (
        <>
            
            {/* <ambientLight intensity={0.4} color="#ffffff" /> */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={0.8}
                color="#ffd1b3"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            /> 

            <RigidBody type='fixed' colliders='trimesh' position={[0, -.5, 0]}>
                <group {...props} dispose={null} ref={groundRef} position={[0, -.0, 0]}>
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
})

useLoader.preload(GLTFLoader, '/assets/models/map2.glb')