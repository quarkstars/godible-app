import { IonButton, IonButtons, IonContent, IonIcon, IonItem, useIonPopover } from '@ionic/react';
import { IEpisode } from 'data/types';
import { addCircleOutline, chevronForward, playCircle } from 'ionicons/icons';
import React, { useState, useMemo } from 'react'
import Thumbnail from './Thumbnail';

interface IEpisodeListItemProps {
  episode: IEpisode,
  isActive?: boolean,
  onPlay?: (e: any) => void,
  onAdd?: (e: any) => void,
  customSubText?: string,
}

const EpisodeListItem = (props: IEpisodeListItemProps) => {
  const episode = props.episode;

  const [presentDetails, dismissDetails] = useIonPopover(EpisodeDetails, {
      onDismiss: (data: any, role: string) => dismissDetails(data, role),
      episode
  });

  let highlight = (props.isActive) ? "light" : undefined;
  let weight = (props.isActive) ? "font-bold" : "font-medium";

  let textHighlighted = useMemo(() => {
    if (!episode.textHighlighted) return <></>;
    const segments = episode.textHighlighted.replaceAll("\\n", " ").split(/(<em>.*?<\/em>)/);

    return (
      <span>
        {segments.map((segment, index) => {
          if (segment.startsWith("<em>") && segment.endsWith("</em>")) {
            const innerText = segment.substring(4, segment.length - 5);
            return (
              <span key={index}>
                <span className="bg-primary text-light">{innerText}</span>
              </span>
            );
          } else {
            return <span key={index}>{segment}</span>;
          }
        })}
      </span>
    );
  }, [episode.textHighlighted]);


  return (
    <IonItem color={highlight}
      onClick={(e: any) => {
        e.preventDefault();
        if (props.onPlay) props.onPlay(e)
      }}
      button
    >
    <div className={`w-10 h-${episode.textHighlighted ? "16" : "10"} overflow-hidden rounded-lg cursor-pointer`} 
      onClick={(e: any) => {
          e.stopPropagation();
          presentDetails({
          onDidDismiss: (e: CustomEvent) => {},
        })
      }}
      style={{minWidth: "40px"}}
    >
      <Thumbnail  imageUrl={episode.thumbUrl} size={40} />
    </div>
    <div className='flex flex-col'>
      <span className={`pl-3 line  ${weight}`}>{`Episode ${episode.number}`}</span>
      <div className={`flex space-x-1 pl-3 text-light dark:text-dark font-medium text-xs items-center ${weight}`}>
        {!props.customSubText && <span className="hidden truncated xs:inline">{episode?._bookTitle}</span>}
        {(episode?._chapterName && !props.customSubText) && <span className="hidden xs:inline"><IonIcon icon={chevronForward} /></span> }
        {(episode?._chapterName &&  !props.customSubText ) && <span className="truncated">{episode?._chapterName}</span>}
      </div>
      {episode.textHighlighted && <span className="pl-3 mb-1 text-xs truncated text-medium line-clamp-2 highlighted-text">{textHighlighted}</span>}
    </div>
    <IonButtons slot="end">
      <IonButton>
        <IonIcon icon={playCircle} slot="icon-only" />
      </IonButton>
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


const EpisodeDetails = ({episode}) => {
  const metaDataComponent = useMemo(() => {
    if (!episode?._metaDataBlocks) return;
    return episode?._metaDataBlocks.map((block:string, index) => {
      return <div className="w-full pb-1" key={block+index}>{block}</div>
    })
  }, 
  [episode])
  return (    
    <IonContent class="ion-padding">
    {episode?._bookTitle && <span className="pb-2 pr-2 font-bold">{episode?._bookTitle}</span>}
    <br/>
    {episode?._bookTitle && metaDataComponent}
    <br/>
  </IonContent>  )
}


export default EpisodeListItem