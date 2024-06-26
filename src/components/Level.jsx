import { useMemo } from 'react'
import { Environment, Float, Grid, Text } from '@react-three/drei'
import { config } from '../config'
import useStore from '../stores/useStore'

const Level = () => {
    const gridPosition = useMemo(() => [-0.5, -0.51, -0.5], [])
    const gridSize = useMemo(() => [config.width, config.height], [])
    const gridConfig = useMemo(() => ({
        cellSize: 1,
        cellThickness: 0.6,
        cellColor: '#6f6f6f',
        sectionSize: 4,
        sectionThickness: 1,
        sectionColor: '#9d4b4b',
        fadeDistance: 100,
        fadeStrength: 0,
        followCamera: false,
        infiniteGrid: false,
    }), [])

    const tails = useStore((state) => state.tails)

    return (
        <>
            <Environment preset="city" />

            <Float floatIntensity={1} rotationIntensity={0.25} speed={1}>
                <Text
                    font="/fonts/bebas-neue-regular.ttf"
                    textAlign="center"
                    position={[-0.5, 0.5, (-config.height / 2) - 2]}
                    scale={2}
                >
                    UP
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>

            <Float floatIntensity={1} rotationIntensity={0.25} speed={1}>
                <Text
                    font="/fonts/bebas-neue-regular.ttf"
                    textAlign="center"
                    position={[(-config.width / 2) - 2, 0.5, 0.5]}
                    rotation-y={Math.PI / 2}
                    scale={2}
                >
                    Score: {tails.length - 2}
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>

            <Grid position={gridPosition} args={gridSize} {...gridConfig} />
            <Grid position={gridPosition} args={gridSize} {...gridConfig} rotation-z={Math.PI} />
        </>
    )
}

export default Level
