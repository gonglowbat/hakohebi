import * as THREE from 'three'
import { forwardRef, useMemo } from 'react'
import useStore from '../stores/useStore'
import { color } from '../enums/color'
import { direction } from '../enums/direction'

const headMaterial = new THREE.MeshStandardMaterial({ color: color.BRIGHT_BLUE })
const eyeMaterial = new THREE.MeshStandardMaterial({ color: color.BRIGHT })
const irisMaterial = new THREE.MeshStandardMaterial({ color: color.DARK })

const eyeGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.3)
const irisGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)

const SnakeEye = (() => {
    const directionState = useStore((state) => state.direction)

    const position = useMemo(() => {
        if (directionState === direction.UP) {
            return [0, 0.2, -0.2]
        }

        if (directionState === direction.DOWN) {
            return [0, 0.2, 0.2]
        }

        if (directionState === direction.LEFT) {
            return [-0.2, 0.2, 0]
        }

        if (directionState === direction.RIGHT) {
            return [0.2, 0.2, 0]
        }
    }, [directionState])

    const rotation = useMemo(() => {
        if (directionState === direction.UP) {
            return [0, 0, 0]
        }

        if (directionState === direction.DOWN) {
            return [0, Math.PI, 0]
        }

        if (directionState === direction.LEFT) {
            return [0, Math.PI / 2, 0]
        }

        if (directionState === direction.RIGHT) {
            return [0, -Math.PI / 2, 0]
        }
    }, [directionState])

    return (
        <group position={position} rotation={rotation}>
            <group position={[0.5, 0, 0]}>
                <mesh
                    material={eyeMaterial}
                    geometry={eyeGeometry}
                />
                <mesh
                    position={[0.05, 0, -0.05]}
                    material={irisMaterial}
                    geometry={irisGeometry}
                />
            </group>

            <group position={[-0.5, 0, 0]}>
                <mesh
                    material={eyeMaterial}
                    geometry={eyeGeometry}
                />
                <mesh
                    position={[-0.065, 0, -0.05]}
                    material={irisMaterial}
                    geometry={irisGeometry}
                />
            </group>
        </group>
    )
})

const SnakeHead = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <group ref={ref} position={position}>
            <mesh material={headMaterial}>
                <boxGeometry />
            </mesh>
            <mesh position-y={0.5} material={headMaterial}>
                <coneGeometry args={[0.5, 1, 4]} />
            </mesh>

            <SnakeEye />
        </group>
    )
})

export default SnakeHead
