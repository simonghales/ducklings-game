import * as React from "react"
import {RangeType, useRangeElements} from "../../state/area";
import {useEffect, useState} from "react";
import {DucklingMessageType, sendDucklingMessage} from "../../../../../../messaging/ducklings";
import {addAvailableFoodSource, removeAvailableFoodSource, useAvailableFoodSources} from "../../state/food";

const useIsFoodAvailable = (): boolean => {
    const foodSources = useAvailableFoodSources()
    return foodSources.length > 0
}

const RangeElement: React.FC<{
    id: string,
    short: boolean,
    medium: boolean,
    rangeType: RangeType,
}> = ({id, short, medium, rangeType}) => {

    const [closeActivated, setCloseActivated] = useState(false)
    const [activated, setActivated] = useState(false)

    useEffect(() => {
        if (short) {

            if (!closeActivated) {
                const timeout = setTimeout(() => {
                    setCloseActivated(true)
                }, 1200)

                return () => {
                    clearTimeout(timeout)
                }
            }

        } else {
            setCloseActivated(false)
        }

    }, [short, closeActivated, setCloseActivated])

    useEffect(() => {

        if (closeActivated && !activated) {

            const timeout = setTimeout(() => {
                setActivated(true)
            }, 800)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [activated, setActivated, closeActivated])

    const foodIsAvailable = useIsFoodAvailable()

    const mediumActive = medium && foodIsAvailable

    useEffect(() => {

        if (mediumActive && !activated) {

            const timeout = setTimeout(() => {
                setActivated(true)
            }, 2000)

            return () => {
                clearTimeout(timeout)
            }

        }

    }, [mediumActive, activated, setActivated])

    useEffect(() => {

        if (!medium) {
            setActivated(false)
        }

    }, [medium, setActivated])

    const active = activated || closeActivated

    useEffect(() => {

        if (active) {

            addAvailableFoodSource(id)

            sendDucklingMessage({
                type: DucklingMessageType.FOOD_SOURCE,
                data: {
                    inRange: true,
                    id,
                }
            })

            return () => {

                removeAvailableFoodSource(id)

                sendDucklingMessage({
                    type: DucklingMessageType.FOOD_SOURCE,
                    data: {
                        inRange: false,
                        id,
                    }
                })
            }

        }

    }, [active, id])

    return null
}

const RangeHandlers: React.FC = () => {

    const range = useRangeElements(state => state.range)

    return (
        <>
            {
                Object.entries(range).map(([uuid, data]) => {
                    return <RangeElement id={data.id}
                                         short={data.short}
                                         medium={data.medium}
                                         rangeType={data.rangeType}
                                         key={uuid}/>
                })
            }
        </>
    )
}

export default RangeHandlers