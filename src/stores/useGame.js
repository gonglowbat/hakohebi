import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { configs } from '../enums/configs'
import { phase } from '../enums/phase'

// const useGame = create(subscribeWithSelector((set) => ({
const useGame = create(devtools(subscribeWithSelector((set) => ({
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

    tails: configs.defaultTails,
    setTails: (tail) => set((state) => ({ tails: [...state.tails, tail] })),
    resetTails: () => set(() => ({ tails: configs.defaultTails })),

    isDebug: window.location.hash === '#debug',
    setIsDebug: (isDebug) => set(() => ({ isDebug })),

    phase: phase.ready,
    start: () => set((state) => {
        if (state.phase === phase.ready || state.phase === phase.restarting) {
            return { phase: phase.playing }
        }

        return {}
    }),
    restart: () => set((state) => {
        if (state.phase === phase.ended) {
            return { phase: phase.restarting }
        }

        return {}
    }),
    pause: () => set((state) => {
        if (state.phase === phase.playing) {
            return { phase: phase.pause }
        }

        return {}
    }),
    resume: () => set((state) => {
        if (state.phase === phase.pause) {
            return { phase: phase.playing }
        }

        return {}
    }),
    end: () => set((state) => {
        if (state.phase === phase.playing) {
            return { phase: phase.ended }
        }

        return {}
    }),
}))))
// })))

export default useGame
