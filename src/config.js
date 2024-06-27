import * as THREE from 'three'
import { range } from './utils/array'

const width = 14
const height = 10

export const config = {
    width,
    height,

    gridRange: {
        x: range(-width / 2, width / 2),
        z: range(-height / 2, height / 2),
    },

    direction: 'up',

    normalSpeed: 6,
    superSpeed: 10,

    camera: {
        normalPosition: [10, 26, 27],
        invertPosition: [10, -26, 27],
        fov: 25,
    },

    defaultTails: [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 2),
    ],
}
