type DucklingTarget = {
    x: number,
    y: number,
    active: boolean,
}

export const numberOfTargets = 10

export const ducklingTargets: DucklingTarget[] = Array.from({length: numberOfTargets}).map((_, index) => ({
    x: 0,
    y: 0,
    active: false,
}))