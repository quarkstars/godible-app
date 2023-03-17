import { IonHeader, IonPage, IonToolbar } from '@ionic/react'
import React from 'react'
//https://chrisgriffith.wordpress.com/2019/05/14/ionic-design-profile-page/
const ProfilePage:React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>Profile</IonToolbar>
      </IonHeader>
    </IonPage>
  )
}

export default ProfilePage