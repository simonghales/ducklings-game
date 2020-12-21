import create from "zustand";

export type DucklingState = {
    id: string,
    order: number | null,
    isFollowingPlayer: boolean,
}

const generateDucklingState = (id: string, order: number | null): DucklingState => {
    return {
        id,
        order,
        isFollowingPlayer: true,
    }
}

type DucklingsStateStore = {
    ducklings: {
        [key: string]: DucklingState,
    },
    updateDucklingsOrder: (id: string, newPosition: number) => void,
    updateDuckling: (id: string, update: Partial<DucklingState>) => void,
}

export const useDucklingsState = create<DucklingsStateStore>(set => ({
   ducklings: {
       'A': generateDucklingState('A', 0),
       'B': generateDucklingState('B', 1),
       'C': generateDucklingState('C', 2),
       'D': generateDucklingState('D', 3),
       'E': generateDucklingState('E', 4),
   },
    updateDuckling: (id: string, update: Partial<DucklingState>) => {
       return set(state => {
           const ducklings = state.ducklings
           const duckling = ducklings[id]
           if (!duckling) throw new Error(`No duckling found for ${id}`)
           const newDucklingState =  {
               ...duckling,
               ...update,
           }
           ducklings[id] = newDucklingState
           return {
               ducklings: {
                   ...ducklings,
               }
           }
       })
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

const {updateDucklingsOrder, updateDuckling} = useDucklingsState.getState()

export {
    updateDucklingsOrder,
    updateDuckling,
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
    return (ducklingA.order ?? 999) - (ducklingB.order ?? 999)
}

export const filterDucklings = (duckling: DucklingState) => {
    return duckling.isFollowingPlayer
}

export const getSortedDucklings = (ducklings?: DucklingState[]): DucklingState[] => {
    if (ducklings) {
        return ducklings.filter(filterDucklings).sort(sortDucklings)
    }
    return Object.values(useDucklingsState.getState().ducklings).filter(filterDucklings).sort(sortDucklings)
}

export const getNumberOfFollowingDucklings = (): number => {
    return getSortedDucklings().length
}

export const useSortedDucklings = (): DucklingState[] => {
    const ducklings = useDucklings()
    return ducklings.filter(filterDucklings).sort(sortDucklings)
}

export const stopFollowingPlayer = (id: string) => {
    updateDuckling(id, {
        order: null,
        isFollowingPlayer: false,
    })
}

export const startFollowingPlayer = (id: string) => {
    updateDuckling(id, {
        order: getNumberOfFollowingDucklings(),
        isFollowingPlayer: true,
    })
}