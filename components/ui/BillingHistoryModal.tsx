import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { Player, Theme } from 'components/AppShell';
import { IEpisode, IList, IUser } from 'data/types';
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send, sync, camera, logOutOutline, closeCircle } from 'ionicons/icons';
import React, {useRef, useContext, useEffect, useState, useMemo} from 'react'
import TextDivider from './TextDivider';
import InitialsAvatar from 'react-initials-avatar';
import { UserState } from 'components/UserStateProvider';
import usePhoto from 'hooks/usePhoto';
import { nextSendTime } from 'utils/nextSendTime';
import { countryCodes } from 'data/countryCodes';
import useDonation from 'hooks/useDonation';
import { App } from '@capacitor/app';

interface IBillingHistory {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const BillingHistoryModal = (props: IBillingHistory) => {

  //TODO: Get translations


  const {
    user,
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
  
  const {
    getPaymentEvents,
    events,
  } = useDonation();

  useEffect (() => {
    if (!user?.objectId) return;
    getPaymentEvents()
  }, [user?.objectId])

  const eventItems = useMemo(() => {
    if (!events) return <></>;
    return events.map((event) => {
      const eventType = event.type;
      const eventDate = new Date(event.createdTime).toLocaleDateString();
      let amount =
        event.eventData?.object?.amount_paid && (event.eventData.object.amount_paid / 100).toFixed(2);
  
      let label = "";
      let cssClass = "";
  
      switch (eventType) {
        case "invoice.payment_succeeded":
          label = "Payment";
          cssClass = "text-normal";
          break;
        case "invoice.payment_failed":
          label = "Failed payment";
          cssClass = "text-danger";
          break;
        case "charge.refunded":
          label = "Refund";
          cssClass = "text-normal";
          break;
        case "customer.subscription.created":
          label = "Subscription created";
          cssClass = "text-normal";
          break;
        case "customer.subscription.updated":
          label = "Subscription updated";
          cssClass = "text-normal";
          break;
        case "customer.subscription.deleted":
          label = "Subscription canceled";
          cssClass = "text-normal";
          break;
        default:
          label = eventType;
          cssClass = "text-normal";
      }
  
  
      return (
        <IonItem key={event?.objectId }>
          <IonLabel>
            <div className="flex flex-col">
              <p className='font-medium text-light dark:text-dark'>{label}</p>
              <p className='text-medium'>{eventDate}</p>
            </div>
          </IonLabel>
          {amount && (
            <IonNote slot="end" className={`text-xl font-medium text-light dark:text-dark ${cssClass}`}>
              ${amount}
            </IonNote>
          )}
        </IonItem>
      );
    });
  }, [events]);

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
          <IonTitle>History</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" >
        <IonList>
          {eventItems}
        </IonList>
      </IonContent>
    </IonPage>
  )
}






export default BillingHistoryModal