import * as THREE from 'three'
import { forwardRef } from 'react'
import { color } from '../enums/color'

const tailGeometry = new THREE.BoxGeometry(1, 1, 1)

const tailMaterial = new THREE.MeshStandardMaterial({ color: color.RED })
const tail2Material = new THREE.MeshStandardMaterial({ color: color.YELLOW })
const tail3Material = new THREE.MeshStandardMaterial({ color: color.GREEN })
const tail4Material = new THREE.MeshStandardMaterial({ color: color.BLUE })

const tailMaterials = [
    tailMaterial,
    tail2Material,
    tail3Material,
    tail4Material,
]

const SnakeTail = forwardRef(({ position = [0, 0, 0], index = 0 }, ref) => {
    const material = tailMaterials[index % tailMaterials.length]

    return (
        <mesh
            ref={ref}
            geometry={tailGeometry}
            material={material}
            position={position}
        />
    )
})

export default SnakeTail
