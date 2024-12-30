import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover, useIonRouter } from '@ionic/react'
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send, sync, camera, logOutOutline, closeCircle, arrowForwardSharp } from 'ionicons/icons';
import React, {useContext, useEffect} from 'react'
import { UserState } from 'components/UserStateProvider';
import { App } from '@capacitor/app';
import { Player } from 'components/AppShell';

interface TutorialVideoModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  onClick?: () => void;
  isMobile?: boolean;
  router?: UseIonRouterResult;
  
}

const TutorialVideoModal = (props: TutorialVideoModalProps) => {

  const {
    onClick,
    isMobile,
    router,
  } = props

  const {
    isModalOpen,
  } = useContext(UserState);
  useEffect(() => {
    let backButtonListener;
    if (isModalOpen) isModalOpen.current = true;

    const addListenerAsync = async () => {
        backButtonListener = await App.addListener('backButton', (data) => {
            props.onDismiss();
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
            <IonButton color="medium" onClick={() => props.onDismiss(null, 'close')}>
              <IonIcon icon={close} slot="icon-only"/>
              {/* Default */}
            </IonButton>
          </IonButtons>
          <div className="pr-10">
            <IonTitle><strong>Welcome to the NEW Godible!</strong></IonTitle>
          </div>
          {onClick &&
              <IonButton fill="solid" color="primary" className="mr-2" slot="end" onClick={(e) => {
                  if (onClick) {
                    onClick();
                    props.onDismiss();
                  }
              }}>
                <IonIcon icon={arrowForwardSharp} />
              </IonButton>
            }

        </IonToolbar>
      </IonHeader>
      <IonContent>
          <div className="video-wrapper flex justify-center w-full">
              <iframe src="https://www.youtube.com/embed/Gc_Z0ChpvMA?si=peVGR_cxUPD5PLGV" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </div>
          {onClick ?
            <div className="ion-padding">
                <div className="flex mt-2 -ml-5 sm:ml-0 justify-center items-center flex-col">
                  <IonText className="text-center">Get started with your current Godible email</IonText>
                  <IonButton fill="solid" color="primary" onClick={(e) => {
                      if (onClick) {
                        onClick();
                        props.onDismiss();
                      }
                  }}>
                    Create Your Account
                  </IonButton>
                </div>
            </div>
          : 
          <div className="ion-padding">
              <div className="flex mt-4 -ml-5 sm:ml-0 justify-center items-center flex-col">
                <IonButton fill="clear" onClick={(e) => {
                      props.onDismiss();
                }}>
                  Okay, Got it!
                </IonButton>
              </div>
          </div>
          }
      </IonContent>
    </IonPage>
  )
}





export default TutorialVideoModal