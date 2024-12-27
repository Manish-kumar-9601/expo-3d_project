import React, { Suspense, useRef } from 'react'
import { Character } from './Character'


export const Player = () =>
{
    const groupRef = useRef();

    return (
        <group ref={groupRef} >
         <Suspense  fallback={null}>
        <Character />
        </Suspense>
        </group>
    )
}
