import { Grid as GridDrei } from '@react-three/drei'
import { configs } from '../enums/configs'
import { useMemo } from 'react'

const Grid = () => {
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
            <GridDrei position={position} args={size} {...config} />
            <GridDrei position={position} args={size} {...config} rotation-z={Math.PI} />
        </>
    )
}

export default Grid
