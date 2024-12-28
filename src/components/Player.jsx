import React, { Suspense, useMemo, useRef } from 'react'
import { Character } from './Character'
import { useFollowCam } from './useFollowCam'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier'
import { useStore } from '../Store'
import useKeyboard from '../useKeyboard'

function rotateTowards (currentQuaternion, targetQuaternion, step)
{
    currentQuaternion.slerp(targetQuaternion, step)
}

export const Player = ({ position }) =>
{
    const groupRef = useRef()
    const rigidBodyRef = useRef()
    const playerGround = useRef()
    const isJumpAction = useRef(false)
    const { yaw } = useFollowCam(groupRef, [0, 1.3, 2])
    const { rapier, world } = useRapier()

    // Memoized vectors and matrices
    const velocity = useMemo(() => new Vector3(), [])
    const inputVelocity = useMemo(() => new Vector3(), [])
    const euler = useMemo(() => new Euler(), [])
    const quaternion = useMemo(() => new Quaternion(), [])
    const targetQuaternion = useMemo(() => new Quaternion(), [])
    const worldPosition = useMemo(() => new Vector3(), [])
    const rayCasterOffset = useMemo(() => new Vector3(), [])
    const rotationMatrix = useMemo(() => new Matrix4(), [])

    const prevActiveAction = useRef(0)
    const { groundObject, actions, mixer } = useStore((state) => state)
    const keyboard = useKeyboard()

    useFrame(({ raycaster }, delta) =>
    {
        if (!rigidBodyRef.current) return

        let activeAction = 0
        const rigidBody = rigidBodyRef.current

        // Lock rotation
        rigidBody.setEnabledRotations(false, false, false)

        // Get current position
        const currentPosition = rigidBody.translation()
        worldPosition.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // Enhanced ground check with ray casting
        const ray = new rapier.Ray(
            { x: currentPosition.x, y: currentPosition.y + 0.1, z: currentPosition.z },
            { x: 0, y: -1, z: 0 }
        )
        const hit = world.castRay(ray, 0.5, true)
        playerGround.current = hit !== null && hit.toi < 0.2

        // Prevent falling through by setting minimum Y position
        if (currentPosition.y < -50)
        {
            rigidBody.setTranslation({ x: position[0], y: position[1], z: position[2] }, true)
            rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
        }

        // Character rotation
        const distance = worldPosition.distanceTo(groupRef.current.position)
        rotationMatrix.lookAt(worldPosition, groupRef.current.position, groupRef.current.up)
        targetQuaternion.setFromRotationMatrix(rotationMatrix)

        if (distance > 0.0001 && !groupRef.current.quaternion.equals(targetQuaternion))
        {
            targetQuaternion.z = 0
            targetQuaternion.x = 0
            targetQuaternion.normalize()
            rotateTowards(groupRef.current.quaternion, targetQuaternion, delta * 20)
        }

        // Handle input
        if (document.pointerLockElement)
        {
            inputVelocity.set(0, 0, 0)

            if (keyboard['KeyW'])
            {
                activeAction = 1
                inputVelocity.z = -1
            }
            if (keyboard['KeyS'])
            {
                activeAction = 1
                inputVelocity.z = 1
            }
            if (keyboard['KeyA'])
            {
                activeAction = 1
                inputVelocity.x = -1
            }
            if (keyboard['KeyD'])
            {
                activeAction = 1
                inputVelocity.x = 1
            }

            // Adjust movement speed
            inputVelocity.setLength(delta * 15) // Reduced speed for better control

            // Animation handling
            if (activeAction !== prevActiveAction.current)
            {
                if (prevActiveAction.current !== 1 && activeAction === 1)
                {
                    actions['idle'].fadeOut(0.1)
                    actions['walk'].reset().fadeIn(0.1).play()
                }
                if (prevActiveAction.current !== 0 && activeAction === 0)
                {
                    actions['walk'].fadeOut(0.1)
                    actions['idle'].reset().fadeIn(0.1).play()
                }
                prevActiveAction.current = activeAction
            }

            // Jump handling with ground check
            if ((keyboard[' '] || keyboard['space'] || keyboard['Space']) && playerGround.current)
            {
                isJumpAction.current = true
                actions['walk'].fadeOut(0.1)
                actions['idle'].fadeOut(0.1)
                actions['jump'].reset().fadeIn(0.1).play()

                rigidBody.applyImpulse({ x: 0, y: 4, z: 0 }, true) // Reduced jump force
            }

            // Apply movement direction
            euler.y = yaw.rotation.y
            quaternion.setFromEuler(euler)
            inputVelocity.applyQuaternion(quaternion)

            // Apply movement with ground friction
            if (playerGround.current)
            {
                rigidBody.applyImpulse(
                    {
                        x: inputVelocity.x * 0.8,
                        y: inputVelocity.y,
                        z: inputVelocity.z * 0.8
                    },
                    true
                )

                // Ground friction
                const currentVel = rigidBody.linvel()
                rigidBody.setLinvel(
                    {
                        x: currentVel.x * 0.95,
                        y: currentVel.y,
                        z: currentVel.z * 0.95
                    },
                    true
                )
            } else
            {
                // Air control
                rigidBody.applyImpulse(
                    {
                        x: inputVelocity.x * 0.2,
                        y: 0,
                        z: inputVelocity.z * 0.2
                    },
                    true
                )
            }
        }

        // Update animations
        if (activeAction === 1)
        {
            mixer.update(distance / 3)
        } else
        {
            mixer.update(delta)
        }

        groupRef.current.position.lerp(worldPosition, 0.3)
    })

    return (
        <group position={position} ref={groupRef}>
            <RigidBody
                ref={rigidBodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={position}
                enabledRotations={[false, false, false]}
                lockRotations={true}
                friction={0.2}
                restitution={0}
                gravityScale={1}
                onCollisionEnter={() =>
                {
                    if (isJumpAction.current)
                    {
                        isJumpAction.current = false
                        actions['jump'].fadeOut(0.1)
                        actions['idle'].reset().fadeIn(0.1).play()
                    }
                }}
            >
                <CapsuleCollider
                    args={[0.4, 0.4]} // Increased size
                    position={[0, 0.8, 0]} // Raised position
                    friction={1}
                />
                <Suspense fallback={null}>
                    <Character />
                </Suspense>
            </RigidBody>
        </group>
    )
}