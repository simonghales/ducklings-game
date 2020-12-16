import React from "react";
import Duckling, {getDucklingRefKey} from "./components/Duckling/Duckling";
import {useDucklingsStore} from "../../../../global/state/ducklings";
import {getClosestDuckRefKey, getSortedDucklings} from "./shared";

const Ducklings: React.FC = () => {

    const ducklings = useDucklingsStore(state => state.ducklings)

    const sortedDucklings = getSortedDucklings(ducklings)

    return (
        <>
            {
                sortedDucklings.map((duck, index) => (
                    <Duckling key={duck.id}
                              id={duck.id}
                              position={index}
                              closestDuckRefKey={getClosestDuckRefKey(index, sortedDucklings)}
                              initialX={0}
                              initialY={-1.1 - (index * 0.75)}
                    />
                ))
            }
        </>
    );
};

export default Ducklings;