import React, {useCallback} from "react";
import styled from "styled-components";
import {useWindowSize} from "@react-hook/window-size";
import {playerInputsState} from "../Player/state/inputs";
import {playerState} from "../../../../global/state/player";
import {Simulate} from "react-dom/test-utils";
import {numLerp} from "../../../../utils/numbers";

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
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

const calcVector = ([x, y]: [number, number], center: [number, number]): [number, number] => {

    const angle = Math.atan2((x - center[0]), (y - center[1]))
    const xVector = Math.cos(angle)
    const yVector = Math.sin(angle)

    return [xVector, yVector]

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
        localState.referenceX = playerState.screenPosX
        localState.referenceY = playerState.screenPosY
        const vector = calcVector(position, [localState.referenceX, localState.referenceY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
        playerInputsState.active = true
    }, [centerX, centerY])

    const onEnd = useCallback((event: any) => {
        if (!playerInputsState.active) return
        const position = getClientXY(event)
        if (!position) return
        const vector = calcVector(position, [localState.referenceX, localState.referenceY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
        playerInputsState.active = false
    }, [centerX, centerY])

    const onMove = useCallback((event: any) => {
        const position = getClientXY(event)
        if (!position) return
        localState.referenceX = numLerp(playerState.screenPosX, localState.referenceX, 0.5)
        localState.referenceY = numLerp(playerState.screenPosY, localState.referenceY, 0.5)
        const vector = calcVector(position, [localState.referenceX, localState.referenceY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
        // todo - calculate distance / threshold...
    }, [centerX, centerY])

    return (
        <StyledContainer onTouchStartCapture={onStart} onMouseDownCapture={onStart} onTouchEndCapture={onEnd} onMouseUpCapture={onEnd} onTouchMoveCapture={onMove} onMouseMoveCapture={onMove}>
            {children}
        </StyledContainer>
    );
};

export default Inputs;