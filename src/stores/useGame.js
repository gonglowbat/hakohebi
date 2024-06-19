import * as THREE from 'three'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGame = create(subscribeWithSelector((set) => ({
    direction: 'up',
    setDirection: (direction) => set({ direction }),

    isFoodEdible: true,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),

    tails: [[0, -1, 0.01], [0, -2, 0.01]],
    setTails: (tail) => set((state) => ({ tails: [...state.tails, tail] }))
})))

export default useGame
