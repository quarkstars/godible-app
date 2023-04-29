import React, { ReactNode, useRef, useState, useLayoutEffect } from "react";
// Import Swiper React components
import useMeasure from 'react-use-measure'


interface ISlideListProps {
    spaceBetween?: number,
    children?: ReactNode,
    idealWidth?: number,
    setItemWidth?: Function, //TODO: Make react dispatch
}

export default function CardList(props:ISlideListProps) {


    //Calculate width and count of items
    const [container, bounds] = useMeasure();
    const [itemCount, setItemCount] = useState<number>(1);
    useLayoutEffect(() => {
        if (!bounds.width || !props?.idealWidth || !props.setItemWidth) return;
        let itemCount = Math.round(bounds.width/props.idealWidth);
        let itemWidth = (props.spaceBetween) ? (bounds.width/itemCount)-(props.spaceBetween) : bounds.width/props.idealWidth;
        props.setItemWidth(itemWidth)
        setItemCount(itemCount);
    }, [bounds.width, props.idealWidth, props.setItemWidth])

    return (
        <div 
            ref={container} 
            className="flex flex-wrap w-full"
            style={{
                gap: props.spaceBetween || 10,
            }}
        >
                {props.children}
        </div>
    );
}
