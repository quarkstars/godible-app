import React, { useContext, useState } from 'react'
import Thumbnail from './Thumbnail'
import { IEpisode, IList } from 'data/types'
import { Player, UserState } from 'components/AppShell'
import { text, userDefaultLanguage } from 'data/translations'
import { IonRippleEffect, useIonRouter } from '@ionic/react'

interface IEpisodeCardProps extends IEpisode {
    size: number,
    index: number,
    list: IList,
}

export const EpisodeCard = (props: IEpisodeCardProps) => {

	const router = useIonRouter();

    //Prep episode data
    const {
      language
    } = useContext(UserState);
    const lang = (language) ? language : userDefaultLanguage;
    const bookImageUrl = props.book?.imageUrl;
    const bookPath = (props.book?.slug) ? "/book/" + props.book?.slug : undefined;
    const episodePath = "/episode/" + props.slug;
    const imageUrl =  props.imageUrl;
    const number =  props.number;
    let bookTitle = props.book?.title?.[lang];
    //If bookTitle exists but not in user's language, use book's default language
    if (!bookTitle && props.book?.title) bookTitle = props.book.title[props.book.title.defaultLanguage];
    let title = (bookTitle) ? `${bookTitle} ${text["Episode"][lang]} ${number}` : undefined;
    if (props.customTitle) title = props.customTitle;
    if (!title) title = text["Episode"][lang]+ " " + props.number

    // Handle Click
    const player = useContext(Player);
    const handleEpisodeClick = (e) => {
        e.preventDefault();
        player.setIsAutoPlay(true);
        player.setList(props.list);
        player.setIndex(props.index);
        router.push(episodePath);
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
                cornerImageUrl={bookImageUrl}
                onCornerClick = {() => {
                    if (bookPath) router.push(bookPath)
                }}
                imageUrl={imageUrl}
                onClick = {() => {/* Handle Episode click on parent */}}
                scale={hovering ? 1.05 : 1}
            >
                <span className="text-4xl font-bold text-white dark:text-white">
                    {number}
                </span>
            </Thumbnail>
            <span 
                className="px-4 pt-5 pb-2 text-lg font-medium max-h-20 line-clamp-2 "
            >
                {title}
            </span>
        </div>
    )
}
