import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, useProgress } from '@react-three/drei'
import { Leva } from 'leva'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Scene from './Scene'
import useStore from '../stores/useStore'
import Interface from './Interface'
import { config } from '../config'
import Loader from './Loader'

const App = () => {
    const isDebug = useStore((state) => state.isDebug)
    const setIsDebug = useStore((state) => state.setIsDebug)

    const { progress } = useProgress()

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
            { progress !== 100 ? <Loader /> : null }

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

            <Analytics />
            <SpeedInsights />
        </>
    )
}

export default App
