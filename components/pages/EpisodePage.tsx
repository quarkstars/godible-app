import { IonContent, IonFooter, IonHeader, IonPage, IonTitle } from '@ionic/react'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import React from 'react'

const EpisodePage:React.FC = () => {

  //TODO: If Episode is empty you need to load the episodes

  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Episode
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent>
        
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default EpisodePage