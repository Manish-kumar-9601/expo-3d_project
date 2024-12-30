import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Character } from './Character';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useStore } from '../Store';
import useKeyboard from '../useKeyboard';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { lerpAngle } from './LerpAngle';


// Stable vectors outside component
const CAMERA_WORLD_POSITION = new Vector3();
const CAMERA_LOOK_AT_WORLD_POSITION = new Vector3();
const CAMERA_LOOK_AT = new Vector3();

// Constants
const CONTROLS = {
    WALK_SPEED: 0.8,
    RUN_SPEED: 1.6,
    ROTATION_SPEED: degToRad(0.5),
};


export const Player =  () => {
    const { actions, mixer } = useStore((state)=>state);

    const [isCrouch, setIsCrouch] = useState(false);

    const refs = {
        rigidBody: useRef(),
        isJumpAction: useRef(false),
        rotationTarget: useRef(0),
        container: useRef(),
        cameraTarget: useRef(),
        cameraPosition: useRef(),
        character: useRef(),
        characterRotationTarget: useRef(0),
        prevActiveAction: useRef(0),
        animationTimeout: useRef(null)
    };

    const keyboard = useKeyboard();
console.log(keyboard);
    // Cleanup function
    useEffect(() => {
        return () => {
            if (refs.animationTimeout.current) {
                clearTimeout(refs.animationTimeout.current);
            }
        };
    }, []);

    // Memoized animation handlers
    const animationHandlers = useMemo(() => ({
        startWalk: () => {
            if (!actions) return;
            if (refs.prevActiveAction.current !== 1) {
                actions.idle?.fadeOut(0.1);
                actions.walk?.reset().fadeIn(0.1).play();
                refs.prevActiveAction.current = 1;
            }
        },
        startIdle: () => {
            if (!actions) return;
            if (refs.prevActiveAction.current !== 0) {
                actions.walk?.fadeOut(0.1);
                actions.idle?.reset().fadeIn(0.1).play();
                refs.prevActiveAction.current = 0;
            }
        },
        
    }), [actions]);

    // const updatePhysics = useCallback((velocity, inputVelocity) => {
    //     if (!refs.rigidBody.current) return;

    //     if (inputVelocity.x !== 0 || inputVelocity.z !== 0) {
    //         refs.characterRotationTarget.current = Math.atan2(inputVelocity.x, inputVelocity.z);
    //         refs.rigidBody.current.setLinvel(
    //             {
    //                 x: Math.sin(refs.characterRotationTarget.current),
    //                 y: inputVelocity.y,
    //                 z: Math.cos(refs.characterRotationTarget.current)
    //             },
    //             true
    //         );
    //     }
    // }, []);

    useFrame(({ camera }, delta) => {


            // console.log('frame');
            // if(keyboard['KeyW']){
            //     console.log('walk');
            //     actions['walk'].reset().fadeIn(.1).play()
            // }
        if ( refs.rigidBody.current) {
        const velocity = refs.rigidBody.current.linvel();
        const inputVelocity = { x: 0, z: 0, y: velocity.y };
            //emote handling
            if(keyboard['Digit1']){
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['houseDancing'].reset().fadeIn(0.1).play()
            }
            if(keyboard['Digit2']){
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['stylishFlip'].reset().fadeIn(0.1).play()
            }
            if(keyboard['Digit3']){
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['gangnamStyle'].reset().fadeIn(0.1).play()
            }
            if(keyboard['Digit4']){
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['breakDance1990'].reset().fadeIn(0.1).play()
            }
            if(keyboard['Digit5']){
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['flair'].reset().fadeIn(0.1).play()
            }
        // Handle movement
        if (keyboard['KeyW']){ inputVelocity.z =1; 

            actions['idle'].fadeOut(0.1)
            actions['walk'].reset().fadeIn(0.1).play()
         }
        if (keyboard['KeyS']) inputVelocity.z = -1;
        if (keyboard['KeyA']) inputVelocity.x = 1;
        if (keyboard['KeyD']) inputVelocity.x = -1;
        if(keyboard['KeyC']){
            if(isCrouch){
                console.log('isCrouch',isCrouch);
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].reset().fadeIn(0.1).play()
            }
            setIsCrouch((prev)=>!prev)
            if(!isCrouch){
                console.log('! isCrouch',isCrouch);
                actions['crouch'].fadeOut(0.3)
                actions['idle'].reset().fadeIn(0.2).play()
            }

            inputVelocity.x=0;
            inputVelocity.z=0;
        }
        
        if(keyboard['KeyE']){
            actions['walk'].fadeOut(0.1)
            actions['idle'].fadeOut(0.1)
            actions['attack'].reset().fadeIn(0.1).play()
        }
        if (inputVelocity.x !== 0 || inputVelocity.z !== 0 ) {
            animationHandlers.startWalk();
            
        } else {
            actions['idle'].reset().play()
            // animationHandlers.startIdle();
        }
        //running and running jump handling
        if(keyboard['ShiftLeft'] || keyboard['ShiftRight']  &&keyboard['KeyW'] ){
            actions['walk'].fadeOut(0.1)
            actions['run'].reset().fadeIn(0.1).play()
        }
        // Handle jumping
        if ( keyboard['Space']) {
            console.log('jump');
            actions['walk'].fadeOut(0.1)
            actions['idle'].fadeOut(0.1)
            actions['jump'].reset().fadeIn(0.1).play()
            
            inputVelocity.y = 4;
            setTimeout(()=>{
                actions['idle'].reset()?.fadeIn(0.1).play()
            },2000)
        }
        // Update physics
        
        if (inputVelocity.x !== 0 || inputVelocity.z !== 0) {
            refs.characterRotationTarget.current = Math.atan2(inputVelocity.x, inputVelocity.z);
            inputVelocity.x=Math.sin(refs.characterRotationTarget.current)
            refs.rigidBody.current.rotation.x=Math.sin(refs.characterRotationTarget.current)
            inputVelocity.z=Math.cos(refs.characterRotationTarget.current)
            refs.rigidBody.current.rotation.z=Math.cos(refs.characterRotationTarget.current)
        }
        velocity.z=inputVelocity.z
        velocity.x=inputVelocity.x
        velocity.y=inputVelocity.y
        refs.rigidBody.current.setLinvel(velocity,true)
        refs.rigidBody.current.setRotation(Math.sin(refs.characterRotationTarget.current),0,Math.cos(refs.characterRotationTarget.current))

    }


        // Update character rotation
        if (refs.character.current) {
            refs.character.current.rotation.y = lerpAngle(
                refs.character.current.rotation.y,
                refs.characterRotationTarget.current,
                0.1
            );
        }

        // Update camera
        if (refs.container.current && refs.cameraPosition.current && refs.cameraTarget.current) {
            refs.container.current.rotation.y = MathUtils.lerp(
                refs.container.current.rotation.y,
                refs.rotationTarget.current,
                0.1
            );

            refs.cameraPosition.current.getWorldPosition(CAMERA_WORLD_POSITION);
            camera.position.lerp(CAMERA_WORLD_POSITION, 0.1);

            refs.cameraTarget.current.getWorldPosition(CAMERA_LOOK_AT_WORLD_POSITION);
            CAMERA_LOOK_AT.lerp(CAMERA_LOOK_AT_WORLD_POSITION, 0.1);
            camera.lookAt(CAMERA_LOOK_AT);
        }

        // Update animations
        // if (mixer) {
        //     mixer.update(delta);
        // }
    });

    return (
        <RigidBody colliders={false} lockRotations ref={refs.rigidBody}   >
            <group ref={refs.container}>
                <group ref={refs.cameraTarget} position={[0, 0, 1.6]} />
                <group ref={refs.cameraPosition} position={[0, 0.3, -1]} />
                <group ref={refs.character}>
                    <Character position-y={-0.45} scale={0.6}  />
                </group>
            </group>
            <CapsuleCollider args={[.38, 0.154]} />
        </RigidBody>
    );
}

// import {  useFrame } from "@react-three/fiber";
// import {    useEffect } from "react";


// export const Player = () =>
// {
//     useFrame((state) => { console.log(`useFrame is running`,state); });

//     useEffect(() => { const handleKeyDown = (event) => { console.log(`Key pressed: ${event.key}`); }; window.addEventListener(`keydown`, handleKeyDown); return () => { window.removeEventListener(`keydown`, handleKeyDown); }; }, []); return (
//         <mesh> <boxGeometry args={[.5, .5, .5]} /> <meshStandardMaterial color="orange" />
//          </mesh>
//     )
// };