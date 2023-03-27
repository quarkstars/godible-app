import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Copyright from 'components/ui/Copyright'
import Inspirations from 'components/ui/Inspirations'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import React from 'react'

const FAQPage:React.FC = () => {
  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Questions
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
              FAQ
            <Copyright />
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default FAQPage