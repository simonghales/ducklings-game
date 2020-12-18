import * as React from "react"
import {useDucklings} from "../../state/ducklings";
import Duckling from "../Duckling/Duckling";

const Ducklings: React.FC = () => {

    const ducklings = useDucklings()

    return (
        <>
            {
                ducklings.map(({id}) => (
                    <Duckling id={id} key={id}/>
                ))
            }
        </>
    )
}

export default Ducklings