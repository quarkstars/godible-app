import React, { ReactNode } from 'react'

interface IThumbnailProps {
    children?: ReactNode,
    size?: number,
    imageUrl?: string,
    onClick?: Function,
    onCornerClick?: Function,
    cornerImageUrl?: string,
    overlayColor?: string,
}

const Thumbnail = (props: IThumbnailProps) => {
    const size = (props.size) ? props.size : "100%";
    const imageUrl = (props.imageUrl) ? `url(${props.imageUrl}) no-repeat center center`: undefined;
    return (
        <div 
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg"
            style={{
                width: size, height: size,
                background: imageUrl,
                backgroundSize: 'cover'
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
            }

            </div>
        </div>
    )
}

export default Thumbnail