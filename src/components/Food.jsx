import { forwardRef } from 'react'

const Food = forwardRef(({ position = [0, 0, 0] }, ref) => {
    return (
        <mesh ref={ref} position={position}>
            <circleGeometry args={[0.4]} />
            <meshBasicMaterial color='purple' />
        </mesh>
    )
})

export default Food
