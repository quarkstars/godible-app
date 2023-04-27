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
  onClick?: (e: any) => void,
  onDelete?: (e: any, listId: string) => void,
  isReordering?: boolean
  isAddingEpisode?: boolean,
  disabled?: boolean,
}

const ListListItem = (props: IListListItemProps) => {
  const list = props.list;

  const {
    user
  } = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;
  // const bookImageUrl = list.episodes[0]?.book?.imageUrl;
  const lastEpisode = list.episodes[list.episodes.length-1] as IEpisode;
  const firstEpisode = list.episodes[0] as IEpisode;
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
      onDelete: (e, listId: string) => {if (props.onDelete) props.onDelete(e, listId)},
  });

  return (
    <IonItem
      onClick={(e: any) => {
        e.preventDefault();
        if (props.onClick) props.onClick(e)
      }}
      button={props.isReordering ? false : true}
      disabled={props.disabled}
    >
    <div 
      className='flex items-center py-1 cursor-pointer'
      onClick={(e: any) => {
          presentDetails({
          event: e,
          onDidDismiss: (e: CustomEvent) => {},
        })}
      }
    >
     <Thumbnail
      imageUrl={list.name === "Bookmarks" ? firstEpisode?.thumbUrl : lastEpisode?.thumbUrl }
      size={64}
      overlayColor='#000000'
     >
      <div className="flex flex-col items-center font-bold text-white">
        {list.name === "Bookmarks" ?
          <IonIcon icon={bookmark} size="large" />
        :
          <IonIcon icon={listIcon}  size="large" />
        }
      </div>
     </Thumbnail>
    </div>
    <div className='flex flex-col'>
      <div className='flex items-center space-x-1'>
        <span className='pl-3 text-sm font-medium text-medium line text-md'>{list.name === "Saved" ? "Saved" : `List`}</span>
      
        
        <span className='pl-4 text-sm italic line text-medium'>{`${list.episodes.length} Episodes `}</span>

      </div>
      {list.name !== "Saved" &&
        <div className="flex items-center pl-3 space-x-1 font-medium leading-tight line-clamp-1 text-md">
          {list.name}
        </div>
      }
    </div>
    {props.isReordering ? 
      <IonIcon icon={swapVertical} color="primary" slot="end" />
    :

      <IonButtons slot="end">
          {props.onPlay &&
          <div className= "hidden xs:block">
            <IonButton
              onClick={(e: any) => {
                  e.stopPropagation();
                  if (props.onPlay) props.onPlay(e)
              }}
            >
              <IonIcon icon={playCircle} slot="icon-only" />
            </IonButton>
          </div>
          }
          {(list.name !== "Bookmarks" && !props.isAddingEpisode )&&
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


const ListMenu = ({list, onDelete, onDismiss}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton 
                  fill="clear" 
                  expand="block" 
                  onClick={(e) => {
                    onDelete(e, list.objectId)
                    onDismiss();
                  }}
                >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="danger" />
                        <IonLabel color="danger">Delete List</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
  </IonContent>  
  )
}


export default ListListItem