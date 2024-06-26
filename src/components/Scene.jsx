import { useFrame, useThree } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as array from '../utils/array'
import { config } from '../config'
import Snake from './Snake'
import Food from './Food'
import Booster from './Booster'
import Booze from './Booze'
import Level from './Level'
import useGame from '../stores/useGame'

const Scene = () => {
    const snakeRef = useRef()
    const foodRef = useRef()
    const boosterRef = useRef()
    const boozeRef = useRef()

    const size = useMemo(() => ({ width: config.width, height: config.height }), [])

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

    const isDebug = useGame((state) => state.isDebug)

    const { camera } = useThree()

    useEffect(() => {
        randomItems()
    }, [])

    useFrame((state) => {
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
            boosterRef.current.position.set(100, 100, 100)
            randomItems()

            const boosterTimeout = setTimeout(() => {
                setIsBoosterInUse(false)
                setSpeed(config.normalSpeed)
                clearTimeout(boosterTimeout)
            }, 3000)

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
            boozeRef.current.position.set(100, 100, 100)
            randomItems()

            const boozeTimeout = setTimeout(() => {
                setIsBoozeInUse(false)
                setCameraPosition(config.camera.normalPosition)
                camera.position.set(...config.camera.normalPosition)
                camera.lookAt(0, 0, 0)
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

    const getAvailablePositions = (dimension) => {
        const occupiedPositions = snakeRef.current.children.map((child) => Math.floor(child.position[dimension]))

        return array.unique(occupiedPositions, config.gridRange[dimension])
    }

    const randomFoodPosition = () => {
        const x = array.random(getAvailablePositions('x'))
        const z = array.random(getAvailablePositions('z'))

        foodRef.current.position.set(x, 0, z)
        setIsFoodEdible(true)
    }

    const randomBoosterPosition = () => {
        const x = array.random(getAvailablePositions('x'))
        const z = array.random(getAvailablePositions('z'))

        boosterRef.current.position.set(x, 0, z)
        setIsBoosterUsable(true)
    }

    const randomBoozePosition = () => {
        const x = array.random(getAvailablePositions('x'))
        const z = array.random(getAvailablePositions('z'))

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

            <Snake ref={snakeRef} edge={size} />
            <Food ref={foodRef} position={[100, 100, 100]} />
            <Booster ref={boosterRef} position={[100, 100, 100]} />
            <Booze ref={boozeRef} position={[100, 100, 100]} />
        </>
    )
}

export default Scene
