import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGame = create(subscribeWithSelector((set) => ({
    // current: 0,
    // setCurrent: (selection) => set({ current: selection }),

    direction: [],
    setDirection: (direction) => set({ direction }),
})))

export default useGame
