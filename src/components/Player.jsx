import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Character } from './Character';
import { useFollowCam } from './useFollowCam';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useStore } from '../Store';
import useKeyboard from '../useKeyboard';
import { useControls } from 'leva';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
const normalizeAngle = (angle) =>
{
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
};

const lerpAngle = (start, end, t) =>
{
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (Math.abs(end - start) > Math.PI)
    {
        if (end > start)
        {
            start += 2 * Math.PI;
        } else
        {
            end += 2 * Math.PI;
        }
    }

    return normalizeAngle(start + (end - start) * t);
};
export const Player = (props) =>
{
    const [isCrouch, setIsCrouch] = useState(false)
    const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
        "Character Control",
        {
            WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
            RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
            ROTATION_SPEED: {
                value: degToRad(0.5),
                min: degToRad(0.1),
                max: degToRad(5),
                step: degToRad(0.1),
            },
        }
    );

    const rigidBodyRef = useRef();

    const isJumpAction = useRef(false);

    const rotationTargetRef = useRef(0);
    const containerRef = useRef();
    const cameraTargetRef = useRef();
    const cameraPositionRef = useRef();
    const characterRef = useRef();
    const cameraWorldPositionRef = useRef(new Vector3());
    const cameraLookAtWorldPositionRef = useRef(new Vector3());
    const cameraLookAtRef = useRef(new Vector3());

    const characterRotationTargetRef = useRef(0);

    const prevActiveAction = useRef(0);//0:idle,1:walk,2:running,3:jump,4:running jump, 5:crouch,6:punch,
    const { actions, mixer } = useStore((state) => state);
    const keyboard = useKeyboard();

    useFrame(({ camera }, delta) =>
    {
        // if (!rigidBodyRef.current) return;
        
        let activeAction = 0;//0:idle,1:walk,2:running,3:jump,4:running jump, 5:crouch,6:punch,

        // Handle input
        if (document.pointerLockElement)
        {
            const velocity = rigidBodyRef.current.linvel();
            const inputVelocity = { x: 0, z: 0, y: velocity.y };
            if (keyboard['KeyW'])
            {
                activeAction = 1;
                console.log('walk');
                inputVelocity.z = 1;
            }
            if (keyboard['KeyS'])
            {
                activeAction = 1;
                console.log('back');
                inputVelocity.z = -1;
            }
            if (keyboard['KeyA'])
            {
                activeAction = 1;
                console.log('left');
                inputVelocity.x = 1;
            }
            if (keyboard['KeyD'])
            {
                activeAction = 1;
                console.log('right');
                inputVelocity.x = -1;
            }
            if (inputVelocity.x !== 0)
            {
                // Adjust rotation speed
                rotationTargetRef.current += (delta) * inputVelocity.x;
                inputVelocity.x = 0
            }
            let speed = keyboard['Shift'] || keyboard['shift'] || keyboard['ShiftLeft'] || keyboard['ShiftRight'] ? RUN_SPEED : WALK_SPEED;

            if (inputVelocity.x !== 0 && inputVelocity.z !== 0)
            {
                characterRotationTargetRef.current = Math.atan2(inputVelocity.x, inputVelocity.z);
                velocity.x = Math.sin(characterRotationTargetRef.current);
                velocity.z = Math.cos(characterRotationTargetRef.current);
            }
            characterRef.current.rotation.y = lerpAngle(
                characterRef.current.rotation.y,
                characterRotationTargetRef.current,
                0.1
            );
            // Animation handling
            if (activeAction !== prevActiveAction.current)
            {
                if (prevActiveAction.current !== 1 && activeAction === 1)
                {
                    actions['idle'].fadeOut(0.1);
                    actions['walk'].reset().fadeIn(0.1).play();
                }
                if (prevActiveAction.current !== 0 && activeAction === 0)
                {
                    actions['walk'].fadeOut(0.1);
                    actions['idle'].reset().fadeIn(0.1).play();
                }
                prevActiveAction.current = activeAction;
            }

            // Jump handling with ground check
            if (keyboard[' '] || keyboard['space'] || keyboard['Space'])
            {
                isJumpAction.current = true;
                actions['walk'].fadeOut(0.1);
                actions['idle'].fadeOut(0.1);
                actions['jump'].reset().fadeIn(0.1).play();
                inputVelocity.y = 4
                activeAction = 3
                setTimeout(() =>
                {
                    actions['idle'].fadeIn(0.2).play()
                }, 3000);
            }
            if (activeAction !== 5)
            {
                setIsCrouch(false)
            }
            if (inputVelocity.x === 0 && inputVelocity.y === 0 && inputVelocity.z === 0 && !isCrouch)
            {
                actions['walk'].fadeOut(0.1)
                actions['jump'].fadeOut(0.4)
                actions['idle'].reset().fadeIn(.1).play()
            }
            if (keyboard['KeyE'])
            {

                actions['walk'].fadeOut(0.1)
                actions['jump'].fadeOut(0.4)
                actions['runningJump'].fadeOut(0.3)
                actions['attack'].reset().fadeIn(.1).play()
                activeAction = 6;
            }
            if (keyboard['KeyC'])
            {
                setIsCrouch((prev) => !prev)
                if (isCrouch)
                {
                    actions['walk'].fadeOut(0.1)
                    actions['jump'].fadeOut(0.4)
                    actions['runningJump'].fadeOut(0.3)
                    actions['crouch'].reset().fadeIn(.1).play()
                    activeAction = 5;
                }

            }
            if (keyboard['KeyW'] && keyboard['ShiftLeft'] || keyboard['ShiftRight'] || keyboard['Shift'])
            {
                actions['walk'].fadeOut(0.1)
                actions['run'].reset().fadeIn(.1).play()

                activeAction = 2;
            }
            if (keyboard['KeyW'] && keyboard['ShiftLeft'] || keyboard['ShiftRight'] || keyboard['shift'] || keyboard['Shift'] && keyboard[' '])
            {
                actions['walk'].fadeOut(0.1)
                actions['run'].fadeOut(0.1)
                actions['runningJump'].reset().fadeIn(.1).play()
                activeAction = 4;
            }
            velocity.y = inputVelocity.y;
            velocity.x = inputVelocity.x;
            velocity.z = inputVelocity.z;
            rigidBodyRef.current.setLinvel(velocity, true)

            // Update animations
            mixer.update(delta);
        }
        // CAMERA
        containerRef.current.rotation.y = MathUtils.lerp(
            containerRef.current.rotation.y,
            rotationTargetRef.current,
            0.1
        );
        cameraPositionRef.current.getWorldPosition(cameraWorldPositionRef.current);
        camera.position.lerp(cameraWorldPositionRef.current, 0.1);
        if (cameraTargetRef.current)
        {
            cameraTargetRef.current.getWorldPosition(cameraLookAtWorldPositionRef.current);
            cameraLookAtRef.current.lerp(cameraLookAtWorldPositionRef.current, 0.1);

            camera.lookAt(cameraLookAtRef.current);
        }
    });

    return (
        <RigidBody colliders={false} lockRotations ref={rigidBodyRef}>
            <group ref={containerRef}>
                <group ref={cameraTargetRef} position={[0, 0, 1.6]} />
                <group ref={cameraPositionRef} position={[0, 0.3, -.9]} />
                <group ref={characterRef}>
                    <Character position-y={-0.45} />
                </group>
            </group>
            <CapsuleCollider args={[.38, 0.154]} />
        </RigidBody>
    );
};
