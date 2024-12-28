import React, { Suspense, useMemo, useRef } from 'react'
import { Character } from './Character'
import { useFollowCam } from './useFollowCam'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useStore } from '../Store'
import useKeyboard from '../useKeyboard'

function rotateTowards(currentQuaternion, targetQuaternion, step) {
    currentQuaternion.slerp(targetQuaternion, step)
}

export const Player = ({ position }) => {
    const groupRef = useRef()
    const rigidBodyRef = useRef()
    const playerGround = useRef()
    const isJumpAction = useRef(false)
    const { yaw } = useFollowCam(groupRef, [0, .8, 1.2])
    
    // Memoized vectors and matrices
    const velocity = useMemo(() => new Vector3(), [])
    const inputVelocity = useMemo(() => new Vector3(), [])
    const euler = useMemo(() => new Euler(), [])
    const quaternion = useMemo(() => new Quaternion(), [])
    const targetQuaternion = useMemo(() => new Quaternion(), [])
    const worldPosition = useMemo(() => new Vector3(), [])
    const rayCasterOffset = useMemo(() => new Vector3(), [])
    const rotationMatrix = useMemo(() => new Matrix4(), [])

    const prevActiveAction = useRef(0) // 0:idle, 1:run, 2:walk, 3:jump
    const { groundObject, actions, mixer } = useStore((state) => state)
    const keyboard = useKeyboard()

    useFrame(({ raycaster }, delta) => {
        if (!rigidBodyRef.current) return

        let activeAction = 0
        const rigidBody = rigidBodyRef.current

        // Lock rotation to vertical axis only
        rigidBody.setEnabledRotations(false, false, false)

        // Get current position
        const currentPosition = rigidBody.translation()
        worldPosition.set(currentPosition.x, currentPosition.y, currentPosition.z)

        // Ground check using raycaster
        playerGround.current = false
        rayCasterOffset.copy(worldPosition)
        rayCasterOffset.y += 0.1
        raycaster.set(rayCasterOffset, new Vector3(0, -1, 0))
        raycaster.intersectObjects(Object.values(groundObject), false).forEach(i => {
            if (i.distance <= 0.021) {
                playerGround.current = true
            }
        })

        // Character rotation
        const distance = worldPosition.distanceTo(groupRef.current.position)
        rotationMatrix.lookAt(worldPosition, groupRef.current.position, groupRef.current.up)
        targetQuaternion.setFromRotationMatrix(rotationMatrix)
        
        if (distance > 0.0001 && !groupRef.current.quaternion.equals(targetQuaternion)) {
            targetQuaternion.z = 0
            targetQuaternion.x = 0
            targetQuaternion.normalize()
            rotateTowards(groupRef.current.quaternion, targetQuaternion, delta * 20)
        }

        // Handle input
        if (document.pointerLockElement) {
            inputVelocity.set(0, 0, 0)

            if (keyboard['KeyW']) {
                activeAction = 1
                inputVelocity.z = -1
            }
            if (keyboard['KeyS']) {
                activeAction = 1
                inputVelocity.z = 1
            }
            if (keyboard['KeyA']) {
                activeAction = 1
                inputVelocity.x = -1
            }
            if (keyboard['KeyD']) {
                activeAction = 1
                inputVelocity.x = 1
            }

            inputVelocity.setLength(delta * 20)

            // Handle animations
            if (activeAction !== prevActiveAction.current) {
                if (prevActiveAction.current !== 1 && activeAction === 1) {
                    actions['idle'].fadeOut(0.1)
                    actions['walk'].reset().fadeIn(0.1).play()
                }
                if (prevActiveAction.current !== 0 && activeAction === 0) {
                    actions['walk'].fadeOut(0.1)
                    actions['idle'].reset().fadeIn(0.1).play()
                }
                prevActiveAction.current = activeAction
            }

            // Handle jumping
            if (keyboard[' '] || keyboard['space'] || keyboard['Space']) {
                if (playerGround.current) {
                    isJumpAction.current = true
                    actions['walk'].fadeOut(0.1)
                    actions['idle'].fadeOut(0.1)
                    actions['jump'].reset().fadeIn(0.1).play()
                    
                    // Apply jump impulse
                    rigidBody.applyImpulse({ x: 0, y: 2, z: 0 }, true)
                }
            }

            // Apply movement
            euler.y = yaw.rotation.y
            quaternion.setFromEuler(euler)
            inputVelocity.applyQuaternion(quaternion)
            
            // Apply movement impulse
            rigidBody.applyImpulse(
                { x: inputVelocity.x, y: inputVelocity.y, z: inputVelocity.z },
                true
            )

            // Apply damping when on ground
            if (playerGround.current) {
                const currentVel = rigidBody.linvel()
                rigidBody.setLinvel(
                    { x: currentVel.x * 0.2, y: currentVel.y, z: currentVel.z * 0.2 },
                    true
                )
            }
        }

        // Update animations
        if (activeAction === 1) {
            mixer.update(distance / 3)
        } else {
            mixer.update(delta)
        }

        groupRef.current.position.lerp(worldPosition, 0.3)
    })

    return (
        <RigidBody
                ref={rigidBodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={position}
                enabledRotations={[false, false, false]}
                onCollisionEnter={() => {
                    if (isJumpAction.current) {
                        isJumpAction.current = false
                        actions['jump'].fadeOut(0.1)
                        actions['idle'].reset().fadeIn(0.1).play()
                    }
                }}
            >
        <group position={position} ref={groupRef}>
                <CapsuleCollider args={[0.3, 0.3]} position={[0, 0.6, 0]} />
                <group  >

                <Suspense fallback={null}>
                    <Character />
                </Suspense>
                </group>
        </group>
            </RigidBody>
    )
}