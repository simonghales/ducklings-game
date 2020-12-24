import React, {useCallback} from "react";
import styled from "styled-components";
import {useWindowSize} from "@react-hook/window-size";
import {playerInputsState} from "../Player/state/inputs";
import {playerState} from "../../../../global/state/player";
import {Simulate} from "react-dom/test-utils";
import {numLerp} from "../../../../utils/numbers";
import {calcVector} from "../../../../utils/vectors";

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    
    div div {
      pointer-events: none;
    }
    
`;

const getClientXY = (event: any): [number, number] | null => {
    switch (event.type) {
        case "mouseup":
        case "mousedown":
        case "mousemove":
            return [event.clientX, event.clientY]
        case "touchstart":
        case "touchend":
            return [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
        case "touchmove":
            return [event.targetTouches[0].clientX, event.targetTouches[0].clientY]
    }
    return null
}

const localState = {
    referenceX: 0,
    referenceY: 0,
}

const Inputs: React.FC = ({children}) => {

    const [
        width,
        height,
    ] = useWindowSize()

    const [centerX, centerY] = [width / 2, height / 2]

    const onStart = useCallback((event: any) => {
        if (playerInputsState.active) return
        const position = getClientXY(event)
        if (!position) return
        playerInputsState.targetPosition = null
        localState.referenceX = playerState.screenPosX
        localState.referenceY = playerState.screenPosY
        const vector = calcVector(position[0], localState.referenceX, position[1], localState.referenceY)
        playerInputsState.xVel = vector[0]
        playerInputsState.yVel = vector[1] * -1
        playerInputsState.active = true
    }, [centerX, centerY])

    const onEnd = useCallback((event: any) => {
        if (!playerInputsState.active) return
        const position = getClientXY(event)
        if (!position) return
        const vector = calcVector(position[0], localState.referenceX, position[1], localState.referenceY)
        playerInputsState.xVel = vector[0]
        playerInputsState.yVel = vector[1] * -1
        playerInputsState.active = false
    }, [centerX, centerY])

    const onMove = useCallback((event: any) => {
        if (event.type === 'mousemove' && !playerInputsState.active) return
        const position = getClientXY(event)
        if (!position) return
        playerInputsState.targetPosition = null
        localState.referenceX = numLerp(playerState.screenPosX, localState.referenceX, 0.5)
        localState.referenceY = numLerp(playerState.screenPosY, localState.referenceY, 0.5)
        const vector = calcVector(position[0], localState.referenceX, position[1], localState.referenceY)
        playerInputsState.xVel = vector[0]
        playerInputsState.yVel = vector[1] * -1
        // todo - calculate distance / threshold...
    }, [centerX, centerY])

    return (
        <StyledContainer onTouchStartCapture={onStart} onMouseDownCapture={onStart} onTouchEndCapture={onEnd} onMouseUpCapture={onEnd} onTouchMoveCapture={onMove} onMouseMoveCapture={onMove}>
            {children}
        </StyledContainer>
    );
};

export default Inputs;