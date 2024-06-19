import * as THREE from 'three'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGame = create(subscribeWithSelector((set) => ({
    direction: 'up',
    setDirection: (direction) => set({ direction }),

    snakeTailLength: 2,
    increaseSnakeTailLength: () => set((state) => ({ snakeTailLength: state.snakeTailLength + 1 })),

    isFoodEdible: true,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),

    accquiredPosition: [
        { part: 'head', position: new THREE.Vector3(0, 0, 0.01) },
        { part: 'tail', position: new THREE.Vector3(0, -1, 0.01) },
        { part: 'tail', position: new THREE.Vector3(0, -2, 0.01) },
    ],
    setAccquiredPosition: (position) => set({ accquiredPosition: position }),
})))

export default useGame
