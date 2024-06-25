export const range = (start, end) => {
    return new Array(end - start).fill().map((number, index) => index + start)
}

export const unique = (array1, array2) => {
    const combined = [...array1, ...array2]

    return combined.filter((value, index, array) => {
        return array.indexOf(value) === array.lastIndexOf(value)
    })
}

export const random = (array) => {
    return array[Math.round(Math.random() * (array.length - 1))]
}
