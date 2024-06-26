import * as THREE from 'three'
import { forwardRef, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { colors } from '../enums/colors'
import { configs } from '../enums/configs'
import useGame from '../stores/useGame'

const tailGeometry = new THREE.BoxGeometry(1, 1, 1)

const tailMaterial = new THREE.MeshStandardMaterial({ color: colors.red })
const tail2Material = new THREE.MeshStandardMaterial({ color: colors.yellow })
const tail3Material = new THREE.MeshStandardMaterial({ color: colors.green })
const tail4Material = new THREE.MeshStandardMaterial({ color: colors.blue })

const tailMaterials = [
    tailMaterial,
    tail2Material,
    tail3Material,
    tail4Material,
]

const Head = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <group ref={ref} position={position}>
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color={colors.bright} />
            </mesh>
            <mesh position-y={1}>
                <coneGeometry args={[0.5, 1, 4]} />
                <meshStandardMaterial color={colors.bright} />
            </mesh>
        </group>
    )
})

const Tail = forwardRef(({ position = [0, 0, 0], index = 0 }, ref) => {
    const material = tailMaterials[index % tailMaterials.length]

    return (
        <mesh
            ref={ref}
            geometry={tailGeometry}
            material={material}
            position={position}
        />
    )
})

const Snake = forwardRef((props, ref) => {
    const headRef = useRef()
    const tailsRef = useRef([])

    const [subscribeKeys] = useKeyboardControls()

    const direction = useGame((state) => state.direction)
    const setDirection = useGame((state) => state.setDirection)
    const speed = useGame((state) => state.speed)
    const tails = useGame((state) => state.tails)

    const phase = useGame((state) => state.phase)
    const pause = useGame((state) => state.pause)
    const resume = useGame((state) => state.resume)

    useFrame((state) => {
        const { clock } = state

        if (phase === 'pause') {
            return
        }

        if (clock.getElapsedTime() > 1 / speed) {
            clock.start()

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

            const newTailsPosition = tailsRef.current.map((tail) => ({
                x: tail.position.x,
                z: tail.position.z,
            }))

            tailsRef.current[0].position.x = headPosition.x
            tailsRef.current[0].position.z = headPosition.z
            tails[0].x = headPosition.x
            tails[0].z = headPosition.z

            tailsRef.current.forEach((tail, index) => {
                if (index > 0) {
                    tail.position.x = newTailsPosition[index - 1].x
                    tail.position.z = newTailsPosition[index - 1].z
                    tails[index].x = newTailsPosition[index - 1].x
                    tails[index].z = newTailsPosition[index - 1].z
                }
            })
        }
    })

    const passThroughWall = () => {
        if (headRef.current.position.x > (configs.width / 2) - 1) {
            headRef.current.position.x = -configs.width / 2
            return
        }

        if (headRef.current.position.x < (-configs.width / 2)) {
            headRef.current.position.x = (configs.width / 2) - 1
            return
        }

        if (headRef.current.position.z > (configs.height / 2) - 1) {
            headRef.current.position.z = -configs.height / 2
            return
        }

        if (headRef.current.position.z < (-configs.height / 2)) {
            headRef.current.position.z = (configs.height / 2) - 1
            return
        }
    }

    const subscribeKey = (goto, opposite) => {
        return subscribeKeys(
            (state) => state[goto],
            (value) => {
                if (value && direction !== opposite) { setDirection(goto) }
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
                    return phase === 'playing' ? pause() : resume()
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

    return (
        <group ref={ref}>
            <Head ref={headRef} position={[0, 0, 0]} />

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
