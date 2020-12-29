import seedrandom from "seedrandom";
import random from "canvas-sketch-util/random"
import {V2} from "../../../shared/types";
import {calculateDistance} from "../../../utils/vectors";
import {numLerp} from "../../../utils/numbers";

let lilypadCount = 0

export const getLilypadScale = (id: string): number => {
    const randomSeed = random.createRandom(id)
    return numLerp(0.75, 1.2, randomSeed.value())
}

export const getLilypadColor = (id: string, colors: string[]): string => {
    const randomSeed = random.createRandom(id)
    return randomSeed.pick(colors)
}

const getLilypadId = (): string => {
    const id = `lilypad-${lilypadCount}`
    lilypadCount += 1
    return id
}

type LilypadData = {
    id: string,
    radius: number,
    position: V2,
}

const isOverlapping = (lilypadA: LilypadData, lilypadB: LilypadData): boolean => {

    const distance = calculateDistance(lilypadA.position[0], lilypadB.position[0], lilypadA.position[1], lilypadB.position[1])

    return distance < lilypadA.radius + lilypadA.radius

}

const generateRandomLilypad = (existingLilypads: LilypadData[], radius: number, seeds: [number, number]): LilypadData | null => {

    let remainingAttempts = 50

    while (remainingAttempts > 0) {
        remainingAttempts -= 1

        const u = seeds[0];
        const v = seeds[1];

        const w = radius * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);

        const lilyPad: LilypadData = {
            id: getLilypadId(),
            radius: 0.2,
            position: [x, y]
        }

        if (existingLilypads.length === 0) {
            return lilyPad
        }

        let overlapping = false

        for (let i = 0; i < existingLilypads.length; i++) {
            if (isOverlapping(lilyPad, existingLilypads[i])) {
                overlapping = true
                break
            }
        }

        if (!overlapping) {
            return lilyPad
        }

    }

    return null
}

export const generateLilypadClump = (seed: string = '', position: V2): LilypadClump => {
    const lilypads: LilypadData[] = []

    const random = seedrandom(seed)

    const weight = random()

    const count = Math.round(numLerp(20, 40, weight))
    const radius = Math.round(numLerp(2.5, 5, weight))

    for (let i = 0; i < count; i++) {
        const lilypad = generateRandomLilypad(lilypads, radius, [random(), random()])
        if (lilypad) {
            lilypads.push(lilypad)
        }
    }

    return {
        lilypads,
        position
    }
}

export type LilypadClump = {
    position: V2,
    lilypads: LilypadData[]
}

export const lilypadClumps: LilypadClump[] = [
    generateLilypadClump('first', [3, 3]),
    generateLilypadClump('second', [5, 10]),
    generateLilypadClump('third', [-3, -3]),
]