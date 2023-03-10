import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import lottie from "lottie-web";
import data from './animation/BGLeftBottom.json';

const AniImg = styled.div`
z-index : -2;
max-height: initial;
overflow: hidden;

`;

const Wrapper = styled.div`
    width: 50%;
    left : 0px;
    z-index : -2;
    position: fixed;
    left:0;
    bottom:-3px;

`;

function BGLeftBottomAnimation(){
    const aniBox = useRef();

    useEffect(()=>{
        lottie.loadAnimation({
            container : aniBox.current,
            renderer : 'svg',
            loop: true,
            autoplay : true,
            animationData : data,
        })

    },[]);

    return(
        <Wrapper>
            <AniImg ref={aniBox}></AniImg>
        </Wrapper>
    );
};

export default BGLeftBottomAnimation;