import { Debug, Physics } from '@react-three/cannon'
import {Map2} from './Map2';
import {Player} from './Player'
import { Map1 } from './Map1';
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
                <Map1 />
                <Player position={[0, 3, 0]} />
            </Debug>
        </Physics>
    )
}