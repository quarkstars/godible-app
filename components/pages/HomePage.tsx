import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { logInOutline } from 'ionicons/icons'
import React from 'react'

const HomePage:React.FC = () => {


	const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
              <span className="px-2 w-20 hidden md:block"></span>
          </IonButtons>
          <IonTitle>Continue Episode 3</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={()=>{router.push("/signin")}}>
              <IonIcon icon={logInOutline} />
              <span className="px-2">Log in</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  )
}

export default HomePage