import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, Grid, OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import Snake from './Snake'
import Food from './Food'
import useGame from '../stores/useGame'

const Scene = () => {
    const snake = useRef()
    const food = useRef()

    const size = useMemo(() => ({ width: 40, height: 30 }), [])

    const isFoodEdible = useGame((state) => state.isFoodEdible)
    const setIsFoodEdible = useGame((state) => state.setIsFoodEdible)
    const setTails = useGame((state) => state.setTails)
    const tails = useGame((state) => state.tails)

    useFrame(() => {
        const isSamePositionX = Math.floor(snake.current.children[0].position.x) === Math.floor(food.current.position.x)
        const isSamePositionZ = Math.floor(snake.current.children[0].position.z) === Math.floor(food.current.position.z)

        if (isSamePositionX && isSamePositionZ && isFoodEdible) {
            const lastTailPosition = tails[tails.length - 1]
            setTails(lastTailPosition.clone())

            setIsFoodEdible(false)
            randomFoodPosition()
        }
    })

    const randomFoodPosition = () => {
        const x = Math.floor(Math.random() * size.width / 2)
        const z = Math.floor(Math.random() * size.height / 2)

        food.current.position.x = x
        food.current.position.z = z

        setIsFoodEdible(true)
    }

    const { gridSize, ...gridConfig } = useControls({
        gridSize: [40, 40],
        cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
        cellThickness: { value: 0.6, min: 0, max: 5, step: 0.1 },
        cellColor: '#6f6f6f',
        sectionSize: { value: 4, min: 0, max: 10, step: 0.1 },
        sectionThickness: { value: 1, min: 0, max: 5, step: 0.1 },
        sectionColor: '#9d4b4b',
        fadeDistance: { value: 80, min: 0, max: 100, step: 1 },
        fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
        followCamera: false,
        infiniteGrid: false,
    })

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <axesHelper args={[20]} />

            <GizmoHelper>
                <GizmoViewport labelColor="white" />
            </GizmoHelper>

            {/* <mesh>
                <planeGeometry args={[size.width, size.height]} />
                <meshBasicMaterial />
            </mesh> */}
            <Grid position={[-0.5, -0.51, -0.5]} args={gridSize} {...gridConfig} />

            <Snake ref={snake} edge={size} />
            <Food ref={food} position={[0, 0, -5]} />
        </>
    )
}

export default Scene
