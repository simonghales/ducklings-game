import React from "react"
import DuckWeed from "../../../../../components/Game/components/DuckWeed/DuckWeed";
import {plants} from "../../../../../shared/data";
import Lilypads from "./components/Lilypads/Lilypads";

const Plants: React.FC = () => {
    return (
        <>
            <Lilypads/>
            {/*{*/}
            {/*    plants.map(({id, position}) => (*/}
            {/*        <DuckWeed id={id} initialPosition={position} key={id}/>*/}
            {/*    ))*/}
            {/*}*/}
        </>
    )
}

export default Plants