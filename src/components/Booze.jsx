import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { color } from '../enums/color'

const Booze = forwardRef(({ position = [0, 0, 0] }, ref) => {
    useFrame((state, delta) => {
        ref.current.rotation.x += delta * 1.5
        ref.current.rotation.y += delta * 2.5
    })

    return (
        <mesh ref={ref} position={position}>
            <torusKnotGeometry args={[0.3, 0.1]} />
            <meshStandardMaterial color={color.RED} />
        </mesh>
    )
})

export default Booze
