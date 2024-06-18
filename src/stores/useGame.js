import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGame = create(subscribeWithSelector((set) => ({
    direction: 'up',
    setDirection: (direction) => set({ direction }),

    snakeTailLength: 2,
    increaseSnakeTailLength: () => set((state) => ({ snakeTailLength: state.snakeTailLength + 1 })),

    isFoodEdible: true,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),
})))

export default useGame
