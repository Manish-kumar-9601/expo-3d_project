import { Debug, Physics } from '@react-three/cannon'
import {Map2} from './Map2';
import {Player} from './Player'
export const Game = () =>
{
    return (
        <Physics
            // gravity={[0, -9.81, 0]}
            // defaultContactMaterial={{
            //     friction: 0.1,
            //     restitution: 0.1,
            //     contactEquationStiffness: 1e6,
            //     contactEquationRelaxation: 3,
            // }}
        >
            <Debug>
                <Map2 />
                <Player position={[0, 3, 0]} />
            </Debug>
        </Physics>
    )
}