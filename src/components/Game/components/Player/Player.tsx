import React from "react";
import Duck from "../../../../3d/Duck/Duck";
import {useController} from "./hooks/useController";

const Player: React.FC = () => {

    useController()

    return (
        <Duck/>
    );
};

export default Player;