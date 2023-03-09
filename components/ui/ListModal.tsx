import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonPage, IonPopover, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import useEpisodes from 'hooks/useEpisodes';
import React, {useRef, useMemo} from 'react'

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list: IList,
  setList: Function,
  setIndex: Function,
  index: number,
}

const ListModal = (props: IPlayerListModalProps) => {

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
    // newEpisodeOrder.splice(event.detail.from, 1);
    // newEpisodeOrder.splice(event.detail.to, 0, props.list.episodes[event.detail.from]);

    props.setList(prev => {return {...prev, episdoes: newEpisodeOrder}});
    // TODO: if the list has an id, update the server

    
  }

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
          <IonTitle>Playing Now</IonTitle>
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
          return(
            <IonItem key={"list-"+episode.objectId}>
              <IonReorder slot="start"></IonReorder>
              <div className="w-8 h-8 overflow-hidden rounded-lg cursor-pointer" id={`context-menu-trigger-${index}`}>
                <img  src={episode._bookImageUrl ? episode._bookImageUrl : episode.imageUrl} alt={episode._bookTitle} />
              </div>
              <span className={`pl-3 ${weight}`}>{`Episode ${episode.number}`}</span>

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

export default ListModal