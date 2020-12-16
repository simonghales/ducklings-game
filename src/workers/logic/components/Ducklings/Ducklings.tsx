import * as React from "react"
import {useProxy} from "valtio";
import {ducklingsState} from "../../state/ducklings";
import Duckling from "../Duckling/Duckling";

const Ducklings: React.FC = () => {

    const ducklingsProxy = useProxy(ducklingsState)

    return (
        <>
            {
                Object.values(ducklingsProxy).map(({id}) => (
                    <Duckling id={id} key={id}/>
                ))
            }
        </>
    )
}

export default Ducklings