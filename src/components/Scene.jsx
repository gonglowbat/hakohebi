import { useFrame, useThree } from '@react-three/fiber'
import { Environment, GizmoHelper, GizmoViewport, Grid, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { configs } from '../enums/configs'
import Snake from './Snake'
import Food from './Food'
import Booster from './Booster'
import Booze from './Booze'
import useGame from '../stores/useGame'

const Scene = () => {
    const snake = useRef()
    const food = useRef()
    const booster = useRef()
    const booze = useRef()

    const size = useMemo(() => ({ width: configs.width, height: configs.height }), [])

    const setSpeed = useGame((state) => state.setSpeed)
    const setCameraPosition = useGame((state) => state.setCameraPosition)

    const isFoodEdible = useGame((state) => state.isFoodEdible)
    const setIsFoodEdible = useGame((state) => state.setIsFoodEdible)

    const isBoosterUsable = useGame((state) => state.isBoosterUsable)
    const setIsBoosterUsable = useGame((state) => state.setIsBoosterUsable)
    const isBoosterInUse = useGame((state) => state.isBoosterInUse)
    const setIsBoosterInUse = useGame((state) => state.setIsBoosterInUse)

    const isBoozeUsable = useGame((state) => state.isBoozeUsable)
    const setIsBoozeUsable = useGame((state) => state.setIsBoozeUsable)
    const isBoozeInUse = useGame((state) => state.isBoozeInUse)
    const setIsBoozeInUse = useGame((state) => state.setIsBoozeInUse)

    const setTails = useGame((state) => state.setTails)
    const tails = useGame((state) => state.tails)

    const { camera } = useThree()

    useEffect(() => {
        randomItems()
    }, [])

    useFrame((state) => {
        const isSamePositionAsFoodX = Math.floor(snake.current.children[0].position.x) === Math.floor(food.current.position.x)
        const isSamePositionAsFoodZ = Math.floor(snake.current.children[0].position.z) === Math.floor(food.current.position.z)

        if (isSamePositionAsFoodX && isSamePositionAsFoodZ && isFoodEdible) {
            const lastTailPosition = tails[tails.length - 1]
            setTails(lastTailPosition.clone())

            setIsFoodEdible(false)
            food.current.position.set(100, 100, 100)
            randomItems()

            return
        }

        const isSamePositionAsBoosterX = Math.floor(snake.current.children[0].position.x) === Math.floor(booster.current.position.x)
        const isSamePositionAsBoosterZ = Math.floor(snake.current.children[0].position.z) === Math.floor(booster.current.position.z)

        if (isSamePositionAsBoosterX && isSamePositionAsBoosterZ && isBoosterUsable) {
            setSpeed(configs.superSpeed)

            setIsBoosterUsable(false)
            setIsBoosterInUse(true)
            booster.current.position.set(100, 100, 100)
            randomItems()

            const boosterTimeout = setTimeout(() => {
                setIsBoosterInUse(false)
                setSpeed(configs.normalSpeed)
                clearTimeout(boosterTimeout)
            }, 3000)

            return
        }

        const isSamePositionAsBoozeX = Math.floor(snake.current.children[0].position.x) === Math.floor(booze.current.position.x)
        const isSamePositionAsBoozeZ = Math.floor(snake.current.children[0].position.z) === Math.floor(booze.current.position.z)

        if (isSamePositionAsBoozeX && isSamePositionAsBoozeZ && isBoozeUsable) {
            setCameraPosition(configs.camera.invertPosition)
            camera.position.set(...configs.camera.invertPosition)

            setIsBoozeUsable(false)
            setIsBoozeInUse(true)
            booze.current.position.set(100, 100, 100)
            randomItems()

            const boozeTimeout = setTimeout(() => {
                setIsBoozeInUse(false)
                setCameraPosition(configs.camera.normalPosition)
                camera.position.set(...configs.camera.normalPosition)
                clearTimeout(boozeTimeout)
            }, 3000)

            return
        }
    })

    const randomItems = () => {
        if (isBoosterInUse) {
            if (Math.random() >= 0.1) {
                return randomFoodPosition()
            } else {
                return randomBoozePosition()
            }
        }

        if (isBoozeInUse) {
            if (Math.random() >= 0.3) {
                return randomFoodPosition()
            } else {
                return randomBoosterPosition()
            }
        }

        const random = Math.random()

        if (random <= 0.1) {
            return randomBoozePosition()
        }

        if (random <= 0.7) {
            return randomFoodPosition()
        }

        return randomBoosterPosition()
    }

    const randomFoodPosition = () => {
        const x = Math.floor(Math.random() * size.width / 2)
        const z = Math.floor(Math.random() * size.height / 2)

        food.current.position.set(x, 0, z)
        setIsFoodEdible(true)
    }

    const randomBoosterPosition = () => {
        const x = Math.floor(Math.random() * size.width / 2)
        const z = Math.floor(Math.random() * size.height / 2)

        booster.current.position.set(x, 0, z)
        setIsBoosterUsable(true)
    }

    const randomBoozePosition = () => {
        const x = Math.floor(Math.random() * size.width / 2)
        const z = Math.floor(Math.random() * size.height / 2)

        booze.current.position.set(x, 0, z)
        setIsBoozeUsable(true)
    }

    const { gridSize, ...gridConfig } = useControls({
        gridSize: [configs.width, configs.height],
        cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
        cellThickness: { value: 0.6, min: 0, max: 5, step: 0.1 },
        cellColor: '#6f6f6f',
        sectionSize: { value: 4, min: 0, max: 10, step: 0.1 },
        sectionThickness: { value: 1, min: 0, max: 5, step: 0.1 },
        sectionColor: '#9d4b4b',
        fadeDistance: { value: 100, min: 0, max: 100, step: 1 },
        fadeStrength: { value: 0, min: 0, max: 1, step: 0.1 },
        followCamera: false,
        infiniteGrid: false,
    })

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <Environment preset="city" />

            <GizmoHelper>
                <GizmoViewport labelColor="white" />
            </GizmoHelper>

            <Grid position={[-0.5, -0.51, -0.5]} args={gridSize} {...gridConfig} />
            <Grid position={[-0.5, -0.51, -0.5]} rotation-z={Math.PI} args={gridSize} {...gridConfig} />

            <Snake ref={snake} edge={size} />
            <Food ref={food} position={[100, 100, 100]} />
            <Booster ref={booster} position={[100, 100, 100]} />
            <Booze ref={booze} position={[100, 100, 100]} />
        </>
    )
}

export default Scene
