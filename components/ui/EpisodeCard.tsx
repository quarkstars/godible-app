import React, { useContext, useState } from 'react'
import Thumbnail from './Thumbnail'
import { IEpisode, IList } from 'data/types'
import { Player, UserState } from 'components/AppShell'
import { text, userDefaultLanguage } from 'data/translations'
import { IonRippleEffect, useIonRouter } from '@ionic/react'
import useEpisode from 'hooks/useEpisode'

interface IEpisodeCardProps {
    size: number,
    episode: IEpisode,
    index: number,
    list: IList,
}

export const EpisodeCard = (props: IEpisodeCardProps) => {

	const router = useIonRouter();

    //Prep episode data
    const {
      appendEpisodeStrings
    } = useEpisode();

    const episode = appendEpisodeStrings(props.episode)
    
    // Handle Click
    const player = useContext(Player);
    const handleEpisodeClick = (e) => {
        e.preventDefault();
        player.setIsAutoPlay(true);
        player.setList(props.list);
        player.setIndex(props.index);
        router.push(episode._path!);
        setHovering(true);
    }


    const [hovering, setHovering] = useState<boolean>(false)


    return (
        <div 
            className='flex flex-col items-center justify-start py-4 cursor-pointer bg-dark dark:bg-light rounded-xl hover:opacity-80' 
            style={{width: props.size}}
            onMouseEnter={()=>setHovering(true)}
            onMouseLeave={()=>setHovering(false)}
            onClick={handleEpisodeClick}
        >
            <Thumbnail 
                size={props.size-32} 
                overlayColor='#000000'
                cornerImageUrl={episode._bookImageUrl}
                onCornerClick = {() => {
                    if (episode._bookPath) router.push(episode._bookPath)
                }}
                imageUrl={episode.imageUrl}
                onClick = {() => {/* Handle Episode click on parent */}}
                scale={hovering ? 1.05 : 1}
            >
                <span className="text-4xl font-bold text-white dark:text-white">
                    {episode.number}
                </span>
            </Thumbnail>
            <span 
                className="px-4 pt-2 pb-0 font-medium text-md max-h-20 line-clamp-2 "
            >
                {episode._fullTitle}
            </span>
        </div>
    )
}
