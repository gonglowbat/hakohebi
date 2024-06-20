import { forwardRef } from 'react'

const Food = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshBasicMaterial color="purple" />
        </mesh>
    )
})

export default Food
