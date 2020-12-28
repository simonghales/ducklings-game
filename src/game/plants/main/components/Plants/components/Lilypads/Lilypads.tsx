import React from "react"
import DuckWeed from "../../../../../../../components/Game/components/DuckWeed/DuckWeed";
import {LilypadClump, lilypadClumps} from "../../../../../shared/data";

const LilypadsClump: React.FC<{
    clump: LilypadClump
}> = ({clump}) => {
    const {lilypads, position} = clump
    return (
        <>
            {
                lilypads.map((lilypad) => (
                    <DuckWeed key={lilypad.id} id={lilypad.id} initialPosition={[lilypad.position[0] + position[0], lilypad.position[1] + position[1]]}/>
                ))
            }
        </>
    )
}

const Lilypads: React.FC = () => {
    return (
        <>
            <LilypadsClump clump={lilypadClumps[0]}/>
            <LilypadsClump clump={lilypadClumps[1]}/>
            <LilypadsClump clump={lilypadClumps[2]}/>
        </>
    )
}

export default Lilypads