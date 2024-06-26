import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { color } from '../enums/color'

const Food = forwardRef(({ position = [0, 0, 0] }, ref) => {
    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 2.5
    })

    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color={color.BRIGHT} />
        </mesh>
    )
})

export default Food
