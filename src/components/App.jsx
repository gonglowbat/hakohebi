import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'
import Scene from './Scene'
import useStore from '../stores/useStore'
import Interface from './Interface'
import { config } from '../config'

const App = () => {
    const isDebug = useStore((state) => state.isDebug)
    const setIsDebug = useStore((state) => state.setIsDebug)

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
                { name: 'pause', keys: ['Space'] },
            ]}>
                <Canvas
                    camera={{
                        position: config.camera.normalPosition,
                        fov: 25,
                    }}
                >
                    <Scene />
                </Canvas>

                <Interface />
            </KeyboardControls>
        </>
    )
}

export default App
