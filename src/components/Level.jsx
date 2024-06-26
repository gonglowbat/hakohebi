import { useMemo } from 'react'
import { Environment, Float, Grid, Text } from '@react-three/drei'
import { configs } from '../enums/configs'

const Level = () => {
    const position = useMemo(() => [-0.5, -0.51, -0.5], [])
    const size = useMemo(() => [configs.width, configs.height], [])
    const config = useMemo(() => ({
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

    return (
        <>
            <Environment preset="city" />

            <Float floatIntensity={1} rotationIntensity={0.25} speed={1}>
                <Text
                    font="/fonts/bebas-neue-regular.ttf"
                    textAlign="center"
                    position={[-0.5, 0.5, (-configs.height / 2) - 2]}
                    scale={2}
                >
                    UP
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>

            <Grid position={position} args={size} {...config} />
            <Grid position={position} args={size} {...config} rotation-z={Math.PI} />
        </>
    )
}

export default Level
