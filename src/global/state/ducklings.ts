import create from "zustand";

const ducklingPositions = {
    0: ['A'],
    1: ['B'],
    2: ['C'],
    3: ['D'],
    4: ['E'],
}

const ducklingDesiredPositions = {
    0: ['E'],
    1: [],
    2: [],
    3: [],
    4: [],
}

/*

duckling has a position

if it thinks it's easier to move to a higher position, it'll do that

a duckling follows the position of the duckling in front of it

can only follow a lower number position

when changing position, notify its intention to other ducklings



 */



export type DucklingData = {
    id: string,
    position: number | null,
}

const ducks: {
    [key: string]: DucklingData
} = {
    'A' : {
        id: `A`,
        position: 0,
    },
    'B' : {
        id: `B`,
        position: 1,
    },
    'C' : {
        id: `C`,
        position: 2,
    },
    'D' : {
        id: `D`,
        position: 3,
    },
    'E' : {
        id: `E`,
        position: 4,
    }
}

type DucklingsStore = {
    ducklings: {
        [key: string]: DucklingData,
    },
    updateDucklingPosition: (ducklingKey: string, newPosition: number) => void,
}

export const useDucklingsStore = create<DucklingsStore>(set => ({
    ducklings: ducks,
    updateDucklingPosition: (ducklingKey, newPosition) => {
        console.log('updateDucklingPosition', ducklingKey, newPosition)
        return set(state => {
            const ducklings = state.ducklings
            const orderedDucklings = Object.values(ducklings).sort((ducklingA, ducklingB) => {
                return (ducklingA.position ?? 999) - (ducklingB.position ?? 999)
            })

            const currentPosition = ducklings[ducklingKey].position as number

            if (currentPosition <= newPosition) {
                console.log('no difference?')
                return {}
            }

            const numberOfFollowingDucklings = orderedDucklings.length - 1 - currentPosition

            for (let i = newPosition; i < currentPosition; i++) {
                if (orderedDucklings[i].position != null) {
                    orderedDucklings[i].position = (orderedDucklings[i].position as number) + numberOfFollowingDucklings
                }
            }

            const difference = currentPosition - newPosition

            for (let i = currentPosition; i < orderedDucklings.length - 1; i++) {
                if (orderedDucklings[i].position != null) {
                    orderedDucklings[i].position = (orderedDucklings[i].position as number) - difference
                }
            }

            const reorderedDucklings = orderedDucklings.sort((ducklingA, ducklingB) => {
                return (ducklingA.position ?? 999) - (ducklingB.position ?? 999)
            })

            reorderedDucklings.forEach((duckling, index) => {
                ducklings[duckling.id].position = index
            })

            return {
                ducklings: {
                    ...ducklings,
                },
            }
        })
    },
}))