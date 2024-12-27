import React, { Suspense, useMemo, useRef } from 'react'
import { Character } from './Character'
import { useFollowCam } from './useFollowCam';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { Vec3 } from 'cannon-es'
import { useCompoundBody, useContactMaterial } from '@react-three/cannon';
import { useStore } from '../Store';
// import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useKeyboard from '../useKeyboard';


function rotateTowards (currentQuaternion, targetQuaternion, step) { currentQuaternion.slerp(targetQuaternion, step); }
export const Player = ({ position }) =>
{
    const groupRef = useRef();
    const playerGround = useRef();
    const isJumpAction = useRef(false);
    const isRunningJumpAction = useRef(false);
    const { yaw } = useFollowCam(groupRef, [0, 1.2, 1.2]);
    const velocity = useMemo(() => new Vector3(), []);
    const inputVelocity = useMemo(() => new Vector3(), []);
    const euler = useMemo(() => new Euler(), []);
    const quaternion = useMemo(() => new Quaternion(), []);
    const targetQuaternion = useMemo(() => new Quaternion(), []);
    const worldPosition = useMemo(() => new Vector3(), []);
    const rayCasterOffset = useMemo(() => new Vector3(), []);
    const contactNormal = useMemo(() => new Vector3(0, 1, 0), []);
    const down = useMemo(() => new Vec3(0, -1, 0), []);
    const rotationMatrix = useMemo(() => new Matrix4(), []);
    const prevActiveAction = useRef(0);//0:idle ,1:run,2:walk,3:jump,4:runningJump,5:attack,6:crouch
    const { groundObject, actions, mixer } = useStore((state) => state);
    // const [_, get] = useKeyboardControls();
    // const { forward, back, left, right, jump, crouch, run, attack } = get();
    // console.log("key", get());
    const keyboard = useKeyboard()
    // console.log(actions['walk']);
    useContactMaterial('ground', 'slippery', {
        friction: 0,
        restitution: 0.01,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3
      })
    const [ref, body] = useCompoundBody(
        () => ({
            mass: 1,
            shapes: [
                { args: [0.20], position: [0, 0.15, 0], type: 'Sphere' },
                { args: [0.20], position: [0, 0.5, 0], type: 'Sphere' },
                { args: [0.20], position: [0, .8, 0], type: 'Sphere' }
            ],
            onCollide: (e) =>
            {
                if (e.contact.bi.id !== e.body.id)
                {
                    contactNormal.set(...e.contact.ni)
                }
                if (contactNormal.dot(down) > 0.5)
                {
                    if (isJumpAction.current)
                    {
                        isJumpAction.current = false
                        actions['jump'].fadeOut(0.1)
                        actions['idle'].reset().fadeIn(0.1).play()
                    }
                }
            },
            material: 'slippery',
            linearDamping: 0,
            position: position
        }),
        useRef()
    )
    useFrame(({ raycaster }, delta) =>
    {
        // console.log("keys:", forward, back, left, right, jump, crouch, run, attack);
        let activeAction = 0;//0:idle ,1:run,2:walk,3:jump,4:runningJump,5:attack,6:crouch
        body.angularFactor.set(0, 0, 0)
        ref.current.getWorldPosition(worldPosition)
        playerGround.current = false;
        rayCasterOffset.copy(worldPosition)
        rayCasterOffset.y += 0.1;
        raycaster.set(rayCasterOffset, down);
        raycaster.intersectObjects(Object.values(groundObject), false).forEach(i =>
        {
            if (i.distance <= 0.021)
            {
                playerGround.current = true;
            }
        })
        if (!playerGround.current)
        {
            body.linearDamping.set(0);
        } else
        {
            body.linearDamping.set(0.9999999);
        }
        const distance = worldPosition.distanceTo(groupRef.current.position)
        rotationMatrix.lookAt(worldPosition, groupRef.current.position, groupRef.current.up)
        targetQuaternion.setFromRotationMatrix(rotationMatrix);
        if (distance > 0.0001 && !groupRef.current.quaternion.equals(targetQuaternion))
        {
            targetQuaternion.z = 0
            targetQuaternion.x = 0
            targetQuaternion.normalize()
            rotateTowards(groupRef.current.quaternion, targetQuaternion, delta * 20)
        }
        if (document.pointerLockElement)
        {
            inputVelocity.set(0, 0, 0)
            // document.addEventListener('keypress', (event) =>
            // {
            //     console.log(event);
            // })
            if (keyboard['KeyW'])
            {
                // console.log(forward, "walk");
                activeAction = 1
                inputVelocity.z = -1;
            }
            if (keyboard['KeyS'])
            {
                activeAction = 1;
                inputVelocity.z = 1
            }
            if (keyboard['KeyA'])
            {
                activeAction = 1;
                inputVelocity.x = -1
            }
            if (keyboard['KeyD'])
            {
                activeAction = 1;
                inputVelocity.x = 1;
            }
            console.log("delta",delta);
            inputVelocity.setLength(delta * 20)
            if (activeAction !== prevActiveAction.current)
            {
                if (prevActiveAction.current !== 1 && activeAction === 1)
                {
                    actions['idle'].fadeOut(0.1);
                    actions['walk'].reset().fadeIn(0.1).play()
                }
                if (prevActiveAction.current !== 0 && activeAction === 0)
                {
                    actions['walk'].fadeOut(0.1);
                    actions['idle'].reset().fadeIn(0.1).play();
                }
                prevActiveAction.current = activeAction;
            }
            if (keyboard[' '] || keyboard['space'] ||keyboard['Space'])
            {

                console.log('jump');
                isJumpAction.current = true;
                actions['walk'].fadeOut(0.1);
                actions['idle'].fadeOut(0.1);
                actions['jump'].reset().fadeIn(0.1).play();
                inputVelocity.y = 6;

            }
            euler.y = yaw.rotation.y;
            quaternion.setFromEuler(euler)
            inputVelocity.applyQuaternion(quaternion)
            velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
            body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0])
        }
        if (activeAction === 1)
        {
            mixer.update(distance / 3);

        } else
        {
            mixer.update(delta)
        }
        groupRef.current.position.lerp(worldPosition, 0.3)
    })

    return (
        <group ref={groupRef} position={position} >
            {/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}
            <Suspense fallback={null}>
                <Character />
            </Suspense>
        </group>
    )
}
