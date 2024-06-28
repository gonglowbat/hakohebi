import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { config } from '../config'
import { phase } from '../enums/phase'

const useStore = create(devtools(subscribeWithSelector((set) => ({
    direction: config.direction,
    setDirection: (direction) => set({ direction }),

    currentDirection: config.direction,
    setCurrentDirection: (currentDirection) => set({ currentDirection }),

    speed: config.normalSpeed,
    setSpeed: (speed) => set({ speed }),

    cameraPosition: config.camera.normalPosition,
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),

    isFoodEdible: false,
    setIsFoodEdible: (isFoodEdible) => set({ isFoodEdible }),

    isBoosterUsable: false,
    setIsBoosterUsable: (isBoosterUsable) => set({ isBoosterUsable }),

    isBoosterInUse: false,
    setIsBoosterInUse: (isBoosterInUse) => set({ isBoosterInUse }),

    boosterTimer: 0,
    setBoosterTimer: (boosterTimer) => set({ boosterTimer }),

    isBoozeUsable: false,
    setIsBoozeUsable: (isBoozeUsable) => set({ isBoozeUsable }),

    isBoozeInUse: false,
    setIsBoozeInUse: (isBoozeInUse) => set({ isBoozeInUse }),

    boozeTimer: 0,
    setBoozeTimer: (boozeTimer) => set({ boozeTimer }),

    tails: config.defaultTails,
    setTails: (tail) => set((state) => ({ tails: [...state.tails, tail] })),
    resetTails: () => set(() => ({ tails: config.defaultTails })),

    isDebug: window.location.hash === '#debug',
    setIsDebug: (isDebug) => set(() => ({ isDebug })),

    phase: phase.READY,
    start: () => set((state) => {
        if (state.phase === phase.READY || state.phase === phase.RESTARTING) {
            return { phase: phase.PLAYING }
        }

        return {}
    }),
    restart: () => set((state) => {
        if (state.phase === phase.ENDED) {
            return { phase: phase.RESTARTING }
        }

        return {}
    }),
    pause: () => set((state) => {
        if (state.phase === phase.PLAYING) {
            return { phase: phase.PAUSE }
        }

        return {}
    }),
    resume: () => set((state) => {
        if (state.phase === phase.PAUSE) {
            return { phase: phase.PLAYING }
        }

        return {}
    }),
    end: () => set((state) => {
        if (state.phase === phase.PLAYING) {
            return { phase: phase.ENDED }
        }

        return {}
    }),
}))))

export default useStore
