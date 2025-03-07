import { useFrame, useThree } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as array from '../utils/array'
import { config } from '../config'
import Snake from './Snake'
import Food from './Food'
import Booster from './Booster'
import Booze from './Booze'
import Level from './Level'
import useStore from '../stores/useStore'
import { phase as phaseEnum } from '../enums/phase'

const Scene = () => {
    const snakeRef = useRef()
    const foodRef = useRef()
    const boosterRef = useRef()
    const boozeRef = useRef()

    const setSpeed = useStore((state) => state.setSpeed)
    const setCameraPosition = useStore((state) => state.setCameraPosition)

    const isFoodEdible = useStore((state) => state.isFoodEdible)
    const setIsFoodEdible = useStore((state) => state.setIsFoodEdible)

    const isBoosterUsable = useStore((state) => state.isBoosterUsable)
    const setIsBoosterUsable = useStore((state) => state.setIsBoosterUsable)

    const isBoosterInUse = useStore((state) => state.isBoosterInUse)
    const setIsBoosterInUse = useStore((state) => state.setIsBoosterInUse)

    const boosterTimer = useStore((state) => state.boosterTimer)
    const setBoosterTimer = useStore((state) => state.setBoosterTimer)

    const isBoozeUsable = useStore((state) => state.isBoozeUsable)
    const setIsBoozeUsable = useStore((state) => state.setIsBoozeUsable)

    const isBoozeInUse = useStore((state) => state.isBoozeInUse)
    const setIsBoozeInUse = useStore((state) => state.setIsBoozeInUse)

    const boozeTimer = useStore((state) => state.boozeTimer)
    const setBoozeTimer = useStore((state) => state.setBoozeTimer)

    const setTails = useStore((state) => state.setTails)
    const tails = useStore((state) => state.tails)

    const isDebug = useStore((state) => state.isDebug)

    const phase = useStore((state) => state.phase)

    const { camera } = useThree()

    useEffect(() => {
        randomItems()
    }, [])

    useEffect(() => {
        const unsubscribeRestart = useStore.subscribe((
            state) => state.phase,
            (value) => {
                if (value === phaseEnum.RESTARTING) {
                    foodRef.current.position.set(100, 100, 100)
                    boosterRef.current.position.set(100, 100, 100)
                    boozeRef.current.position.set(100, 100, 100)
                    randomItems()
                }
            }
        )

        return () =>  {
            unsubscribeRestart()
        }
    })

    useEffect(() => {
        if (boosterTimer <= 0) {
            setIsBoosterInUse(false)
            setSpeed(config.normalSpeed)
        }

        if (boozeTimer <= 0) {
            setIsBoozeInUse(false)
            setCameraPosition(config.camera.normalPosition)
            camera.position.set(...config.camera.normalPosition)
            camera.lookAt(0, 0, 0)
        }
    }, [boosterTimer, boozeTimer])

    useFrame((state, delta) => {
        if (phase !== phaseEnum.PLAYING) {
            return
        }

        if (isBoosterInUse && boosterTimer > 0) {
            setBoosterTimer(Math.max(boosterTimer - delta, 0))
        }

        if (isBoozeInUse && boozeTimer > 0) {
            setBoozeTimer(Math.max(boozeTimer - delta, 0))
        }

        const isSamePositionAsFoodX = Math.floor(snakeRef.current.children[0].position.x) === Math.floor(foodRef.current.position.x)
        const isSamePositionAsFoodZ = Math.floor(snakeRef.current.children[0].position.z) === Math.floor(foodRef.current.position.z)

        if (isSamePositionAsFoodX && isSamePositionAsFoodZ && isFoodEdible) {
            const lastTailPosition = tails[tails.length - 1]
            setTails(lastTailPosition.clone())

            setIsFoodEdible(false)
            foodRef.current.position.set(100, 100, 100)
            randomItems()

            return
        }

        const isSamePositionAsBoosterX = Math.floor(snakeRef.current.children[0].position.x) === Math.floor(boosterRef.current.position.x)
        const isSamePositionAsBoosterZ = Math.floor(snakeRef.current.children[0].position.z) === Math.floor(boosterRef.current.position.z)

        if (isSamePositionAsBoosterX && isSamePositionAsBoosterZ && isBoosterUsable) {
            setSpeed(config.superSpeed)
            setIsBoosterUsable(false)
            setIsBoosterInUse(true)
            setBoosterTimer(boosterTimer + 3)
            boosterRef.current.position.set(100, 100, 100)
            randomItems()

            return
        }

        const isSamePositionAsBoozeX = Math.floor(snakeRef.current.children[0].position.x) === Math.floor(boozeRef.current.position.x)
        const isSamePositionAsBoozeZ = Math.floor(snakeRef.current.children[0].position.z) === Math.floor(boozeRef.current.position.z)

        if (isSamePositionAsBoozeX && isSamePositionAsBoozeZ && isBoozeUsable) {
            setCameraPosition(config.camera.invertPosition)
            camera.position.set(...config.camera.invertPosition)
            camera.lookAt(0, 0, 0)

            setIsBoozeUsable(false)
            setIsBoozeInUse(true)
            setBoozeTimer(boozeTimer + 3)
            boozeRef.current.position.set(100, 100, 100)
            randomItems()

            return
        }
    })

    const randomItems = () => {
        const random = Math.random()

        const occupiedPositions = snakeRef.current.children.map((child) => child.position)
        const availablePositionsX = array.unique(occupiedPositions.map((position) => position.x), config.gridRange.x)
        const availablePositionsZ = array.unique(occupiedPositions.map((position) => position.z), config.gridRange.z)
        const randomX = array.random(availablePositionsX)
        const randomZ = array.random(availablePositionsZ)

        if (random <= 0.1) {
            return randomBoozePosition(randomX, randomZ)
        }

        if (random <= 0.7) {
            return randomFoodPosition(randomX, randomZ)
        }

        return randomBoosterPosition(randomX, randomZ)
    }

    const randomFoodPosition = (x, z) => {
        foodRef.current.position.set(x, 0, z)
        setIsFoodEdible(true)
    }

    const randomBoosterPosition = (x, z) => {
        boosterRef.current.position.set(x, 0, z)
        setIsBoosterUsable(true)
    }

    const randomBoozePosition = (x, z) => {
        boozeRef.current.position.set(x, 0, z)
        setIsBoozeUsable(true)
    }

    return (
        <>
            {isDebug && (
                <>
                    <Perf position="top-left" />
                    <OrbitControls makeDefault />
                    <axesHelper args={[10]} />

                    <GizmoHelper>
                        <GizmoViewport />
                    </GizmoHelper>
                </>
            )}

            <Level />

            <Snake ref={snakeRef} />
            <Food ref={foodRef} position={[100, 100, 100]} />
            <Booster ref={boosterRef} position={[100, 100, 100]} />
            <Booze ref={boozeRef} position={[100, 100, 100]} />
        </>
    )
}

export default Scene
