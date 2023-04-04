import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Notes from 'components/ui/Notes'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import React from 'react'

const NotesPage:React.FC = () => {
  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Notes
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              <Notes notes={[]} isClickToSave={true} isTitleHidden isPublicCountHidden />
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default NotesPage