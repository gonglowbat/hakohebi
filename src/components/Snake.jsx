import * as THREE from 'three'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'

const snakeGeometry = new THREE.PlaneGeometry(1, 1)

const headMaterial = new THREE.MeshNormalMaterial()
const tailMaterial = new THREE.MeshBasicMaterial({ color: 'salmon' })

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

const Snake = forwardRef((props, ref) => {
    // const snakeHead = useRef()
    const snakeHead = ref
    const snakeTails = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const [tailLength, setTailLength] = useState(() => 4)
    const [direction, setDirection] = useState(() => 'up')

    let timer = 0

    useFrame((state, delta) => {
        timer += delta

        if (timer >= 1 / 5) {
            const headPosition = {
                x: snakeHead.current.position.x,
                y: snakeHead.current.position.y,
            }

            if (direction === 'up') {
                snakeHead.current.position.y += 1
            }

            if (direction === 'down') {
                snakeHead.current.position.y -= 1
            }

            if (direction === 'left') {
                snakeHead.current.position.x -= 1
            }

            if (direction === 'right') {
                snakeHead.current.position.x += 1
            }

            const newTailsPosition = snakeTails.current.map((tail) => ({
                x: tail.position.x,
                y: tail.position.y,
            }))

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

    useImperativeHandle(ref, () => {
        return {
            ...ref.current,
            gong() {
                console.log('asdf')
            },
        }
    }, [])

    const tails = useMemo(() => {
        return [...Array(tailLength).keys()].map((i) => {
            return (
                <mesh
                    key={i}
                    ref={(el) => snakeTails.current[i] = el}
                    geometry={snakeGeometry}
                    material={tailMaterial}
                    position={[0, -(i + 1), 0.01]}
                />
            )
        })
    }, [snakeTails])

    return (
        <group>
            {/* <mesh
                ref={snakeHead}
                geometry={snakeGeometry}
                material={headMaterial}
                position={[0, 0, 0.01]}
            /> */}
            <Head ref={snakeHead} position={[0, 0, 0.01]} />
            {/* {tails()} */}
            {tails}
            {/* <mesh
                ref={(el) => snakeTails.current[0] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(0 + 1), 0.01]}
            />
            <mesh
                ref={(el) => snakeTails.current[1] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(1 + 1), 0.01]}
            />
            <mesh
                ref={(el) => snakeTails.current[2] = el}
                geometry={snakeGeometry}
                material={tailMaterial}
                position={[0, -(2 + 1), 0.01]}
            /> */}
        </group>
    )
})

export default Snake
