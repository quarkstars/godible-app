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
    hoveringCornerState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

import { motion, useAnimationControls } from "framer-motion"
import { bookOutline, eye, search } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';


const Thumbnail = (props: IThumbnailProps) => {
    const size = (props.size) ? props.size : "100%";
    const imageUrl = (props.imageUrl) ? `url(${props.imageUrl}) no-repeat center center`: undefined;

    const [hoveringCorner, setHoveringCorner] = useState<boolean>(false)

    const controls = useAnimationControls()
    
    useEffect(() => {
        if (!props.scale) return;
        controls.start({ scale: props.scale });
    }, [props.scale])

        
    return (
        <motion.div 
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg"
            animate={controls}
            style={{
                width: size, height: size,
                background: imageUrl,
                backgroundSize: 'cover',
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
                            width: "20%", height: "20%",
                            background: `url(${props.cornerImageUrl}) no-repeat center center`,
                            backgroundSize: 'cover'
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