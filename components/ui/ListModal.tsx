import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonPopover, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover, useIonRouter } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import useEpisodes from 'hooks/useEpisodes';
import { add, addCircle, addCircleOutline, ban, bookmarkOutline, checkmarkCircle, chevronForward, close, closeCircle, ellipsisVertical, eye, pauseCircle, pencil, playCircle, reorderTwo, swapVertical, sync, syncCircle, trash, trashBin, trashOutline } from 'ionicons/icons';
import React, {useRef, useMemo, useState, useContext, useEffect} from 'react'
import TextDivider from './TextDivider';
import { Player } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import useLists from 'hooks/useLists';
import { list } from 'postcss';
import ListListItem from './ListListItem';

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list?: IList,
  //TODO: setList and setIndex should be functions done previously
  setList?: Function,
  setIndex?: Function,
  index?: number,
  isPlaying?: boolean,
  isBookmarks?: boolean,
  isUserList?: boolean,
  isLoading?: boolean,
  router?:  UseIonRouterResult,
  isAddingEpisode?: boolean,
  addEpisodeId?: string,
  isViewOnly?: boolean,
}

const ListModal = (props: IPlayerListModalProps) => {
  return (
    <IonPage>

    <IonContent>
  )
      </IonContent>
    </IonPage>
  )
}

const EpisodeDetails = ({episode}) => {
  return (    
    <IonContent class="ion-padding">
    {episode?._bookTitle && <span className="pb-2 pr-2 font-bold">{episode?._bookTitle}</span>}
    <br/>
    {episode?._bookTitle && <span>{episode?._metaDataBlocks?.join(" \n ")}</span>}
    <br/>
    {/* <IonButton fill="clear" size="small">
      <IonIcon icon={eye}  color="medium" slot="start" />
      Read
    </IonButton> */}
  </IonContent>  )
}

const EpisodeMenu = ({episode, handleRemoveEpisode, onDismiss}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" 
                  onClick={(e) => {
                    handleRemoveEpisode(e, episode.objectId)
                    onDismiss();
                  }}
                >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="danger" />
                        <IonLabel color="danger">Remove</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
  </IonContent>  
  )
}

export default ListModal