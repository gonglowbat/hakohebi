import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import Snake from './Snake'
import Food from './Food'

const Scene = () => {
    const box = useRef()
    const snake = useRef()
    const food = useRef()

    const boxControls = useControls({ scale: 1 })

    useFrame(() => {
        // console.log(snake);
        // console.log(snake.current.position.x === food.current.position.x)
        const isSamePositionX = snake.current.position.x === food.current.position.x
        const isSamePositionY = snake.current.position.y === food.current.position.y

        if (isSamePositionX && isSamePositionY) {
            // console.log('eat')
            snake.current.gong()
        }
    })

    return (
        <>
            {/* <Perf position="top-left" /> */}

            {/* <OrbitControls makeDefault /> */}

            {/* <mesh ref={box} scale={boxControls.scale}>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh> */}

            <mesh>
                <planeGeometry args={[40, 30]} />
                <meshBasicMaterial />
            </mesh>

            <Snake ref={snake} edge={{width: 40, height: 30}} />
            <Food ref={food} position={[1, 5, 0.005]} />
        </>
    )
}

export default Scene
