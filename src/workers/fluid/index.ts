/* eslint-disable no-restricted-globals */

const selfWorker = self as unknown as Worker

console.log('this is fluid worker...')

selfWorker.onmessage = (event: MessageEvent) => {

    console.log('message?')

}

export {}