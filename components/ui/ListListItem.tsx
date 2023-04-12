import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonReorder, useIonPopover } from '@ionic/react';
import { IEpisode, IList } from 'data/types';
import { addCircleOutline, arrowForward, bookmark, chevronForward, ellipsisVertical, list as listIcon, listCircle, playCircle, pencil, trash, swapVertical } from 'ionicons/icons';
import React, { useState, useMemo, useContext } from 'react'
import Thumbnail from './Thumbnail';
import { userDefaultLanguage } from 'data/translations';
import { UserState } from 'components/UserStateProvider';

interface IListListItemProps {
  list: IList,
  onPlay?: (e: any) => void,
  isReordering?: boolean
}

const ListListItem = (props: IListListItemProps) => {
  const list = props.list;

  const {
    user
  } = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;
  // const bookImageUrl = list.episodes[0]?.book?.imageUrl;
  const lastEpisode = list.episodes[list.episodes.length-1] as IEpisode;
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
      button={props.isReordering ? false : true}
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
      imageUrl={lastEpisode?.imageUrl}
      size={64}
      overlayColor='#000000'
     >
      <div className="flex flex-col items-center font-bold text-white">
        {list.name === "Bookmarked Episodes" ?
          <IonIcon icon={bookmark} size="large" />
        :
          <IonIcon icon={listIcon}  size="large" />
        }
      </div>
     </Thumbnail>
    </div>
    <div className='flex flex-col'>
      <div className='flex items-center space-x-1'>
        <span className='pl-3 font-medium line text-light dark:text-dark text-md'>{list.name === "Saved" ? "Saved" : `List`}</span>
      
        
        <span className='hidden pl-4 text-sm italic line text-medium sm:block'>{`${list.episodes.length} Episodes `}</span>

      </div>
      {list.name !== "Saved" &&
        <div className="flex items-center pl-3 space-x-1 font-medium leading-tight line-clamp-2 text-md">
          {list.name}
        </div>
      }
    </div>
    {props.isReordering ? 
      <IonIcon icon={swapVertical} color="primary" slot="end" />
    :

      <IonButtons slot="end">
          <div className= "hidden xs:block">
            <IonButton>
              <IonIcon icon={playCircle} slot="icon-only" />
            </IonButton>
          </div>
          {list.name !== "Bookmarked Episodes" &&
            <IonButton
              onClick={(e: any) => {
                  e.stopPropagation();
                  presentMenu({
                  event: e,
                  onDidDismiss: (e: CustomEvent) => {},
                  side: "left",
                })
              }}
            
            >
              <IonIcon icon={ellipsisVertical} slot="icon-only" />
            </IonButton>
          }
      </IonButtons>
    }
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
                <div className="flex-grow py-2"></div>
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