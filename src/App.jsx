 
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Loader } from "./components/Loader";
import { Physics } from "@react-three/cannon";
import { Stats } from "@react-three/drei";
import { Game } from "./components/Game";

export default function App ()

{
  document.addEventListener('click', function() {
    var element = document.getElementById('instructions');
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
});

  return (
    
    <>
      <div id="instructions">
        W A S D to move
        <br />
        SPACE to jump.
        <br />
      </div>
    <Canvas shadows onPointerDown={(e)=>e.target.requestPointerLock()} >

       <Suspense  fallback={<Loader />}>

       <spotLight position={[2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
       <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
    <Physics>
    <Game />
    </Physics>
    <Stats/>
       </Suspense>

    </Canvas>

    </>
  )
}
