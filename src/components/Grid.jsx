import { Grid as GridDrei } from '@react-three/drei'
import { useControls } from 'leva'
import { configs } from '../enums/configs'

const Grid = () => {
    const { gridSize, ...gridConfig } = useControls({
        gridSize: [configs.width, configs.height],
        cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
        cellThickness: { value: 0.6, min: 0, max: 5, step: 0.1 },
        cellColor: '#6f6f6f',
        sectionSize: { value: 4, min: 0, max: 10, step: 0.1 },
        sectionThickness: { value: 1, min: 0, max: 5, step: 0.1 },
        sectionColor: '#9d4b4b',
        fadeDistance: { value: 100, min: 0, max: 100, step: 1 },
        fadeStrength: { value: 0, min: 0, max: 1, step: 0.1 },
        followCamera: false,
        infiniteGrid: false,
    })

    return (
        <>
            <GridDrei position={[-0.5, -0.51, -0.5]} args={gridSize} {...gridConfig} />
            <GridDrei position={[-0.5, -0.51, -0.5]} args={gridSize} {...gridConfig} rotation-z={Math.PI} />
        </>
    )
}

export default Grid
