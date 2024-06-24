import * as THREE from 'three'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGame = create(subscribeWithSelector((set) => ({
    direction: 'up',
    setDirection: (direction) => set({ direction }),

    speed: 10,
    setSpeed: (speed) => set({ speed }),

    isFoodEdible: true,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),

    isBooterUsable: false,
    setIsBoosterUsable: (isBoosterUsable) => set({ isBoosterUsable }),

    isBoosterInUse: false,
    setIsBoosterInUse: (isBoosterInUse) => set({ isBoosterInUse }),

    tails: [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 2)],
    setTails: (tail) => set((state) => ({ tails: [...state.tails, tail] }))
})))

export default useGame
