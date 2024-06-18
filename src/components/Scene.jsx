import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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

    const increaseSnakeTailLength = useGame((state) => state.increaseSnakeTailLength)
    const isFoodEdible = useGame((state) => state.isFoodEdible)
    const setIsFoodEdible = useGame((state) => state.setIsFoodEdible)

    useFrame(() => {
        const isSamePositionX = snake.current.children[0].position.x === food.current.position.x
        const isSamePositionY = snake.current.children[0].position.y === food.current.position.y

        if (isSamePositionX && isSamePositionY && isFoodEdible) {
            setIsFoodEdible(false)
            increaseSnakeTailLength()
            randomFoodPosition()
        }
    })

    const randomFoodPosition = () => {
        const x = Math.floor(Math.random() * size.width / 2)
        const y = Math.floor(Math.random() * size.height / 2)

        food.current.position.x = x
        food.current.position.y = y

        setIsFoodEdible(true)
    }

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <mesh>
                <planeGeometry args={[size.width, size.height]} />
                <meshBasicMaterial />
            </mesh>

            <Snake ref={snake} edge={size} />
            <Food ref={food} position={[0, 5, 0.005]} />
        </>
    )
}

export default Scene
