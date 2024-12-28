
import { create } from 'zustand';
import { AnimationMixer } from 'three';
import { useRef } from 'react';

export const useStore = create(() => ({
    // Define actions or methods to manipulate the state
    actions: {},
    // Create an instance of AnimationMixer for managing animations
    mixer: new AnimationMixer(),

    // Object to store information about the ground object
    groundObject: {},

    // Reference to a DOM element or 3D object

}));
