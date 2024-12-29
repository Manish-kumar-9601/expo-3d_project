import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Character } from './Character';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useStore } from '../Store';
import useKeyboard from '../useKeyboard';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
 

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

const normalizeAngle = (angle) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
};

const lerpAngle = (start, end, t) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);
    
    if (Math.abs(end - start) > Math.PI) {
        if (end > start) {
            start += 2 * Math.PI;
        } else {
            end += 2 * Math.PI;
        }
    }
    return normalizeAngle(start + (end - start) * t);
};

export const Player = React.memo(() => {
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
        handleJump: () => {
            if (!actions) return;
            refs.isJumpAction.current = true;
            actions.walk?.fadeOut(0.1);
            actions.idle?.fadeOut(0.1);
            actions.jump?.reset().fadeIn(0.1).play();
            
            if (refs.animationTimeout.current) {
                clearTimeout(refs.animationTimeout.current);
            }
            
            refs.animationTimeout.current = setTimeout(() => {
                actions.idle?.fadeIn(0.2).play();
            }, 3000);
        }
    }), [actions]);

    const updatePhysics = useCallback((velocity, inputVelocity) => {
        if (!refs.rigidBody.current) return;
        
        if (inputVelocity.x !== 0 || inputVelocity.z !== 0) {
            refs.characterRotationTarget.current = Math.atan2(inputVelocity.x, inputVelocity.z);
            refs.rigidBody.current.setLinvel(
                {
                    x: Math.sin(refs.characterRotationTarget.current),
                    y: inputVelocity.y,
                    z: Math.cos(refs.characterRotationTarget.current)
                },
                true
            );
        }
    }, []);

    useFrame(({ camera }, delta) => {
        if ( refs.rigidBody.current) {

        }

        const velocity = refs.rigidBody.current.linvel();
        const inputVelocity = { x: 0, z: 0, y: velocity.y };

        // Handle movement
        if (keyboard['KeyW']){ inputVelocity.z = 1; console.log("walk"); }
        if (keyboard['KeyS']) inputVelocity.z = -1;
        if (keyboard['KeyA']) inputVelocity.x = 1;
        if (keyboard['KeyD']) inputVelocity.x = -1;

        // Handle animations
        if (inputVelocity.x !== 0 || inputVelocity.z !== 0) {
            animationHandlers.startWalk();
        } else {
            animationHandlers.startIdle();
        }

        // Handle jumping
        if (keyboard[' '] || keyboard['space'] || keyboard['Space']) {
            animationHandlers.handleJump();
            inputVelocity.y = 4;
        }

        // Update physics
        updatePhysics(velocity, inputVelocity);

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
        if (mixer) {
            mixer.update(delta);
        }
    });

    return (
        <RigidBody colliders={false} lockRotations ref={refs.rigidBody}>
            <group ref={refs.container}>
                <group ref={refs.cameraTarget} position={[0, 0, 1.6]} />
                <group ref={refs.cameraPosition} position={[0, 0.3, -.9]} />
                <group ref={refs.character}>
                    <Character position-y={-0.45} />
                </group>
            </group>
            <CapsuleCollider args={[.38, 0.154]} />
        </RigidBody>
    );
});