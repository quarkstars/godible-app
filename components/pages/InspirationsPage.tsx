import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Inspirations from 'components/ui/Inspirations'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import React from 'react'

const InspirationsPage:React.FC = () => {
  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Inspirations
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
              <Inspirations inspirations={[]} isClickToSave={true} isTitleHidden isPublicCountHidden />
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default InspirationsPage