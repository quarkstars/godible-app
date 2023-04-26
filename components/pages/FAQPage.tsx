import { IonAccordion, IonAccordionGroup, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Copyright from 'components/ui/Copyright'
import Notes from 'components/ui/Note'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { faqs } from 'data/faqs'
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
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
            <IonAccordionGroup>
              {faqs.map((faq, index) => {
               
                if (faq.question)return (
                  
                  <IonAccordion value={index.toString()} key={index}>
                    <IonItem slot="header" color="light">
                      <IonLabel>{faq?.question}</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                      {faq?.answer}
                    </div>
                  </IonAccordion>
                )
                else return <IonItem  key={index}></IonItem>
              })
              }
            </IonAccordionGroup>
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