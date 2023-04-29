import React, { ReactNode, useRef, useState, useLayoutEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import useMeasure from 'react-use-measure'

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";

interface ISlideListProps {
    isCarousel?: boolean,
    spaceBetween?: number,
    hasDots?: boolean,
    children?: ReactNode,
    idealWidth?: number,
    setItemWidth?: Function, //TODO: Make react dispatch
}

export default function SlideList(props:ISlideListProps) {
    let modules = [Navigation];
    if (props.hasDots) {
        modules.push(Pagination);
    }

    //Calculate width and count of items
    const [slideContainer, bounds] = useMeasure();
    const [itemCount, setItemCount] = useState<number>(1);
    useLayoutEffect(() => {
        if (!bounds.width || !props?.idealWidth || !props.setItemWidth) return;
        let itemCount = Math.round(bounds.width/props.idealWidth);
        let itemWidth = (props.spaceBetween) ? (bounds.width/itemCount)-(props.spaceBetween*(itemCount-1)) : bounds.width/props.idealWidth;
        props.setItemWidth(itemWidth)
        setItemCount(itemCount);
    }, [bounds.width, props.idealWidth, props.setItemWidth])

    return (
        <div ref={slideContainer}>
            <Swiper
                slidesPerView={props.isCarousel ? itemCount : 1}
                spaceBetween={props.spaceBetween||0}
                keyboard={{
                    enabled: true,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={modules}
                className="mySwiper"
            >
                {props.children}
            </Swiper>
        </div>
    );
}
