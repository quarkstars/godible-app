import { IonButton, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Copyright from 'components/ui/Copyright'
import Notes from 'components/ui/Note'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { terms } from 'data/terms'
import React, {useState, useMemo} from 'react'

const TermsPage:React.FC = () => {

  const [response, setResponse] = useState<any>()
  //Get Current User with Streak

  //TODO: Add Notifications
  // async function testNotification () {
  //     try {
  //       const response = await Parse.Cloud.run("notificationTest");
  //       setResponse(response)
  //     } catch (err) {console.error("ERROR", err)}
  //   };


    const text = useMemo(() => {
      return terms.split("\n").map((line, index) => {
          // if (index === 0) return;
          const fontWeight = line[0] === '#' ? 'bold' : 'normal';
          let hCount = 0;
          if (line[0] === "#") hCount=1;
          if (line[1] === "#") hCount=2;
          if (line[2] === "#") hCount=3;
          if (line[3] === "#") hCount=4;
          switch (hCount) {
            case 1:
              return(
                <h1
                  className="w-full text-left"
                  key={line}
                >
                  {line.replace(/#/g,'')}
                </h1>
              )
              break;
            case 2:
              return(
                <h2
                  className="w-full text-left"
                >
                  {line.replace(/#/g,'')}
                </h2>
              )
              break;
            case 3:
              return(
                <h3
                  className="w-full text-left"
                >
                  {line.replace(/#/g,'')}
                </h3>
              )
              break;
            case 4:
              return(
                <h4
                  className="w-full text-left"
                >
                  {line.replace(/#/g,'')}
                </h4>
              )
              break;
            default:
              return(
                <p
                  className={`pb-2 leading-relaxed w-full text-left`}
                >
                  {line.replace(/#/g,'')}
                </p>
            )
          }
        })
    }, [])

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
              {text}
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