import { IonButton, IonButtons, IonContent, IonIcon, IonItem, useIonPopover } from '@ionic/react';
import { IEpisode, IList, ISpeech } from 'data/types';
import { addCircleOutline, arrowForward, chevronForward, playCircle } from 'ionicons/icons';
import React, { useState, useMemo, useContext } from 'react'
import Thumbnail from './Thumbnail';
import { UserState } from 'components/AppShell';
import { userDefaultLanguage } from 'data/translations';

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
    language
  } = useContext(UserState);
  const lang = (language) ? language : userDefaultLanguage;
  const bookImageUrl = list.episodes[0]?.book?.imageUrl;
  const firstEpisode = list.episodes[0];
  const lastEpisode = list.episodes[list.episodes.length-1]
  const metaData = list.metaData?.[lang];
  const metaDataBlocks:string[] = (metaData) ? metaData.split(/\r?\n/) : undefined;

  const [presentDetails, dismissDetails] = useIonPopover(SpeechDetails, {
      onDismiss: (data: any, role: string) => dismissDetails(data, role),
      bookTitle: firstEpisode._bookTitle || firstEpisode.book?.title?.[lang],
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
      className='flex items-center cursor-pointer py-1'
      onClick={(e: any) => {
          e.stopPropagation();
          presentDetails({
          event: e,
          onDidDismiss: (e: CustomEvent) => {},
        })}
      }
    >
     <Thumbnail
      imageUrl={bookImageUrl}
      size={64}
      overlayColor='#000000'
     >
      <div className="flex flex-col font-bold text-white items-center">
        <span>{firstEpisode.number}</span>
        <span className="text-xs leading-none font-medium">to</span>
        <span>{lastEpisode.number}</span>
      </div>
     </Thumbnail>
    </div>
    <div className='flex flex-col'>
      <div className='flex space-x-1 items-center'>
        <span className='pl-3 line text-light font-medium text-md'>Speech</span>
      
        <div className="w-4 h-4 overflow-hidden rounded-lg hidden xs:block" >
          <img src={firstEpisode.imageUrl} alt={firstEpisode.number?.toString()} />
        </div>
        <div className="hidden xs:block">
          <IonIcon color="medium" icon={chevronForward} /> 
        </div>
        <div className="w-4 h-4 overflow-hidden rounded-lg hidden xs:block" >
          <img src={lastEpisode.imageUrl} alt={lastEpisode.number?.toString()} />
        </div>
        <span className='line text-medium italic text-sm hidden sm:block pl-4'>{`${list.episodes.length} Episodes `}</span>

      </div>

      <div className="leading-tight line-clamp-2 flex space-x-1 pl-3 font-medium text-md items-center">
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