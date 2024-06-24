import { useFrame } from '@react-three/fiber'
import { Environment, GizmoHelper, GizmoViewport, Grid, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { configs } from '../enums/configs'
import Snake from './Snake'
import Food from './Food'
import useGame from '../stores/useGame'
import Booster from './booster'

const Scene = () => {
    const snake = useRef()
    const food = useRef()
    const booster = useRef()

    const size = useMemo(() => ({ width: configs.width, height: configs.height }), [])

    const setSpeed = useGame((state) => state.setSpeed)

    const isFoodEdible = useGame((state) => state.isFoodEdible)
    const setIsFoodEdible = useGame((state) => state.setIsFoodEdible)

    const isBoosterUsable = useGame((state) => state.isBoosterUsable)
    const setIsBoosterUsable = useGame((state) => state.setIsBoosterUsable)

    const isBoosterInUse = useGame((state) => state.isBoosterInUse)
    const setIsBoosterInUse = useGame((state) => state.setIsBoosterInUse)

    const setTails = useGame((state) => state.setTails)
    const tails = useGame((state) => state.tails)

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
            food.current.position.y = 20
            randomItems()

            return
        }

        const isSamePositionAsBoosterX = Math.floor(snake.current.children[0].position.x) === Math.floor(booster.current.position.x)
        const isSamePositionAsBoosterZ = Math.floor(snake.current.children[0].position.z) === Math.floor(booster.current.position.z)

        if (isSamePositionAsBoosterX && isSamePositionAsBoosterZ && isBoosterUsable) {
            setSpeed(20)

            setIsBoosterUsable(false)
            setIsBoosterInUse(true)
            booster.current.position.y = 20
            randomItems()

            const boosterTimeout = setTimeout(() => {
                setIsBoosterInUse(false)
                setSpeed(10)
                clearTimeout(boosterTimeout)
            }, 3000)

            return
        }
    })

    const randomItems = () => {
        if (isBoosterInUse) {
            return randomFoodPosition()
        }

        if (Math.random() >= 0.3) {
            randomFoodPosition()
        } else {
            randomBoosterPosition()
        }
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

            <Snake ref={snake} edge={size} />
            <Food ref={food} position={[0, 100, 100]} />
            <Booster ref={booster} position={[0, 100, 100]} />
        </>
    )
}

export default Scene
