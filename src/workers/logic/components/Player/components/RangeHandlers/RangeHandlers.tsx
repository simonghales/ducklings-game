import * as React from "react"
import {RangeType, useRangeElements} from "../../state/area";
import {useEffect, useState} from "react";
import {DucklingMessageType, sendDucklingMessage} from "../../../../../../messaging/ducklings";

const RangeElement: React.FC<{
    short: boolean,
    medium: boolean,
    rangeType: RangeType,
}> = ({short, medium, rangeType}) => {

    const [activated, setActivated] = useState(false)

    useEffect(() => {
        if (short) {

            if (!activated) {
                const timeout = setTimeout(() => {
                    setActivated(true)
                }, 1200)

                return () => {
                    clearTimeout(timeout)
                }
            }

        }

    }, [short, activated, setActivated])

    useEffect(() => {

        if (!medium) {
            setActivated(false)
        }

    }, [medium, setActivated])

    useEffect(() => {

        if (activated) {

            sendDucklingMessage({
                type: DucklingMessageType.FOOD_SOURCE,
                data: {
                    inRange: true,
                }
            })

            return () => {
                sendDucklingMessage({
                    type: DucklingMessageType.FOOD_SOURCE,
                    data: {
                        inRange: false,
                    }
                })
            }

        }

    }, [activated])

    return null
}

const RangeHandlers: React.FC = () => {

    const range = useRangeElements(state => state.range)

    return (
        <>
            {
                Object.entries(range).map(([uuid, data]) => {
                    return <RangeElement short={data.short}
                                         medium={data.medium}
                                         rangeType={data.rangeType} key={uuid}/>
                })
            }
        </>
    )
}

export default RangeHandlers