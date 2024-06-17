import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'

const snakeGeometry = new THREE.PlaneGeometry(1, 1)

const headMaterial = new THREE.MeshNormalMaterial()
const tailMaterial = new THREE.MeshBasicMaterial({ color: 'salmon' })

const Head = ({ position = [0, 0, 0] }) => {
    return (
        <mesh
            position={position}
            geometry={snakeGeometry}
            material={headMaterial}
        />
    )
}

const Tail = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <mesh
            ref={ref}
            position={position}
            geometry={snakeGeometry}
            material={tailMaterial}
        />
    )
})

const Snake = () => {
    const snakeHead = useRef()
    const snakeTails = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const [direction, setDirection] = useState(() => ('up'))

    let timer = 0

    useFrame((state, delta) => {
        timer += delta

        if (timer >= 1) {
            const headPosition = {
                x: snakeHead.current.position.x,
                y: snakeHead.current.position.y,
            }

            if (direction === 'up') {
                snakeHead.current.position.y += timer
            }

            if (direction === 'down') {
                snakeHead.current.position.y -= timer
            }

            if (direction === 'left') {
                snakeHead.current.position.x -= timer
            }

            if (direction === 'right') {
                snakeHead.current.position.x += timer
            }

            const newTailsPosition = snakeTails.current.map((tail) => {
                return {
                    x: tail.position.x,
                    y: tail.position.y,
                }
            })

            snakeTails.current[0].position.x = headPosition.x
            snakeTails.current[0].position.y = headPosition.y

            snakeTails.current.forEach((tail, index) => {
                if (index > 0) {
                    tail.position.x = newTailsPosition[index - 1].x
                    tail.position.y = newTailsPosition[index - 1].y
                }
            })

            timer = 0
        }
    })

    const subscribeKey = (goto) => {
        return subscribeKeys(
            (state) => state[goto],
            (value) => {
                if (value) {
                    setDirection(goto)
                }
            }
        )
    }

    useEffect(() => {
        const unsubscribeUp = subscribeKey('up')
        const unsubscribeDown = subscribeKey('down')
        const unsubscribeLeft = subscribeKey('left')
        const unsubscribeRight = subscribeKey('right')

        return () => {
            unsubscribeUp()
            unsubscribeDown()
            unsubscribeLeft()
            unsubscribeRight()
        }
    }, [])

    return (
        <group>
            <mesh
                ref={snakeHead}
                geometry={snakeGeometry}
                material={headMaterial}
                position={[0, 0, 0.1]}
            />
            <mesh
                ref={(el) => snakeTails.current[0] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(0 + 1), 0.1]}
            />
            <mesh
                ref={(el) => snakeTails.current[1] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(1 + 1), 0.1]}
            />
            <mesh
                ref={(el) => snakeTails.current[2] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(2 + 1), 0.1]}
            />
        </group>
    )
}

export default Snake
