import * as THREE from 'three'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { configs } from '../enums/configs'

const useGame = create(subscribeWithSelector((set) => ({
    direction: configs.direction,
    setDirection: (direction) => set({ direction }),

    speed: configs.normalSpeed,
    setSpeed: (speed) => set({ speed }),

    cameraPosition: configs.camera.normalPosition,
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),

    isFoodEdible: true,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),

    isBoosterUsable: false,
    setIsBoosterUsable: (isBoosterUsable) => set({ isBoosterUsable }),

    isBoosterInUse: false,
    setIsBoosterInUse: (isBoosterInUse) => set({ isBoosterInUse }),

    isBoozeUsable: false,
    setIsBoozeUsable: (isBoozeUsable) => set({ isBoozeUsable }),

    isBoozeInUse: false,
    setIsBoozeInUse: (isBoozeInUse) => set({ isBoozeInUse }),

    tails: [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 2)],
    setTails: (tail) => set((state) => ({ tails: [...state.tails, tail] })),

    isDebug: window.location.hash === '#debug',
    setIsDebug: (isDebug) => set(() => ({ isDebug })),

    phase: 'playing', // ready, playing, pause. ended
    pause: () => set((state) => {
        if (state.phase === 'playing') {
            return { phase: 'pause' }
        }

        return {}
    }),
    resume: () => set((state) => {
        if (state.phase === 'pause') {
            return { phase: 'playing' }
        }

        return {}
    }),
})))

export default useGame
