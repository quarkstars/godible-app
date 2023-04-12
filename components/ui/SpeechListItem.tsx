import { IonButton, IonButtons, IonContent, IonIcon, IonItem, useIonPopover } from '@ionic/react';
import { IEpisode, IList, ISpeech } from 'data/types';
import { addCircleOutline, arrowForward, chevronForward, playCircle } from 'ionicons/icons';
import React, { useState, useMemo, useContext } from 'react'
import Thumbnail from './Thumbnail';
import { userDefaultLanguage } from 'data/translations';
import { UserState } from 'components/UserStateProvider';
import { resolveLangString } from 'utils/resolveLangString';

interface ISpeechListItemProps {
  list: ISpeech,
  onPlay?: (e: any) => void,
  onAdd?: (e: any) => void,
  customSubText?: string,
  highlightStrings?: string[]
}

const SpeechListItem = (props: ISpeechListItemProps) => {
  const list = props.list;

  const {
    user
  } = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;
  const episode = list.episodes[0] as IEpisode|undefined;
  const imageUrl = episode?.book?.imageUrl || episode?.imageUrl;
  const firstEpisode = episode;
  const lastEpisode = list.episodes[list.episodes.length-1] as IEpisode;
  const metaData = resolveLangString(list?.metaData, lang);
  const metaDataBlocks:string[]|undefined = (metaData) ? metaData.split("\\n") : undefined;

  const [presentDetails, dismissDetails] = useIonPopover(SpeechDetails, {
      onDismiss: (data: any, role: string) => dismissDetails(data, role),
      bookTitle: firstEpisode?._bookTitle || firstEpisode?.book?.title?.[lang],
      metaDataBlocks,
      name: list.name,
  });

  return (
    <IonItem
      onClick={(e: any) => {
        console.log('clicked')
        e.preventDefault();
        if (props.onPlay) props.onPlay(e)
      }}
      button
    >
    <div 
      className='flex items-center py-1 cursor-pointer'
      onClick={(e: any) => {
          e.stopPropagation();
          presentDetails({
          event: e,
          onDidDismiss: (e: CustomEvent) => {},
        })}
      }
    >
     <Thumbnail
      imageUrl={imageUrl}
      size={64}
      overlayColor='#000000'
     >
      <div className="flex flex-col items-center font-bold text-white">
        <span>{firstEpisode?.number}</span>
        {list.episodes.length > 1 && <>
        <span className="text-xs font-medium leading-none">to</span>
        <span>{lastEpisode?.number}</span>
        </>}
      </div>
     </Thumbnail>
    </div>
    <div className='flex flex-col'>
      <div className='flex items-center space-x-1'>
        <span className='pl-3 font-medium line text-light text-md dark:text-dark'>Speech</span>
      
        {/* <div className="hidden w-4 h-4 overflow-hidden rounded-lg xs:block" >
          <img src={firstEpisode.imageUrl} alt={firstEpisode.number?.toString()} />
        </div>
        <div className="hidden xs:block">
          <IonIcon color="medium" icon={chevronForward} /> 
        </div>
        <div className="hidden w-4 h-4 overflow-hidden rounded-lg xs:block" >
          <img src={lastEpisode.imageUrl} alt={firstEpisode.number?.toString()} />
        </div> */}
        <span className='hidden pl-4 text-sm italic line text-medium sm:block'>{`${list.episodes.length} Episodes `}</span>

      </div>

      <div className="flex items-center pl-3 space-x-1 font-medium leading-tight line-clamp-2 text-md">
        {list.name}
      </div>
    </div>
    <IonButtons slot="end">
      <div className= "hidden xs:block">
        <IonButton>
          <IonIcon icon={playCircle} slot="icon-only" />
        </IonButton>
      </div>
      <IonButton
        onClick={(e: any) => {
            e.stopPropagation();
            if (props.onAdd) props.onAdd(e);
        }}
      >
        <IonIcon icon={addCircleOutline} slot="icon-only" />
      </IonButton>
    </IonButtons>
  </IonItem>
  )
}


const SpeechDetails = ({bookTitle, metaDataBlocks, name}) => {
  const metaDataComponent = useMemo(() => {
    if (!metaDataBlocks) return;
    return metaDataBlocks.map((block:string, index) => {
      return <div className="w-full pb-1"  key={block+index}>{block}</div>
    })
  }, 
  [metaDataBlocks])
  return (    
  <IonContent class="ion-padding">
    {bookTitle && <span className="pb-2 pr-2 font-bold">{bookTitle}</span>}
    <br/>
    {name && <span className="pb-2 pr-2 font-medium">{name}</span>}
    <br/>
    {metaDataBlocks && metaDataComponent}
  </IonContent>  )
}


export default SpeechListItem