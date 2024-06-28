import { forwardRef, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { config } from '../config'
import { phase as phaseEnum } from '../enums/phase'
import useStore from '../stores/useStore'
import SnakeHead from './SnakeHead'
import SnakeTail from './SnakeTail'

let timer = 0

const Snake = forwardRef((props, ref) => {
    const headRef = useRef()
    const tailsRef = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const direction = useStore((state) => state.direction)
    const setDirection = useStore((state) => state.setDirection)
    const speed = useStore((state) => state.speed)
    const tails = useStore((state) => state.tails)
    const resetTails = useStore((state) => state.resetTails)

    const phase = useStore((state) => state.phase)
    const pause = useStore((state) => state.pause)
    const resume = useStore((state) => state.resume)
    const end = useStore((state) => state.end)
    const start = useStore((state) => state.start)

    useFrame((state, delta) => {
        if (phase !== phaseEnum.PLAYING) {
            return
        }

        timer += delta

        if (timer > 1 / speed) {
            const headPosition = {
                x: headRef.current.position.x,
                z: headRef.current.position.z,
            }

            if (direction === 'up') {
                headRef.current.position.z -= 1
            }

            if (direction === 'down') {
                headRef.current.position.z += 1
            }

            if (direction === 'left') {
                headRef.current.position.x -= 1
            }

            if (direction === 'right') {
                headRef.current.position.x += 1
            }

            passThroughWall()

            const newTailsPosition = tailsRef.current
                .filter((tail) => tail !== null)
                .map((tail) => ({
                    x: tail.position.x,
                    z: tail.position.z,
                }))

            tailsRef.current[0].position.x = headPosition.x
            tailsRef.current[0].position.z = headPosition.z
            tails[0].x = headPosition.x
            tails[0].z = headPosition.z

            tailsRef.current
                .filter((tail) => tail !== null)
                .forEach((tail, index) => {
                    if (index > 0) {
                        tail.position.x = newTailsPosition[index - 1].x
                        tail.position.z = newTailsPosition[index - 1].z
                        tails[index].x = newTailsPosition[index - 1].x
                        tails[index].z = newTailsPosition[index - 1].z
                    }
                })

            if (isSnakeHitItself()) {
                end()
            }

            timer = 0
        }
    })

    const passThroughWall = () => {
        if (headRef.current.position.x > (config.width / 2) - 1) {
            headRef.current.position.x = -config.width / 2
            return
        }

        if (headRef.current.position.x < (-config.width / 2)) {
            headRef.current.position.x = (config.width / 2) - 1
            return
        }

        if (headRef.current.position.z > (config.height / 2) - 1) {
            headRef.current.position.z = -config.height / 2
            return
        }

        if (headRef.current.position.z < (-config.height / 2)) {
            headRef.current.position.z = (config.height / 2) - 1
            return
        }
    }

    const isSnakeHitItself = () => {
        const headPositionX = Math.floor(headRef.current.position.x)
        const headPositionZ = Math.floor(headRef.current.position.z)

        return tailsRef.current.filter((tail) => tail !== null).some((tail) => {
            return Math.floor(tail.position.x) === headPositionX
                && Math.floor(tail.position.z) === headPositionZ
        })
    }

    const subscribeKey = (goto, opposite) => {
        return subscribeKeys(
            (state) => state[goto],
            (value) => {
                if (value
                    && direction !== opposite
                    && phase === phaseEnum.PLAYING
                ) {
                    setDirection(goto)
                }
            }
        )
    }

    useEffect(() => {
        const unsubscribeUp = subscribeKey('up', 'down')
        const unsubscribeDown = subscribeKey('down', 'up')
        const unsubscribeLeft = subscribeKey('left', 'right')
        const unsubscribeRight = subscribeKey('right', 'left')

        const unsubscribePause = subscribeKeys(
            (state) => state.pause,
            (value) => {
                if (value) {
                    return phase === phaseEnum.PLAYING ? pause() : resume()
                }
            }
        )

        return () => {
            unsubscribeUp()
            unsubscribeDown()
            unsubscribeLeft()
            unsubscribeRight()
            unsubscribePause()
        }
    })

    useEffect(() => {
        const unsubscribeRestart = useStore.subscribe((
            state) => state.phase,
            (value) => {
                if (value === phaseEnum.RESTARTING) {
                    headRef.current.position.set(0, 0, 0)
                    resetTails()
                    tailsRef.current = []
                    setDirection('up')
                    start()
                }
            }
        )

        return () =>  {
            unsubscribeRestart()
        }
    })

    return (
        <group ref={ref}>
            <SnakeHead ref={headRef} position={[0, 0, 0]} />

            {tails.map((tailPosition, index) => (
                <SnakeTail
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
