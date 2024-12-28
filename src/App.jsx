
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import { Loader } from "./components/Loader";
import { Physics } from "@react-three/cannon";
import { Environment, KeyboardControls, Stats } from "@react-three/drei";
import { Game } from "./components/Game";



export default function App ()
{
  const [isEntered, SetIsEntered] = useState(false)

  if(isEntered){

  
  document.addEventListener('click', function ()
  {
    const element = document.getElementById('instructions');
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  });
}

  return (

    <>
      <section id="instructions" className={`transition top-0 bottom-0 right-0 left-0 text flex items-center justify-center align-baseline   p-5 m-auto text-balance z-10  ${isEntered ? 'hidden' : ''}`} >

        <div className="flex flex-col justify-center items-center bg-black/30 p-10 rounded-lg shadow-md  ">

          W A S D to move
          <br />
          SPACE to jump. C to crouch and Shift + W to run
          <br />

          <button className='bg-white text-black text-center w-40 my-3 ' onClick={() => SetIsEntered(true)} >start</button>
        </div>
      </section>

      <Canvas shadows onPointerDown={(e) => e.target.requestPointerLock()} >
        <Environment background={true} preset='forest' />
        <Suspense fallback={<Loader />}>

          <spotLight position={[2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
          <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
          <ambientLight intensity={.5} />
          <Game />

          <Stats />
        </Suspense>

      </Canvas>


    </>
  )
}
