import {Fluid} from "stam-stable-fluids"

export const initFluid = () => {

    const size = 32

    const fluid = new Fluid(size)

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size/2; x++) {
            fluid.addDensity(x, y, 10)
        }
    }
    for (let y = 0; y < size; y++) {
        fluid.addForce(10, y, 10, 0)
    }

    let previousTime = Date.now()

    let tick = 0

    setInterval(() => {
        tick += 1
        const time = Date.now()
        const delta = time - previousTime
        previousTime = time
        // console.time('step')
        fluid.step(delta / 1000)
        // console.timeEnd('step')
        // console.log('f.velocityAt(0, 0)', fluid.velocityAt(50, 50))

        // if (tick === 50) {
        //
        //     console.time('totalDensity')
        //     let totalDensity = 0
        //
        //     for (let x = 0; x < size; x++) {
        //
        //         for (let y = 0; y < size; y++) {
        //
        //
        //             const density = fluid.densityAt(x,y)
        //
        //             totalDensity += density
        //
        //         }
        //
        //     }
        //
        //     console.log('totalDensity', totalDensity)
        //     console.timeEnd('totalDensity')
        //
        // }

    }, 1000 / 15) // maybe less often and interpolate the values?

    console.log('fluid', fluid)

}
