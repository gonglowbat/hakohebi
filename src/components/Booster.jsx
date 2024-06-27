import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { color } from '../enums/color'

const Booster = forwardRef(({ position = [0, 0, 0] }, ref) => {
    useFrame((state, delta) => {
        ref.current.rotation.x += delta * 1
        ref.current.rotation.y += delta * 1.5
    })

    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color={color.YELLOW} />
        </mesh>
    )
})

export default Booster
