import { AnimationMixer } from "three";
import { create } from "zustand";

export const useStore=create(()=>(
    {
        actions:{},
        mixer:new AnimationMixer(),
        groundObject:{}
    }
))