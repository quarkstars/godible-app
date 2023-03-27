import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonReorder, useIonPopover } from '@ionic/react';
import { IEpisode, IList } from 'data/types';
import { addCircleOutline, arrowForward, bookmark, chevronForward, ellipsisVertical, list as listIcon, listCircle, playCircle, pencil, trash } from 'ionicons/icons';
import React, { useState, useMemo, useContext } from 'react'
import Thumbnail from './Thumbnail';
import { UserState } from 'components/AppShell';
import { userDefaultLanguage } from 'data/translations';

interface IListListItemProps {
  list: IList,
  onPlay?: (e: any) => void,
}

const ListListItem = (props: IListListItemProps) => {
  const list = props.list;

  const {
    language
  } = useContext(UserState);
  const lang = (language) ? language : userDefaultLanguage;
  // const bookImageUrl = list.episodes[0]?.book?.imageUrl;
  const lastEpisode = list.episodes[list.episodes.length-1];
  const episodes = list.episodes;
  const description = list.description;
  const descriptionBlocks:string[]|undefined = (description) ? description.split(/\r?\n/) : undefined;

  const [presentDetails, dismissDetails] = useIonPopover(DescriptionPopover, {
      onDismiss: (data: any, role: string) => dismissDetails(data, role),
      descriptionBlocks: descriptionBlocks,
      name: list.name,
  });
  const [presentMenu, dismissMenu] = useIonPopover(ListMenu, {
      onDismiss: (data: any, role: string) => dismissMenu(data, role),
      list,
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
      imageUrl={lastEpisode?.imageUrl}
      size={64}
      overlayColor='#000000'
     >
      <div className="flex flex-col font-bold text-white items-center">
        {list.name === "Saved" ?
          <IonIcon icon={bookmark} size="large" />
        :
          <IonIcon icon={listIcon}  size="large" />
        }
      </div>
     </Thumbnail>
    </div>
    <div className='flex flex-col'>
      <div className='flex space-x-1 items-center'>
        <span className='pl-3 line text-light dark:text-dark font-medium text-md'>{list.name === "Saved" ? "Saved" : `List`}</span>
      
        
        <span className='line text-medium italic text-sm hidden sm:block pl-4'>{`${list.episodes.length} Episodes `}</span>

      </div>
      {list.name !== "Saved" &&
        <div className="leading-tight line-clamp-2 flex space-x-1 pl-3 font-medium text-md items-center">
          {list.name}
        </div>
      }
    </div>
    <IonReorder slot="end"></IonReorder>
    <IonButtons slot="end">
        <div className= "hidden xs:block">
          <IonButton>
            <IonIcon icon={playCircle} slot="icon-only" />
          </IonButton>
        </div>
        <IonButton
          onClick={(e: any) => {
              e.stopPropagation();
              presentMenu({
              event: e,
              onDidDismiss: (e: CustomEvent) => {},
            })
          }}
        
        >
          <IonIcon icon={ellipsisVertical} slot="icon-only" />
        </IonButton>
    </IonButtons>
  </IonItem>
  )
}


const DescriptionPopover = ({descriptionBlocks, name}) => {
  const metaDataComponent = useMemo(() => {
    if (!descriptionBlocks) return;
    return descriptionBlocks.map((block:string, index) => {
      return <div className="w-full pb-1"  key={block+index}>{block}</div>
    })
  }, 
  [descriptionBlocks])
  return (    
  <IonContent class="ion-padding">
    {name && <span className="pb-2 pr-2 font-medium">{name}</span>}
    <br/>
    {descriptionBlocks && metaDataComponent}
  </IonContent>  )
}


const ListMenu = ({list}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={pencil} color="medium"/>
                        <IonLabel >Rename</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <div className="flex-grow  py-2"></div>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="danger" />
                        <IonLabel color="danger">Delete</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
  </IonContent>  
  )
}


export default ListListItem