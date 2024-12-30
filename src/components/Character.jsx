﻿/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import React, { useEffect, useRef } from 'react'
import { useFBX, useGLTF } from '@react-three/drei'
import { LoopOnce, LoopRepeat } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useStore } from '../Store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export const Character = React.memo((props) =>
{
    const { nodes, materials } = useLoader(GLTFLoader, '/assets/models/character.glb')
    const groupRef = useRef();
    const { actions, mixer } = useStore((state) => state);
    // working
    // const idleAnimation = useFBX('/assets/animations/idle.fbx');
    // console.log(idleAnimation);
    // idleAnimation['animations'][0].name='idle';
    // const {actions}=useAnimations(idleAnimation['animations'],groupRef);
    // useEffect(() =>
    // {
    //     actions['idle'].play();
    // })

    // const idleAnimation = useFBX('/assets/animations/idle.fbx').animations
    // useFBX('/assets/animations/idle.fbx').animations
    const idleAnimation = useGLTF('/assets/animations/idle.glb').animations

    idleAnimation[0].name = 'idle';

    console.log(idleAnimation[0]);
    const jumpAnimation = useFBX('/assets/animations/jump.fbx').animations
    jumpAnimation[0].name = 'jump';
    const runningJumpAnimation = useFBX('/assets/animations/runningJump.fbx').animations
    runningJumpAnimation[0].name = 'runningJump';
    const runAnimation = useFBX('/assets/animations/running.fbx').animations
    runAnimation[0].name = 'run';
    const walkAnimation = useFBX('/assets/animations/walking.fbx').animations
    walkAnimation[0].name = 'walk';
    const attackAnimation = useFBX('/assets/animations/attack.fbx').animations
    attackAnimation[0].name = 'attack';
    const crouchAnimation = useFBX('/assets/animations/crouch.fbx').animations;
    crouchAnimation[0].name = 'crouch';
    //Emotes
    const flairAnimation = useFBX('/assets/animations/flair.fbx').animations;
    flairAnimation[0].name = 'flair'
    const houseDancingAnimation = useFBX('/assets/animations/houseDance.fbx').animations;
    houseDancingAnimation[0].name = 'houseDancing'
    const breakDance1990Animation = useFBX('/assets/animations/breakDance1990.fbx').animations;
    breakDance1990Animation[0].name = 'breakDance1990'
    const gangnamStyleAnimation = useFBX('/assets/animations/gangnamStyle.fbx').animations;
    gangnamStyleAnimation[0].name = ' gangnamStyle'
    const stylishFlipAnimation = useFBX('/assets/animations/stylishFlip.fbx').animations;
    stylishFlipAnimation[0].name = 'stylishFlip'
    useEffect(() =>
    {
        actions['idle'] = mixer.clipAction(idleAnimation[0], groupRef.current)
        actions['idle'].loop = LoopRepeat;
        actions['jump'] = mixer.clipAction(jumpAnimation[0], groupRef.current)
        actions['jump'].loop = LoopOnce;
        actions['runningJump'] = mixer.clipAction(runningJumpAnimation[0], groupRef.current)
        actions['runningJump'].loop = LoopOnce;
        actions['run'] = mixer.clipAction(runAnimation[0], groupRef.current)
        actions['run'].loop = LoopOnce;
        actions['walk'] = mixer.clipAction(walkAnimation[0], groupRef.current)
        actions['walk'].loop = LoopOnce;
        actions['attack'] = mixer.clipAction(attackAnimation[0], groupRef.current)
        actions['attack'].loop = LoopOnce;
        actions['crouch'] = mixer.clipAction(crouchAnimation[0], groupRef.current)
        actions['crouch'].loop = LoopRepeat;
        actions['stylishFlip'] = mixer.clipAction(stylishFlipAnimation[0], groupRef.current);
        actions['stylishFlip'].loop = LoopOnce;
        actions['gangnamStyle'] = mixer.clipAction(gangnamStyleAnimation[0], groupRef.current);
        actions['gangnamStyle'].loop = LoopOnce;
        actions['breakDance1990'] = mixer.clipAction(breakDance1990Animation[0], groupRef.current);
        actions['breakDance1990'].loop = LoopOnce;
        actions['houseDancing'] = mixer.clipAction(houseDancingAnimation[0], groupRef.current);
        actions['houseDancing'].loop = LoopOnce;
        actions['flair'] = mixer.clipAction(flairAnimation[0], groupRef.current);
        actions['flair'].loop = LoopOnce;
        actions['idle'].play()
    }, [actions, mixer, idleAnimation, jumpAnimation, runningJumpAnimation, runAnimation, walkAnimation, attackAnimation])
    useFrame((state, delta) => { mixer.update(delta); });
    return (

        <group {...props} dispose={null} scale={.6} ref={groupRef} position={[0, 1, 0]} >
            <group name="Scene">
                <group name="Armature" userData={{ name: 'Armature' }}>
                    <primitive object={nodes.Hips} />
                    <skinnedMesh
                        name="EyeLeft"
                        geometry={nodes.EyeLeft.geometry}
                        material={materials.Wolf3D_Eye}
                        skeleton={nodes.EyeLeft.skeleton}
                        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                        userData={{ targetNames: ['mouthOpen', 'mouthSmile'], name: 'EyeLeft' }}
                    />
                    <skinnedMesh
                        name="EyeRight"
                        geometry={nodes.EyeRight.geometry}
                        material={materials.Wolf3D_Eye}
                        skeleton={nodes.EyeRight.skeleton}
                        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                        userData={{ targetNames: ['mouthOpen', 'mouthSmile'], name: 'EyeRight' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Head"
                        geometry={nodes.Wolf3D_Head.geometry}
                        material={materials.Wolf3D_Skin}
                        skeleton={nodes.Wolf3D_Head.skeleton}
                        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
                        userData={{ targetNames: ['mouthOpen', 'mouthSmile'], name: 'Wolf3D_Head' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Teeth"
                        geometry={nodes.Wolf3D_Teeth.geometry}
                        material={materials.Wolf3D_Teeth}
                        skeleton={nodes.Wolf3D_Teeth.skeleton}
                        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
                        userData={{ targetNames: ['mouthOpen', 'mouthSmile'], name: 'Wolf3D_Teeth' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Hair"
                        geometry={nodes.Wolf3D_Hair.geometry}
                        material={materials.Wolf3D_Hair}
                        skeleton={nodes.Wolf3D_Hair.skeleton}
                        userData={{ name: 'Wolf3D_Hair' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Body"
                        geometry={nodes.Wolf3D_Body.geometry}
                        material={materials.Wolf3D_Body}
                        skeleton={nodes.Wolf3D_Body.skeleton}
                        userData={{ name: 'Wolf3D_Body' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Bottom"
                        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                        material={materials.Wolf3D_Outfit_Bottom}
                        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
                        userData={{ name: 'Wolf3D_Outfit_Bottom' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Footwear"
                        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                        material={materials.Wolf3D_Outfit_Footwear}
                        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
                        userData={{ name: 'Wolf3D_Outfit_Footwear' }}
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Top"
                        geometry={nodes.Wolf3D_Outfit_Top.geometry}
                        material={materials.Wolf3D_Outfit_Top}
                        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
                        userData={{ name: 'Wolf3D_Outfit_Top' }}
                    />
                </group>
            </group>
        </group>


    )
}
)

useLoader.preload(GLTFLoader, '/assets/models/character.glb')
useFBX.preload('/assets/animations/idle.fbx')
useFBX.preload('/assets/animations/jumping.fbx')
useFBX.preload('/assets/animations/runningJump.fbx')
useFBX.preload('/assets/animations/running.fbx')
useFBX.preload('/assets/animations/walking.fbx')
useFBX.preload('/assets/animations/attack.fbx')
useFBX.preload('/assets/animations/crouch.fbx')