import { App } from "@capacitor/app";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { UserState } from "components/UserStateProvider";
import { close } from "ionicons/icons";
import { useContext, useEffect } from "react";

const PayInBrowserModal = ({onDismiss, router, reroutePath}) => {
    const {isModalOpen} = useContext(UserState);
    useEffect(() => {
      let backButtonListener;
      if (isModalOpen) isModalOpen.current = true;
  
      const addListenerAsync = async () => {
          backButtonListener = await App.addListener('backButton', (data) => {
              onDismiss();
          });
      };
  
      addListenerAsync();
  
      return () => {
          // Clean up listener
          if (backButtonListener) {
              backButtonListener.remove();
          }
          if (isModalOpen) isModalOpen.current = false;
      };
    }, []);
  
    return (
      
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="medium" onClick={() => onDismiss(null, 'close')}>
                <IonIcon icon={close} slot="icon-only"/>
                {/* Default */}
              </IonButton>
            </IonButtons>
            <div className="pr-10">
            <IonTitle>Access Pro Billing in the Browser</IonTitle>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton
              href={"https://app.godible.org/subscription"}
              expand="block"
              color="primary"
            >
              Continue to Godible.org
            </IonButton>
          <IonButton
              onClick={async (e) => {
                onDismiss()
              }}
              expand="block"
              color="primary"
              fill="clear"
            >
              Close
          </IonButton>
        </IonContent>
      </IonPage>
    )
  }


export default PayInBrowserModal