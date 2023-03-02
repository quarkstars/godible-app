import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import Hero from 'components/ui/Hero';
import Toolbar from 'components/ui/Toolbar';
import { logInOutline } from 'ionicons/icons'
import React from 'react'

const HomePage:React.FC = () => {


	const router = useIonRouter();

  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Not Ga
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <div className="flex flex-col justify-start w-full min-h-full">
        <Hero></Hero>

      </div>
    </IonPage>
  )
}

export default HomePage