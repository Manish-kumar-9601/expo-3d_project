import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Character } from './Character';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useStore } from '../Store';
import useKeyboard from '../useKeyboard';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { lerpAngle } from './LerpAngle';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';


// Stable vectors outside component
const CAMERA_WORLD_POSITION = new Vector3();
const CAMERA_LOOK_AT_WORLD_POSITION = new Vector3();
const CAMERA_LOOK_AT = new Vector3();

// Constants
// const CONTROLS = {
//     WALK_SPEED: 0.8,
//     RUN_SPEED: 1.6,
//     ROTATION_SPEED: degToRad(0.5),
// };


export const Player = () =>
{
    const { actions, mixer } = useStore((state) => state);
    const { zoom } = useControls("character controls",
        {

            
        }
    )
    const ROTATION_SPEED=degToRad(0.2)
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
        animationTimeout: useRef(null),
        isHover: useRef()
    };

    const keyboard = useKeyboard();
    console.log(keyboard);
    // Cleanup function
    useEffect(() =>
    {
        return () =>
        {
            if (refs.animationTimeout.current)
            {
                clearTimeout(refs.animationTimeout.current);
            }
        };
    }, []);

    // Memoized animation handlers
    const animationHandlers = useMemo(() => ({
        startIdle: () =>
        {
            if (!actions) return;
            if (refs.prevActiveAction.current !== 0)
            {
                actions.walk?.fadeOut(0.1);
                actions.idle?.reset().fadeIn(0.1).play();
                refs.prevActiveAction.current = 0;
            }
        },
        startWalk: () =>
        {
            if (!actions) return;
            if (refs.prevActiveAction.current !== 1)
            {
                actions['hipHop'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions.idle?.fadeOut(0.1);
                actions.walk?.reset().fadeIn(0.1).play();
                refs.prevActiveAction.current = 1;
            }
        },
        startRunning: () =>
        {
            if (!actions) return;
            if (refs.prevActiveAction.current !== 2)
            {
                actions.walk?.fadeOut(0.1);
                actions.run?.reset().fadeIn(0.1).play();
                refs.prevActiveAction.current = 2;
            }
        },

    }), [actions]);



    useFrame(({ camera, pointer }, delta) =>
    {
        if (refs.rigidBody.current)
        {
            const velocity = refs.rigidBody.current.linvel();
            const inputVelocity = { x: 0, z: 0, y: velocity.y };

            if (keyboard['CapsLock'])
            {
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                animationHandlers.startIdle
            }
            //emote handling
            if (keyboard['Digit1'])
            {
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['salute'].reset().fadeIn(0.1).play()
            }

            if (keyboard['Digit2'])
            {
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['upRock'].reset().fadeIn(0.1).play()
            }
            if (keyboard['Digit3'])
            {
                actions['hipHop'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['gangnamStyle'].reset().fadeIn(0.1).play()
            }
            if (keyboard['Digit4'])
            {
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['hipHop'].reset().fadeIn(0.1).play()
            }
            if (keyboard['Digit5'])
            {
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['lockingHipHop'].reset().fadeIn(0.1).play()
            }
            if (keyboard['Digit6'])
            {
                actions['hipHop']
                actions['gangnamStyle']
                actions['salute'].fadeOut(0.1)
                actions['victory'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['breakDanceUprock'].reset().fadeIn(0.1).play()
            } if (keyboard['Digit7'])
            {
                actions['hipHop']
                actions['gangnamStyle']
                actions['salute'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['victory'].reset().fadeIn(0.1).play()
            }
            // Handle movement
            if (keyboard['KeyW'])
            {
                inputVelocity.z += 1;
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                animationHandlers.startWalk
            }
            if (keyboard['KeyS'])
            {
                inputVelocity.z = -1;
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                animationHandlers.startWalk
            }
            if (keyboard['KeyA'])
            {
                inputVelocity.x = 1;
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                animationHandlers.startWalk

            }
            if (keyboard['KeyD']) 
            {
                inputVelocity.x = -1;
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                animationHandlers.startWalk

            }
            if (keyboard['KeyC'])
            {
                if (isCrouch)
                {
                    console.log('isCrouch', isCrouch);
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                    actions['gangnamStyle'].fadeOut(0.1)
                    actions['salute'].fadeOut(0.1)
                    actions['idle'].fadeOut(0.1)
                    actions['walk'].fadeOut(0.1)
                    actions['idle'].fadeOut(0.1)
                    actions['jump'].fadeOut(0.1)
                    actions['crouch'].reset().fadeIn(0.1).play()
                }
                setIsCrouch((prev) => !prev)
                if (!isCrouch)
                {
                    console.log('! isCrouch', isCrouch);
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.3)
                    actions['idle'].reset().fadeIn(0.2).play()
                }

                inputVelocity.x = 0;
                inputVelocity.z = 0;
            }

            if (keyboard['KeyE'])
            {
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['crouch'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].fadeOut(0.1)
                actions['attack'].reset().fadeIn(0.1).play()
            }
            if (inputVelocity.x !== 0 || inputVelocity.z !== 0)
            {
                animationHandlers.startWalk();
            } else
            {
                animationHandlers.startIdle();
            }
            //running and running jump handling
            if (keyboard['ShiftLeft'] || keyboard['ShiftRight'] && keyboard['KeyW'])
            {
                actions['jump'].fadeOut(0.1)
                actions['breakDanceUprock'].fadeOut(0.1)
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                animationHandlers.startRunning
            }
            // Handle jumping
            if (keyboard['Space'])
            {
                actions['breakDanceUprock'].fadeOut(0.1)
                console.log('jump');
                actions['hipHop'].fadeOut(0.1)
                actions['gangnamStyle'].fadeOut(0.1)
                actions['salute'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].reset().fadeIn(0.1).play()
                inputVelocity.y = 3;
                setTimeout(() =>
                {
                    actions['idle'].reset()?.fadeIn(0.1).play()
                }, 2000)
            }

            if (!keyboard['KeyW'] || !keyboard['KeyA'] || !keyboard['KeyS'] || !keyboard['KeyD'])
            {
                animationHandlers.startIdle
            }
            // Update physics
            if (inputVelocity.x !== 0)
            {
                refs.rotationTarget.current += ROTATION_SPEED * inputVelocity.x
            }
            if (inputVelocity.x !== 0 || inputVelocity.z !== 0)
            {
                refs.characterRotationTarget.current = Math.atan2(inputVelocity.x, inputVelocity.z);
                // inputVelocity.x = Math.sin(refs.characterRotationTarget.current)
                // inputVelocity.z = Math.cos(refs.characterRotationTarget.current)
                velocity.x = Math.sin( refs.rotationTarget.current+  refs.characterRotationTarget.current) 
                velocity.z = Math.cos(refs.rotationTarget.current+  refs.characterRotationTarget.current)
            }
            // mouse or touch rotation


            velocity.y = inputVelocity.y

            refs.rigidBody.current.setLinvel(velocity, true)

        }

        // Update character rotation
        if (refs.character.current)
        {
            refs.character.current.rotation.y = lerpAngle(
                refs.character.current.rotation.y,
                refs.characterRotationTarget.current,
                0.1
            );
        }


        // Update camera
        if (refs.container.current && refs.cameraPosition.current && refs.cameraTarget.current)
        {
            refs.container.current.rotation.y = MathUtils.lerp(
                refs.container.current.rotation.y,
                refs.rotationTarget.current*7,
                0.1
            );

            refs.cameraPosition.current.getWorldPosition(CAMERA_WORLD_POSITION);
            camera.position.lerp(CAMERA_WORLD_POSITION, 0.1);

            refs.cameraTarget.current.getWorldPosition(CAMERA_LOOK_AT_WORLD_POSITION);
            CAMERA_LOOK_AT.lerp(CAMERA_LOOK_AT_WORLD_POSITION, 0.3);
            camera.lookAt(CAMERA_LOOK_AT);
        }

        
    });

    return (
        <>



            <RigidBody colliders={false} lockRotations ref={refs.rigidBody}    >
                <group ref={refs.container}>
                    <group ref={refs.cameraTarget} position={[0, 0, 5]} />
                    <group ref={refs.cameraPosition} position={[0, .6,  -2]} />
                    <group ref={refs.character}>
                        <Character position-y={-0.35} scale={0.6} />
                    </group>
                </group>
                <CapsuleCollider args={[.38, 0.154]} />
            </RigidBody>
        </>
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