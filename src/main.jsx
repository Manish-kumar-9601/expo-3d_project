import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { KeyboardControls } from '@react-three/drei'
// const keyMap = [
//   { name: 'forward', keys: ['ArrowUp', 'KeyW', 'w', "W"] },
//   { name: 'back', keys: ['ArrowDown', 'KeyS'] },
//   { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
//   { name: 'right', keys: ['ArrowRight', 'KeyD'] },
//   { name: 'jump', keys: ['Space', ' '] },
//   { name: 'crouch', keys: ['KeyC'] },
//   { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
//   { name: 'attack', keys: ['KeyE'] }
// ]
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <KeyboardControls map={keyMap}> */}
      <App />
    {/* </KeyboardControls> */}
  </StrictMode>,
)
