import { Debug } from '@react-three/cannon'
import { useControls } from 'leva'
import { Player } from './Player'
import { Html } from '@react-three/drei'
import { Map1 } from './Map1'
import { Map2 } from './Map2'


// function ToggleDebug ({ children })
// {
//     const debugRendererVisible = useControls('Debug Renderer', { visible: false })

//     return <>{debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}</>
// }

export const Game = ({ mapCh, setMapCh }) =>
{
    return (
        <>

            <Html>
                <button className=' ' onClick={() => setMapCh((prev) => !prev)}>Change Map </button>
            </Html>
            {mapCh ? <Map1 /> : <Map2 />}
            <Player position={[0, 1, 0]} />

        </>
    )
}