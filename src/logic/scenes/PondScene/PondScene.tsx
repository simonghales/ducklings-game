import React from "react";
import LgFoodSource from "../../components/LgFoodSource/LgFoodSource";
import {tempFoodSourceData} from "../../data/foodSource";
import LgPlants from "../../../game/plants/logic/components/LgPlants/LgPlants";

const PondScene: React.FC = () => {
    const food = Object.values(tempFoodSourceData)
    return (
        <>
            <LgPlants/>
            {
                food.map((foodSource) => (
                    <LgFoodSource data={foodSource} key={foodSource.id}/>
                ))
            }
        </>
    );
};

export default PondScene;