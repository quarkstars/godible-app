import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { Player, Theme } from 'components/AppShell';
import { IEpisode, IList, IUser } from 'data/types';
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send, sync, camera, logOutOutline, closeCircle } from 'ionicons/icons';
import React, {useRef, useContext, useEffect, useState} from 'react'
import TextDivider from './TextDivider';
import InitialsAvatar from 'react-initials-avatar';
import { UserState } from 'components/UserStateProvider';
import usePhoto from 'hooks/usePhoto';
import { nextSendTime } from 'utils/nextSendTime';
import { countryCodes } from 'data/countryCodes';
import Pricing from './Pricing';
import { SwiperSlide } from 'swiper/react';
import SlideList from './SlideList';

interface ISettingsModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  
}

const TrailerModal = (props: ISettingsModalProps) => {

  //TODO: Get translations
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
          <IonTitle>Watch Trailers</IonTitle>
          </div>
            {/* <IonIcon icon={isLoading ? sync : checkmarkCircle} slot="end" className="ion-padding" /> */}
            {/* <IonSpinner name="dots" slot="end" className="ion-padding" /> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <SlideList hasDots>
          <SwiperSlide>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/aptk_auyQcY" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </SwiperSlide>
          <SwiperSlide>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/AlEmobLlavo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </SwiperSlide>
          <SwiperSlide>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/wIsTYXlzJ_c" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </SwiperSlide>
        </SlideList>
      </IonContent>
    </IonPage>
  )
}





export default TrailerModal