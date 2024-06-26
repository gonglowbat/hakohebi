import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { color } from '../enums/color'

const Booze = forwardRef(({ position = [0, 0, 0] }, ref) => {
    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 2.5
    })

    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color={color.RED} />
        </mesh>
    )
})

export default Booze
