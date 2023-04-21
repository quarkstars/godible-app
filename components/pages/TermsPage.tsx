import { IonButton, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Copyright from 'components/ui/Copyright'
import Notes from 'components/ui/Note'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import React, {useState} from 'react'

const TermsPage:React.FC = () => {

  const [response, setResponse] = useState<any>()
  //Get Current User with Streak

  async function testNotification () {
      try {
        const response = await Parse.Cloud.run("notificationTest");
        setResponse(response)
      } catch (err) {console.log("ERROR", err)}
    };


  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Terms & Privacy
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              Terms
              <IonButton onClick={() => {testNotification()}}></IonButton>
              {JSON.stringify(response)}
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

export default TermsPage