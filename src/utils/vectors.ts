// export const getVectorMagnitude = (vector: [number, number]): [number, number] => {
//
// }
//
// export const normalizeVector = (vector: [number, number], magnitude: [number, number], newMagnitude: number): [number, number] => {
//
//     const newX = vector[0] * newMagnitude / magnitude[0]
//     const newY = vector[1] * newMagnitude / magnitude[1]
//     return [newX, newY]
//
// }

/*

convert: [1,2] to something else..

 */
export const getVectorLength = (x: number, y: number): number => {
    return Math.sqrt(x * x + y * y)
}

export const normalizeVector = (x: number, y: number, length?: number) => {
    if (!length) {
        length = getVectorLength(x, y)
    }
    return [x / length, y / length]
}

export const limitVector = (x: number, y: number, maximum: number): [number, number] => {
    const magnitude = getVectorLength(x, y)

    if (magnitude > maximum) {

        const [normX, normY] = normalizeVector(x, y, magnitude)

        return [normX * maximum, normY * maximum]

    }
    return [x, y]
}