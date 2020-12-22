import React from "react";
import LgFoodSource from "../../components/LgFoodSource/LgFoodSource";
import {tempFoodSourceData} from "../../data/foodSource";

const PondScene: React.FC = () => {
    const food = Object.values(tempFoodSourceData)
    return (
        <>
            {
                food.map((foodSource) => (
                    <LgFoodSource data={foodSource} key={foodSource.id}/>
                ))
            }
        </>
    );
};

export default PondScene;