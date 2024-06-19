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
            position={position}
            geometry={snakeGeometry}
            material={index % 2 === 0 ? tailMaterial : tail2Material}
        />
    )
})

const Snake = forwardRef((props, ref) => {
    const snakeHead = useRef()
    const snakeTails = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const { stop } = useControls({ stop: false })

    const direction = useGame((state) => state.direction)
    const setDirection = useGame((state) => state.setDirection)
    const snakeTailLength = useGame((state) => state.snakeTailLength)
    const accquiredPosition = useGame((state) => state.accquiredPosition)
    const setAccquiredPosition = useGame((state) => state.setAccquiredPosition)

    useFrame((state) => {
        const { clock } = state

        if (stop) {
            return
        }

        if (clock.getElapsedTime() > 1) {
            clock.start()

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

    const tailssss = () => {
        const tails = [...Array(snakeTailLength).keys()].map((i) => {
            // let position = [0, -(i + 1), 0.01]

            // console.log(i, snakeTailLength, snakeTails.current.length, snakeTails.current)

            // if (i === snakeTailLength - 1 && snakeTails.current.length > 1) {
            //     const lastPosition = snakeTails.current[snakeTails.current.length - 1].position
            //     position = [lastPosition.x, lastPosition.y, 0.01]

            //     console.log(i, snakeTailLength, snakeTails.current.length, position)
            // }

            // const position = [Math.floor(Math.random() * 40 / 2), Math.floor(Math.random() * 30 / 2), 0.01]

            const headPosition = {
                x: snakeHead.current?.position.x || 0,
                y: snakeHead.current?.position.y || 0,
            }

            const snakeTails = ref.current?.children.slice(1) || []

            console.log(snakeTails)

            const positionX = snakeTails[i]?.position.x || 0
            const positionY = snakeTails[i]?.position.x || -(i + 1)

            const position = [positionX, positionY, 0.01]
            console.log(position, i)

            return (
                <Tail
                    key={i}
                    // ref={(el) => snakeTails.current[i] = el}
                    position={position}
                    index={i}
                />
            )
        })

        console.log('========')

        return tails
    }

    const tails = useMemo(() => {
        const tails = [...Array(snakeTailLength).keys()].map((i) => {
            let position = [0, -(i + 1), 0.01]

            if (i === snakeTailLength - 1 && snakeTails.current.length > 1) {
                const lastPosition = snakeTails.current[snakeTails.current.length - 1].position
                position = [lastPosition.x, lastPosition.y, 0.01]

                console.log(i, snakeTailLength, snakeTails.current.length, position)
            }

            return (
                <Tail
                    key={i}
                    ref={(el) => snakeTails.current[i] = el}
                    position={position}
                    index={i}
                />
            )
        })

        return tails
    }, [snakeTailLength])

    return (
        <group ref={ref}>
            {/* <Head ref={snakeHead} position={accquiredPosition[0].position.toArray()} /> */}
            <Head ref={snakeHead} position={[0, 0, 0.01]} />
            {tails}
            {/* {tailssss()} */}
        </group>
    )
})

export default Snake
