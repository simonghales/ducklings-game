import React from "react";
import Duckling, {getDucklingRefKey} from "./components/Duckling/Duckling";

const Ducklings: React.FC = () => {
    return (
        <>
            <Duckling id={0} followRefKey={`player`} initialX={0} initialY={-1.1}/>
            <Duckling id={1} followRefKey={getDucklingRefKey(0)} initialX={0} initialY={-1.85}/>
            <Duckling id={2} followRefKey={getDucklingRefKey(1)} initialX={0} initialY={-2.6}/>
            <Duckling id={3} followRefKey={getDucklingRefKey(2)} initialX={0} initialY={-3.35}/>
        </>
    );
};

export default Ducklings;