import React, { useContext, useEffect, useState } from 'react'
import Thumbnail from './Thumbnail'
import { IBook, IList } from 'data/types'
import { Player } from 'components/AppShell'
import { text, userDefaultLanguage } from 'data/translations'
import { IonAvatar, IonButton, IonChip, IonIcon, IonLabel, IonRippleEffect, useIonRouter } from '@ionic/react'
import { motion, useAnimationControls } from "framer-motion"
import { arrowForward, chevronDown, chevronUp } from 'ionicons/icons'
import { UserState } from 'components/UserStateProvider'
import { resolveLangString } from 'utils/resolveLangString'

interface IBookCardProps {
    size?: number,
    book: IBook,
    isFullWidth?:boolean,
    onClick?: Function,
    showTagline?: boolean,
    showDescription?: boolean,
    showMetaData?: boolean,
    showAuthor?: boolean,
    showBuyLink?: boolean,
    showEpisodesLink?: boolean,
    showReaders?: boolean,
    breakpoint?: string,
}

export const BookCard = (props: IBookCardProps) => {

	const router = useIonRouter();

    const {
        user
      } = useContext(UserState);
    const lang = (user.language) ? user.language : userDefaultLanguage;
    const book = props.book;
    const buyLink = resolveLangString(book?.buyLink, lang)

    const [hovering, setHovering] = useState<boolean>(false)
    const [showMore, setShowMore] = useState<boolean>(false)

    const controls = useAnimationControls()
    
    let scale = (props.isFullWidth) ? 1: 1.1

    useEffect(() => {
        if (!props.onClick) return;
        if (hovering) controls.start({ scale });
        else controls.start({ scale: 1 });
    }, [hovering]);

    return (
        <div 
            className={`flex flex-row flex-wrap items-stretch justify-center ${props.breakpoint ? props.breakpoint: "mobile"}:justify-start p-4 mobile:flex-row bg-dark dark:bg-light rounded-xl ${props.onClick ? "hover:opacity-80 cursor-pointer" : ""}`} 
            onMouseEnter={()=>setHovering(true)}
            onMouseLeave={()=>setHovering(false)}
            onClick = {(e) => {
                if (props.onClick) props.onClick(e);
            }}
        >
            <motion.div className={`w-full overflow-hidden ${props.breakpoint ? props.breakpoint: "mobile"}:w-1/3 flex justify-center`} animate={controls} style={{maxWidth:"290px"}}>
                <div className='w-full h-auto overflow-hidden rounded-lg'>
                    <img 
                        className="w-full"
                    src={book.imageUrl}     
                    />
                </div>
            </motion.div>
            <div className={`flex flex-col flex-grow w-full pl-0 pr-6 justify-evenly mobile:pl-4 mobile:w-2/3 ${(props?.size||768) > 500 ? "pr-10 space-y-4" : "pr-6"}`}>
                <div 
                    className={`pt-2 pb-0 block font-bold leading-tight ${(props?.size||768) > 500 ? "text-xl xs:text-2xl md:text-3xl lg:text:4xl" : "text-md line-clamp-2"}`}
                >
                    {resolveLangString(book?.title, lang)}
                </div>
                {(props.showTagline && resolveLangString(book.tagline, lang)) && 
                <div 
                    className={`pt-2 pb-0 block font-medium leading-tight text-light dark:text-dark line-clamp-2 ${(props?.size||768) > 500 ? "text-xl" : "text-sm"}`}
                >
                    {resolveLangString(book.tagline, lang)}
                </div>
                }
                {(props.showDescription && resolveLangString(book.description, lang)) && 
                <div className="flex flex-col items-start w-full">
                    <div 
                        className={`pt-2 pb-0 block text-light dark:text-dark ${(props?.size||768) > 500 ? "text-md" : "text-sm"} ${showMore ? "" : "line-clamp-4"}`}
                    >
                        {resolveLangString(book.description, lang)}
                    </div>
                    {!props.onClick &&
                    <div className="-ml-2">
                        <IonButton size="small" color="medium" fill="clear" onClick={() => setShowMore(prev=>!prev)}>
                            <IonIcon icon={showMore ? chevronUp: chevronDown} />
                            {!showMore ? "More": "Less"} 
                        </IonButton>
                    </div>
                    }
                </div>
                }
                {(props.showMetaData && resolveLangString(book.metaData, lang)) && 
                <div 
                    className={'pt-2 pb-0 block text-medium text-sm'}
                >
                    {resolveLangString(book.metaData, lang)}
                </div>
                }
                <div className="flex flex-wrap items-center justify-between">
                    {props.showAuthor && book.author && 
                    <div className="flex items-center pb-4 space-x-2">
                            <div className="flex items-center justify-center w-12 h-12 pr-0 overflow-hidden rounded-full min-w-12 min-h-12">
                            <Thumbnail size={48} imageUrl={book.authorImageUrl} />
                            </div>
                            {(book.author && resolveLangString(book.author, lang) && resolveLangString(book.author, lang)!.length > 0) && <span className="font-medium text-light dark:text-dark" style={{maxWidth: "85%"}}>{"by "+resolveLangString(book.author, lang)}</span>}
                    </div>
                    }
                    {props.showEpisodesLink && 
                    <IonButton color="primary">
                        View Episodes
                    </IonButton>
                    }
                    {props.showBuyLink && book.buyLink && 
                    <IonButton 
                        color="dark" 
                        fill="clear" 
                        onClick={(e) => {
                            e.stopPropagation;
                            window.open(buyLink, '_system' /*, 'location=yes' */); 
                        }}
                    >
                        <span className="-ml-2 sm:ml-0">Buy Physical Book</span>
                        <IonIcon slot="end" icon={arrowForward} />
                    </IonButton>
                    }
                </div>
            </div>
        </div>
    )
}
