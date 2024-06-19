import * as THREE from 'three'
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useControls } from 'leva'
import useGame from '../stores/useGame'

const snakeGeometry = new THREE.PlaneGeometry(1, 1)

const headMaterial = new THREE.MeshNormalMaterial()
const tailMaterial = new THREE.MeshBasicMaterial({ color: 'salmon' })
const tail2Material = new THREE.MeshBasicMaterial({ color: 'green' })

const Head = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <mesh
            ref={ref}
            position={position}
            geometry={snakeGeometry}
            material={headMaterial}
        />
    )
})

const Tail = forwardRef(({ position = [0, 0, 0], index = 0 }, ref) => {
    return (
        <mesh
            ref={ref}
            geometry={snakeGeometry}
            material={index % 2 === 0 ? tailMaterial : tail2Material}
            position={position}
        />
    )
})

const Snake = forwardRef((props, ref) => {
    const headRef = useRef()
    const tailsRef = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const { stop, speed } = useControls({
        stop: false,
        speed: {
            value: 1,
            min: 1,
            max: 10,
            step: 1,
        },
    })

    const direction = useGame((state) => state.direction)
    const setDirection = useGame((state) => state.setDirection)
    const tails = useGame((state) => state.tails)

    useFrame((state) => {
        const { clock } = state

        if (stop) {
            return
        }

        if (clock.getElapsedTime() > 1 / speed) {
            clock.start()

            const headPosition = {
                x: headRef.current.position.x,
                y: headRef.current.position.y,
            }

            if (direction === 'up') {
                headRef.current.position.y += 1
            }

            if (direction === 'down') {
                headRef.current.position.y -= 1
            }

            if (direction === 'left') {
                headRef.current.position.x -= 1
            }

            if (direction === 'right') {
                headRef.current.position.x += 1
            }

            const newTailsPosition = tailsRef.current.map((tail) => ({
                x: tail.position.x,
                y: tail.position.y,
            }))

            tailsRef.current[0].position.x = headPosition.x
            tailsRef.current[0].position.y = headPosition.y

            tailsRef.current.forEach((tail, index) => {
                if (index > 0) {
                    tail.position.x = newTailsPosition[index - 1].x
                    tail.position.y = newTailsPosition[index - 1].y
                    tail.position.z = 0.01
                }
            })
        }
    })

    const subscribeKey = (goto) => {
        return subscribeKeys(
            (state) => state[goto],
            (value) => {
                if (value) { setDirection(goto) }
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
    })

    return (
        <group ref={ref}>
            <Head ref={headRef} position={[0, 0, 0.01]} />

            {tails.map((tailPosition, index) => (
                <Tail
                    key={index}
                    ref={(el) => tailsRef.current[index] = el}
                    position={tailPosition}
                    index={index}
                />
            ))}
        </group>
    )
})

export default Snake
