import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode } from 'data/types';
import React, {useRef} from 'react'

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  episodes: IEpisode[],
  index: number,
}

const PlayerListModal = (props: IPlayerListModalProps) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => props.onDismiss(null, 'cancel')}>
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>Playing...</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => props.onDismiss(null, 'confirm')}>Confirm</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {props.episodes.map((episode, index) => {
          return(
            <IonItem>
              {`Episode ${episode.number}`}
            </IonItem>
          )
        })
        }
      </IonContent>
    </IonPage>
  )
}

export default PlayerListModal