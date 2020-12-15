import React, {useCallback} from "react";
import styled from "styled-components";
import {useWindowSize} from "@react-hook/window-size";
import {playerInputsState} from "../Player/state/inputs";
import {playerState} from "../../../../global/state/player";

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

const Inputs: React.FC = ({children}) => {

    const [
        width,
        height,
    ] = useWindowSize()

    const [centerX, centerY] = [width / 2, height / 2]

    const onStart = useCallback((event: any) => {
        const position = getClientXY(event)
        if (!position) return
        const vector = calcVector(position, [playerState.screenPosX, playerState.screenPosY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
        playerInputsState.active = true
    }, [centerX, centerY])

    const onEnd = useCallback((event: any) => {
        const position = getClientXY(event)
        if (!position) return
        const vector = calcVector(position, [playerState.screenPosX, playerState.screenPosY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
        playerInputsState.active = false
    }, [centerX, centerY])

    const onMove = useCallback((event: any) => {
        const position = getClientXY(event)
        if (!position) return
        const vector = calcVector(position, [playerState.screenPosX, playerState.screenPosY])
        playerInputsState.yVel = vector[0] * -1
        playerInputsState.xVel = vector[1]
    }, [centerX, centerY])

    return (
        <StyledContainer onTouchStartCapture={onStart} onMouseDownCapture={onStart} onTouchEndCapture={onEnd} onMouseUpCapture={onEnd} onTouchMoveCapture={onMove} onMouseMoveCapture={onMove}>
            {children}
        </StyledContainer>
    );
};

export default Inputs;