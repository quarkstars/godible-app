import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonPopover, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail, useIonPopover } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import useEpisodes from 'hooks/useEpisodes';
import { add, bookmarkOutline, ellipsisVertical, pauseCircle, playCircle, trash } from 'ionicons/icons';
import React, {useRef, useMemo, useState, useContext} from 'react'
import TextDivider from './TextDivider';
import { Player } from 'components/AppShell';

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list: IList,
  setList: Function,
  setIndex: Function,
  index: number,
  isPlaying?: boolean,
}

const ListModal = (props: IPlayerListModalProps) => {

  const player = useContext(Player);

  //Prep episode data
  const {
    appendEpisodeStrings
  } = useEpisodes();

  let episodes = useMemo(() => {
    if (!props.list?.episodes) return [];
    return props.list?.episodes.map((episode) => {
      return appendEpisodeStrings(episode);
    })
  }, [props.list?.episodes, props.list, props.index])
  
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // Sync location of current Index
    if (props.index === event.detail.from) {
      props.setIndex(event.detail.to);
    }
    else if (event.detail.from < props.index && event.detail.to >= props.index) {
      props.setIndex(prev => prev - 1);
    }
    else if (event.detail.from > props.index && event.detail.to <= props.index) {
      props.setIndex(prev => prev + 1);
    }

    let newEpisodeOrder = event.detail.complete(props.list.episodes);

    props.setList(prev => {return {...prev, episdoes: newEpisodeOrder}});
    // TODO: if the list has an id, update the server

  }


    const [inspectedEpisode, setInspectedEpisode] = useState<IEpisode|undefined>()
    const [presentDetails, dismissDetails] = useIonPopover(EpisodeDetails, {
        onDismiss: (data: any, role: string) => dismissDetails(data, role),
        episode: inspectedEpisode
    });
    const [presentMenu, dismissMenu] = useIonPopover(EpisodeMenu, {
        onDismiss: (data: any, role: string) => dismissDetails(data, role),
        episode: inspectedEpisode
    });


  console.log('episodes', props.list?.episodes)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => props.onDismiss(null, 'close')}>
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>Listening Now</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => props.onDismiss(null, 'save')}>New List</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
        {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
        {episodes.map((episode, index) => {
          let weight = (index === props.index) ? "font-bold" : "font-normal"
          let isCurrent = (player.index === index);
          let isPlaying = (isCurrent && player.isPlaying)
          return(
            <IonItem key={"list-"+episode.objectId}>
              <IonReorder slot="start"></IonReorder>
              <div className="w-8 h-8 overflow-hidden rounded-lg cursor-pointer" 
                onClick={(e: any) => {
                    setInspectedEpisode(episode);
                    presentDetails({
                    event: e,
                    onDidDismiss: (e: CustomEvent) => {setInspectedEpisode(undefined)},
                  })
                }}
              >
                <img  src={episode._bookImageUrl ? episode._bookImageUrl : episode.imageUrl} alt={episode._bookTitle} />
              </div>
              <span className={`pl-3 ${weight}`}>{`Episode ${episode.number}`}</span>
              <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={isPlaying ? pauseCircle : playCircle} slot="icon-only" />
                </IonButton>
                <IonButton
                  onClick={(e: any) => {
                      setInspectedEpisode(episode);
                      presentMenu({
                      event: e,
                      onDidDismiss: (e: CustomEvent) => {setInspectedEpisode(undefined)},
                    })
                  }}
                >
                  <IonIcon icon={ellipsisVertical} slot="icon-only" />
                </IonButton>
              </IonButtons>

              <IonPopover trigger={`context-menu-trigger-${index}`} triggerAction="click">
                <IonContent class="ion-padding">
                  {episode._bookTitle && <span className="pb-2 pr-2 font-bold">{episode._bookTitle}</span>}
                  <br/>
                  {episode._bookTitle && <span>{episode._metaDataBlocks?.join(" \n ")}</span>}
                </IonContent>
              </IonPopover>
            </IonItem>
          )
        })
        }
        </IonReorderGroup>
        </IonList>
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
  </IonContent>  )
}

const EpisodeMenu = ({episode}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={bookmarkOutline}  color="medium" />
                        <IonLabel>Save</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={add} color="medium"/>
                        <IonLabel >Other List</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <TextDivider>!</TextDivider>
                <IonButton fill="clear" expand="block" >
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