import React, {useCallback, useEffect, useState} from "react"
import {Html} from "@react-three/drei";
import styled from "styled-components";
import {useDucklingContext} from "../../context";
import {useProxy} from "valtio";
import {useSpring, animated} from 'react-spring'

const StyledContainer = styled.div`
  text-transform: uppercase;
  color: white;
  pointer-events: none;
`

const Quack: React.FC = () => {

    const {state} = useDucklingContext()
    const {lastQuack} = useProxy(state)
    const [initialQuack] = useState(lastQuack)
    const [quacking, setQuacking] = useState(false)
    const props = useSpring({opacity: quacking ? 1 : 0, from: {opacity: 0}})

    const playQuack = useCallback(() => {
        setQuacking(true)
    }, [setQuacking])

    useEffect(() => {

        if (quacking) {
            const timeout = setTimeout(() => {
                setQuacking(false)
            }, 1000)
            // sometimes was never set to false...
            // return () => {
            //     clearTimeout(timeout)
            // }
        }

    }, [quacking, setQuacking])

    useEffect(() => {

        if (lastQuack !== initialQuack) {
            playQuack()
        }

    }, [lastQuack, initialQuack, playQuack])

    return (
        <group position={[0, 1, 2]}>
            <Html center>
                <StyledContainer>
                    <animated.div style={props}>
                        quack!
                    </animated.div>
                </StyledContainer>
            </Html>
        </group>
    )
}

export default Quack