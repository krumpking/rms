import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const SCarouselWrapper = styled.div`
  display: flex;
  width: 100%
`;

interface ICarouselSlide {
    active?: boolean;
}

const SCarouselSlide = styled.div<ICarouselSlide>`
  flex: 0 0 auto;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: all 0.5s ease;
  width: 100%;
  padding:20px;
`;

interface ICarouselProps {
    currentSlide: number;
}

const SCarouselSlides = styled.div<ICarouselProps>`
  display: flex;
  ${props =>
        props.currentSlide &&
        css`
      transform: translateX(-${props.currentSlide * 100}%);
    `};
  transition: all 0.5s ease;
  width: 100%
`;

interface IProps {
    children: JSX.Element[];
}

const Carousel = ({ children }: IProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);



    useEffect(() => {

        const sliderAutoRun = setTimeout(() => {
            setCurrentSlide((currentSlide + 1) % activeSlide.length);
        }, 3000);

        return () => {
            clearTimeout(sliderAutoRun);
        }
    }, [currentSlide])





    const activeSlide = children.map((slide, index) => (
        <SCarouselSlide active={currentSlide === index} key={index}>
            {slide}
        </SCarouselSlide>
    ));

    const activeDot = children.map((slide, index) => (
        <div className={currentSlide === index ? "bg-yellow-500 w-2 h-2 rounded-lg mx-2" : "bg-gray-600 w-2 h-2 rounded-lg mx-2"} key={index}>
        </div>
    ))

    const moveSlide = (right: boolean) => {

        if (right) {
            setCurrentSlide((Math.abs(currentSlide) - 1) % activeSlide.length);
        } else {
            setCurrentSlide((Math.abs(currentSlide) + 1) % activeSlide.length);
        }
    }

    return (
        <div className="flex flex-col items-center overflow-hidden">
            <div className="flex flex-row">
                <button >
                    <img src="/images/left.png" />
                </button>
                <SCarouselWrapper>
                    <SCarouselSlides currentSlide={currentSlide}>
                        {activeSlide}
                    </SCarouselSlides>
                </SCarouselWrapper>
                <button>
                    <img src="/images/right.png" />
                </button>
            </div>
            <div className="flex flex-row justify-evenly mt-10">
                {activeDot}
            </div>

        </div >
    );
};

export default Carousel;