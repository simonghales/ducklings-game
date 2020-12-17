import {useEffect} from "react";

export const useIntervalFrame = (fn: (delta: number) => any) => {

    useEffect(() => {

        let previousTime = Date.now()
        let delta = 0

        let interval = setInterval(() => {
            delta = Date.now() - previousTime
            fn(delta)
            previousTime = Date.now()
        }, 1000 / 60)

        return () => {
            clearInterval(interval)
        }

    }, [fn])

}