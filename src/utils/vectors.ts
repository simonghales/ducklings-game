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
import {calculateAngleBetweenVectors} from "./angles";

export const getVectorMagnitude = (x: number, y: number): number => {
    return Math.sqrt(x * x + y * y)
}

export const normalizeVector = (x: number, y: number, length?: number) => {
    if (!length) {
        length = getVectorMagnitude(x, y)
    }
    return [x / length, y / length]
}

export const calculateDistance = (x1: number, x2: number, y1: number, y2: number): number => {
    return getVectorMagnitude(Math.abs(x1 - x2), Math.abs(y1 - y2))
}

export const limitVector = (x: number, y: number, maximum: number): [number, number] => {
    const magnitude = getVectorMagnitude(x, y)

    if (magnitude > maximum) {

        const [normX, normY] = normalizeVector(x, y, magnitude)

        return [normX * maximum, normY * maximum]

    }
    return [x, y]
}

export const calculateCheapDistance = (x: number, x2: number, y: number, y2: number): number => {
    return Math.pow(Math.abs(x - x2), 2) + Math.pow(Math.abs(y - y2), 2)
}

export const calculateVectorFromAngle = (angle: number): [number, number] => {
    const xVector = Math.sin(angle)
    const yVector = Math.cos(angle)

    return [xVector, yVector]
}

export const calcVector = (x1: number, x2: number, y1: number, y2: number): [number, number] => {

    const angle = calculateAngleBetweenVectors(x1, x2, y1, y2)
    return calculateVectorFromAngle(angle)

}