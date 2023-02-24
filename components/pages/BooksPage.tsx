import { IonHeader, IonPage, IonToolbar } from '@ionic/react'
import React from 'react'

const BooksPage:React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>Books</IonToolbar>
      </IonHeader>
    </IonPage>
  )
}

export default BooksPage