import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { Loader } from "./components/Loader";
import { Physics } from "@react-three/cannon";
import { Environment, KeyboardControls, Stats } from "@react-three/drei";
import { Game } from "./components/Game";

export default function App ()
{
  const [isEntered, setIsEntered] = useState(false);
 

  const canvasProps = useMemo(() => ({
    shadows: true,
    // frameloop: "demand"
  }), []);

  const startGame = () =>
  {
    const gameElement = document.getElementById('gameCanvas');
    console.log(gameElement);
    if (gameElement.requestPointerLock)
    {
      gameElement.requestPointerLock();
      setIsEntered(true)
    } else
    {
      console.error('Pointer Lock API is not supported by this browser.');
    }
  }
  setTimeout(() => {
    setIsEntered(true)
  }, 4000);
  document.addEventListener('click',(e)=>{
 
    e.target.requestPointerLock()
  })
  const spotLightProps = useMemo(() => ({
    angle: Math.PI / 3,
    penumbra: 0.5,
    castShadow: true,
    "shadow-mapSize-height": 2048,
    "shadow-mapSize-width": 2048,
    intensity: Math.PI * 50
  }), []);

  const instructionsClass = useMemo(() =>
   
    [isEntered]
  );

  return (
    <>
      <section id="instructions" className={ `transition top-0 bottom-0 right-0 left-0 text flex flex-col items-center justify-center align-baseline my-10 p-5 m-auto text-balance z-10 ${isEntered ? 'hidden' : ''}`}>
        <div className="w-full h-56" />
        <div className="mt-6 flex flex-col justify-center items-center bg-black/30 p-10 rounded-lg shadow-md">
          <p>W A S D to move</p>
          <p>SPACE to jump. C to crouch and Shift + W to run</p>
          <button
            className="bg-white text-black text-center w-40 my-3"
            
          >
            start
          </button>
        </div>
      </section>

      <Canvas {...canvasProps} id="gameCanvas"  shadows onPointerDown={(e) => e.target.requestPointerLock()} >
        <Environment background preset="forest" />
        <Suspense fallback={<Loader />}>
          <spotLight position={[2.5, 5, 5]} {...spotLightProps} />
          <spotLight position={[-2.5, 5, 5]} {...spotLightProps} />
          <ambientLight intensity={0.5} />
          <Game />
          <Stats />
        </Suspense>
      </Canvas>
    </>
  );
}