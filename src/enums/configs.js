import { range } from "../utils/array"

const width = 24
const height = 16

export const configs = {
    width,
    height,

    gridRange: {
        x: range(-width / 2, width / 2),
        z: range(-height / 2, height / 2),
    },

    direction: 'up',

    normalSpeed: 10,
    superSpeed: 20,

    camera: {
        normalPosition: [13, 33, 36],
        invertPosition: [12, -37, 32],
    },
}
