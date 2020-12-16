import create from "zustand";

type DucklingData = {
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
    updateDucklingPosition: (ducklingKey: string, newPosition: number | null) => void,
}

export const useDucklingsStore = create<DucklingsStore>(set => ({
    ducklings: ducks,
    updateDucklingPosition: (ducklingKey, newPosition) => {
        return set(state => {
            const ducklings = state.ducklings
            const orderedDucklings = Object.values(ducklings).sort((ducklingA, ducklingB) => {
                return (ducklingA.position ?? 999) - (ducklingB.position ?? 999)
            })
            if (newPosition != null) {
                const max = ducklings[ducklingKey].position ?? orderedDucklings.length - 1
                for (let i = newPosition; i < max; i++) {
                    const duckling = orderedDucklings[i]
                    if (duckling.position != null) {
                        duckling.position = duckling.position + 1
                    }
                }
            } else if (ducklings[ducklingKey].position != null) {
                const currentPosition = ducklings[ducklingKey].position as number
                for (let i = currentPosition; i < orderedDucklings.length - 1; i++) {
                    const duckling = orderedDucklings[i]
                    if (duckling.position != null) {
                        duckling.position = duckling.position - 1
                    }
                }
            }
            ducklings[ducklingKey].position = newPosition
            console.log('update ducklings', ducklings)
            return {
                ducklings: {
                    ...ducklings,
                },
            }
        })
    },
}))