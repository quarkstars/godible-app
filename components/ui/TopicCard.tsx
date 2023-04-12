import React, { useContext, useEffect, useState } from 'react'
import Thumbnail from './Thumbnail'
import { IEpisode, IList, ITopic } from 'data/types'
import { Player } from 'components/AppShell'
import { text, userDefaultLanguage } from 'data/translations'
import { IonRippleEffect, useIonRouter } from '@ionic/react'
import { motion, useAnimationControls } from "framer-motion"

interface ITopicCardProps {
    size: number,
    topic: ITopic,
    index: number,
}

export const TopicCard = (props: ITopicCardProps) => {

	const router = useIonRouter();


    const topic = props.topic
    
    // Handle Click
    const player = useContext(Player);
    const handleTopicClick = (e) => {
        e.preventDefault();
        router.push("/search?topic="+topic.slug!);
        setHovering(true);
    }


    const [hovering, setHovering] = useState<boolean>(false)

    const controls = useAnimationControls()
    useEffect(() => {
        if (hovering) controls.start({ scale: 1.2 });
        else controls.start({ scale: 1 });
    }, [hovering])

    return (
        
        <div 
            onMouseEnter={()=>setHovering(true)}
            onMouseLeave={()=>setHovering(false)}
        >
            <Thumbnail 
                size={props.size}
                imageUrl={topic.imageUrl}
                overlayColor='#000000'
                key={props.index}
                onClick={(e) => {handleTopicClick(e)}}
            >
                <motion.div animate={controls} className="flex justify-center w-full">
                    <span className="w-full px-2 text-xl font-bold text-center text-white">{topic.name?.english}</span>
                </motion.div>
        </Thumbnail>
      </div>
    )
}
