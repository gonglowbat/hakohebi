import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'

const Scene = () => {
    const box = useRef()

    const boxControls = useControls({ scale: 1 })

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <mesh ref={box} scale={boxControls.scale}>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>
        </>
    )
}

export default Scene
