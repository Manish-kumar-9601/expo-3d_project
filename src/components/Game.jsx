import { Debug, Physics } from '@react-three/cannon'
import {Map2} from './Map2';
import {Player} from './Player'
import { Map1 } from './Map1';
import { Physics as RapierPhysics } from '@react-three/rapier';

export const Game = () =>
{
    return (
        <RapierPhysics debug >
                <Map1 />
                <Player   />
            </RapierPhysics>
    )
}