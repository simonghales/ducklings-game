import {proxy} from "valtio";

export const ducklingsState = proxy({
    'A': proxy({
        id: 'A',
    }),
    'B': proxy({
        id: 'B',
    }),
    'C': proxy({
        id: 'C',
    }),
    'D': proxy({
        id: 'D',
    }),
    'E': proxy({
        id: 'E',
    }),
})