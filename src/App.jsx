import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { Loader } from "./components/Loader";
import { Physics } from "@react-three/cannon";
import { Environment, KeyboardControls, Stats } from "@react-three/drei";
import { Game } from "./components/Game";

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [pointerLockActivatedAt, setPointerLockActivatedAt] = useState(null);

  const activatePointerLock = useCallback(() => {
    const now = performance.now();
    if (pointerLockActivatedAt && now - pointerLockActivatedAt < 1000) {
      console.log('Please wait before trying to lock the pointer again.');
      return;
    }

    setIsEntered(true);
    setPointerLockActivatedAt(now);
    document.body.requestPointerLock();
  }, [pointerLockActivatedAt]);

  useEffect(() => {
    const handlePointerLockError = (event) => {
      console.error('Pointer lock error:', event);
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null) {
        console.log('Pointer lock was exited.');
        setIsEntered(false);
      }
    };

    document.addEventListener('pointerlockerror', handlePointerLockError);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  const canvasProps = useMemo(() => ({
    shadows: true,
    onPointerDown: (e) => e.target.requestPointerLock(),
    frameloop: "demand"
  }), []);

  const spotLightProps = useMemo(() => ({
    angle: Math.PI / 3,
    penumbra: 0.5,
    castShadow: true,
    "shadow-mapSize-height": 2048,
    "shadow-mapSize-width": 2048,
    intensity: Math.PI * 50
  }), []);

  const instructionsClass = useMemo(() => 
    `transition top-0 bottom-0 right-0 left-0 text flex flex-col items-center justify-center align-baseline my-10 p-5 m-auto text-balance z-10 ${!isEntered ? '' : 'hidden'}`,
    [isEntered]
  );

  return (
    <>
      <section id="instructions" className={instructionsClass}>
        <div className="w-full h-56" />
        <div className="mt-6 flex flex-col justify-center items-center bg-black/30 p-10 rounded-lg shadow-md">
          <p>W A S D to move</p>
          <p>SPACE to jump. C to crouch and Shift + W to run</p>
          <button 
            className="bg-white text-black text-center w-40 my-3"
            onClick={activatePointerLock}
          >
            start
          </button>
        </div>
      </section>

      <Canvas {...canvasProps}>
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