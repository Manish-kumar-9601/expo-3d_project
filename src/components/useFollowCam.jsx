import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo } from 'react'
import { Object3D, Vector3 } from 'three'

export const useFollowCam = (ref,offSet) =>
{
    const { scene, camera } = useThree()
    const pivot=useMemo(()=>new Object3D(),[])
    const alt=useMemo(()=>new Object3D(),[])
    const yaw=useMemo(()=>new Object3D(),[])
    const pitch=useMemo(()=>new Object3D(),[])
    const worldPosition=useMemo(()=>new Vector3(),[])
    function onDocumentMouseMove(event) {
        if(document.pointerLockElement){
            if(event){
                event.preventDefault();
            
            
            yaw.rotation.y -= event.movementX * 0.002;
            const v=pitch.rotation.x - event.movementY * 0.002;
            console.log( 'const v=pitch.rotation.x - event.movementY * 0.002; v=',v);
            if(v>-1 && v<0.1){
                pitch.rotation.x=v;
            }
        }
    }else{
        console.log('unideifned',event);
    }
    }
function onDocumentMouseWheel(event) {
    if(document.pointerLockElement){
        if(event){
            event.preventDefault();
            const v=camera.position.z - event.deltaY * 0.02;
            if(v>=0.5 && v<=5){
                camera.position.z=v;
            }
        }
       
    }
}

    useEffect(()=>{
        scene.add(pivot)
        pivot.add(alt)
        alt.position.y=offSet[1]
        alt.add(yaw)
        yaw.add(pitch)
        pitch.add(camera)
        camera.position.set(offSet[0],0,offSet[2])
        document.addEventListener('mousemove',onDocumentMouseMove())
        document.addEventListener('mousewheel',onDocumentMouseWheel(),{passive:false})
        return()=>{
            
            document.removeEventListener('mousemove',onDocumentMouseMove())
            document.removeEventListener('mousewheel',onDocumentMouseWheel())
        }
    },[camera])
    useFrame((state,delta)=>{
        ref.current.getWorldPosition(worldPosition)
        pivot.position.lerp(worldPosition,delta*3)
        // state.camera.lookAt(ref.current)
    })
    return {pivot,alt,yaw,pitch}
}
