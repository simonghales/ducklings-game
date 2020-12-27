import React from "react";
import LgFoodSource from "../../components/LgFoodSource/LgFoodSource";
import LgPlants from "../../../game/plants/logic/components/LgPlants/LgPlants";
import {useFoodSources} from "../../../game/food/logic/state";

const PondScene: React.FC = () => {
    const food = useFoodSources()
    // todo - move food into separate component...
    return (
        <>
            <LgPlants/>
            {
                food.map((foodSource) => (
                    <LgFoodSource id={foodSource} key={foodSource}/>
                ))
            }
        </>
    );
};

export default PondScene;