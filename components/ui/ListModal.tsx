import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import React, {useRef} from 'react'

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list: IList,
  setList: Function,
  setIndex: Function,
  index: number,
}

const ListModal = (props: IPlayerListModalProps) => {

  
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
        {props.list?.episodes.map((episode, _index) => {
          let weight = (_index === props.index) ? "font-bold" : "font-normal"
          return(
            <IonItem key={"list-"+episode.objectId}>
              <IonReorder slot="start"></IonReorder>
              <span className={`${weight}`}>{`Episode ${episode.number}`}</span>
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