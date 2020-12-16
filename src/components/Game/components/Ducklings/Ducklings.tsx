import React from "react";
import Duckling, {getDucklingRefKey} from "./components/Duckling/Duckling";
import {useDucklingsStore} from "../../../../global/state/ducklings";

const Ducklings: React.FC = () => {

    const ducklings = useDucklingsStore(state => state.ducklings)

    const sortedDucklings = Object.values(ducklings).sort((duckA, duckB) => (duckA.position ?? 999) - (duckB.position ?? 999))

    console.log('sortedDucklings', sortedDucklings)

    return (
        <>
            {
                sortedDucklings.map((duck, index) => (
                    <Duckling key={duck.id} id={duck.id} position={duck.position} closestDuckRefKey={index === 0 ? "player" : getDucklingRefKey(sortedDucklings[index - 1].id)} initialX={0} initialY={-1.1 - (index * 0.75)}/>
                ))
            }
        </>
    );
};

export default Ducklings;