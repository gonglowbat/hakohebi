import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'
import Scene from './Scene'
import useGame from '../stores/useGame'

const App = () => {
    const isDebug = useGame((state) => state.isDebug)
    const setIsDebug = useGame((state) => state.setIsDebug)

    useEffect(() => {
        window.addEventListener('hashchange', () => {
            setIsDebug(window.location.hash === '#debug')
        })

        return window.removeEventListener('hashchange', () => {
            setIsDebug(window.location.hash === '#debug')
        })
    }, [])

    return (
        <>
            <Leva collapsed={false} hidden={!isDebug}/>

            <KeyboardControls map={[
                { name: 'up', keys: ['KeyW'] },
                { name: 'down', keys: ['KeyS'] },
                { name: 'left', keys: ['KeyA'] },
                { name: 'right', keys: ['KeyD'] },
            ]}>
                <Canvas
                    // camera={{
                    //     fov: 75,
                    //     near: 0.1,
                    //     far: 100,
                    //     position: [0, 0, 30],
                    // }}
                    // camera={{ position: [30, 32, 32], fov: 25 }}
                    // orthographic
                    // camera={{ zoom: 40, position: [30, 32, 32] }}

                    camera={{ position: [13, 33, 36], fov: 25 }}
                    // camera={{ position: [12, -37, 32], fov: 25 }}
                >
                    <Scene />
                </Canvas>
            </KeyboardControls>
        </>
    )
}

export default App
