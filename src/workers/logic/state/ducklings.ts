import create from "zustand";

export type DucklingState = {
    id: string,
    order: number,
    isFollowingPlayer: boolean,
}

const generateDucklingState = (id: string, order: number): DucklingState => {
    return {
        id,
        order,
        isFollowingPlayer: false,
    }
}

type DucklingsStateStore = {
    ducklings: {
        [key: string]: DucklingState,
    },
    updateDucklingsOrder: (id: string, newPosition: number) => void,
}

export const useDucklingsState = create<DucklingsStateStore>(set => ({
   ducklings: {
       'A': generateDucklingState('A', 0),
       'B': generateDucklingState('B', 1),
       'C': generateDucklingState('C', 2),
       'D': generateDucklingState('D', 3),
       'E': generateDucklingState('E', 4),
   },
    updateDucklingsOrder: (id, newPosition) => {
       return set(state => {

           const ducklings = state.ducklings

           const sortedDucklings = getSortedDucklings(Object.values(ducklings))

           const currentIndex = sortedDucklings.findIndex((duckling) => duckling.id === id)

           const currentDuckling = sortedDucklings.splice(currentIndex, 1)

           const newIndex = sortedDucklings.findIndex((duckling) => duckling.order === newPosition)

           sortedDucklings.splice(newIndex,0, ...currentDuckling)

           sortedDucklings.forEach((duckling, index) => {
               duckling.order = index
               ducklings[duckling.id] = {
                   ...duckling,
               }
           })

           return {
               ducklings,
           }
       })
    }
}))

const {updateDucklingsOrder} = useDucklingsState.getState()

export {
    updateDucklingsOrder,
}

export const useDucklings = (): DucklingState[] => {
    return Object.values(useDucklingsState(state => state.ducklings))
}

export const useDucklingState = (id: string): DucklingState => {
    const duckling = useDucklingsState((state) => {
        const ducklingState = state.ducklings[id]
        if (!ducklingState) throw new Error(`No duckling state matched for ${id}`)
        return ducklingState
    })
    return duckling
}

export const sortDucklings = (ducklingA: DucklingState, ducklingB: DucklingState): number => {
    return ducklingA.order - ducklingB.order
}

export const getSortedDucklings = (ducklings?: DucklingState[]): DucklingState[] => {
    if (ducklings) {
        return ducklings.sort(sortDucklings)
    }
    return Object.values(useDucklingsState.getState().ducklings).sort(sortDucklings)
}


export const useSortedDucklings = (): DucklingState[] => {
    const ducklings = useDucklings()
    return ducklings.sort(sortDucklings)
}