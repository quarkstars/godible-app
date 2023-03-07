import React, { ReactNode, useEffect, useState } from 'react'

interface IThumbnailProps {
    children?: ReactNode,
    size?: number,
    imageUrl?: string,
    onClick?: Function,
    onCornerClick?: Function,
    cornerImageUrl?: string,
    overlayColor?: string,
    scale?: number,
    hoveringCornerState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    cornerIsLarger?:boolean,
    backgroundSize?:string,
}

import { motion, useAnimationControls } from "framer-motion"
import { bookOutline, eye, search } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';


const Thumbnail = (props: IThumbnailProps) => {
    const size = (props.size) ? props.size : "100%";
    const imageUrl = (props.imageUrl) ? `url(${props.imageUrl}) no-repeat center center`: undefined;
    const backgroundSize = (props.backgroundSize) ? props.backgroundSize : "cover";

    const [hoveringCorner, setHoveringCorner] = useState<boolean>(false)

    const controls = useAnimationControls()
    
    useEffect(() => {
        if (!props.scale) return;
        controls.start({ scale: props.scale });
    }, [props.scale])

    console.log("backgroundSize", backgroundSize);

    return (
        <motion.div 
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg"
            animate={controls}
            style={{
                width: size, height: size,
                background: imageUrl,
                backgroundSize: backgroundSize,
                cursor: props.onClick? "pointer" : "default",
            }}
            onClick={(e) => {
                if (props.onClick) props.onClick();
            }}

        >
            <div
                className="relative flex flex-col items-center justify-center overflow-hidden bg-opacity-50 rounded-lg"
                style={{
                    width: size, height: size,
                    backgroundColor: props.overlayColor ? props.overlayColor+"70": undefined
                    
                }}

            >
            {props.children}
            {props.cornerImageUrl &&
                <>
                <div 
                    className="absolute flex items-end justify-start p-2"
                    style={{width: size, height: size}}
                >
                    <div 
                        className="overflow-hidden rounded-md "
                        style={{
                            width: props.cornerIsLarger? "50%" : "20%", height: props.cornerIsLarger? "50%" :"20%",
                            backgroundImage: `url(${props.cornerImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                        }}
                    >
                    </div>
                </div>
                {props.onCornerClick &&
                    <div 
                        className="absolute flex items-end justify-start p-2"
                        style={{width: size, height: size}}
                    >
                        <div 
                            className="z-10 flex items-center justify-center overflow-hidden bg-opacity-50 rounded-md bg-dark"
                            style={{
                                width: "20%", height: "20%",
                                opacity: hoveringCorner ? 1 : 0
                            }}
                            onMouseEnter={()=>setHoveringCorner(true)}
                            onMouseLeave={()=>setHoveringCorner(false)}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (props.onCornerClick) props.onCornerClick();
                            }}
                        >
                            <IonIcon icon={bookOutline} color="fullblack" />
                        </div>
                    </div>
                }
                </>
            }

            </div>
        </motion.div>
    )
}

export default Thumbnail