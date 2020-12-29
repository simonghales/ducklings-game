import {proxy} from "valtio";


export const gameColors: {
    [key: string]: string,
} = {
    greenA: '#355d29',
    greenB: '#295627',
    greenC: '#415a28',
    greenD: '#4e4c25',
    orange: '#c57322',
}

export const gameColorsProxy = proxy(gameColors)