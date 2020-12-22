import * as React from "react"
import {RangeType, useRangeElements} from "../../state/area";
import {useEffect, useState} from "react";
import {DucklingMessageType, sendDucklingMessage} from "../../../../../../messaging/ducklings";
import {ValidUUID} from "../../../../../../utils/ids";

const RangeElement: React.FC<{
    id: string,
    short: boolean,
    medium: boolean,
    rangeType: RangeType,
}> = ({id, short, medium, rangeType}) => {

    const [closeActivated, setCloseActivated] = useState(false)
    const [activated, setActivated] = useState(false)

    /*

    after 1200, set close activated

    after close activated, wait 500 and set activated



     */

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

    useEffect(() => {

        if (!medium) {
            setActivated(false)
        }

    }, [medium, setActivated])

    const active = activated || closeActivated

    useEffect(() => {

        if (active) {

            sendDucklingMessage({
                type: DucklingMessageType.FOOD_SOURCE,
                data: {
                    inRange: true,
                    id,
                }
            })

            return () => {
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