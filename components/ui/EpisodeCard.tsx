import React, { useContext } from 'react'
import Thumbnail from './Thumbnail'
import { IEpisode } from 'data/types'
import { UserState } from 'components/AppShell'
import { text, userDefaultLanguage } from 'data/translations'
import { useIonRouter } from '@ionic/react'

interface IEpisodeCardProps extends IEpisode {
    size: number,
}

export const EpisodeCard = (props: IEpisodeCardProps) => {

	const router = useIonRouter();


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

    return (
        <div 
            className='flex flex-col items-center justify-start py-4 bg-dark dark:bg-light rounded-xl' 
            style={{width: props.size}}
        >
            <Thumbnail 
                size={props.size-32} 
                overlayColor='#000000'
                cornerImageUrl={bookImageUrl}
                onCornerClick = {() => {if (bookPath) router.push(bookPath)}}
                imageUrl={imageUrl}
                onClick = {() => {router.push(episodePath)}}
            >
                <span className="text-4xl font-bold text-white dark:text-white">
                    {number}
                </span>
            </Thumbnail>
            <span className="px-4 pt-5 pb-2 text-lg font-medium max-h-20 line-clamp-2 ">
                {title}
            </span>
        </div>
    )
}
