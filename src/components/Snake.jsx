import * as THREE from 'three'
import { forwardRef, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useControls } from 'leva'
import { colors } from '../enums/colors'
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

    const { stop, speed } = useControls({
        stop: false,
        speed: {
            value: 10,
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
