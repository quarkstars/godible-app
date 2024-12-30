import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover } from '@ionic/react'
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send, sync, camera, logOutOutline, closeCircle, flame, leaf } from 'ionicons/icons';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserState } from 'components/UserStateProvider';
import { SwiperSlide } from 'swiper/react';
import SlideList from './SlideList';
import { App } from '@capacitor/app';
import { actions, Level } from 'data/gamification';
import TextDivider from './TextDivider';
import { IPoint } from 'data/types';

interface IGamificationModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  currentStreak: number,
  maxStreak: number,
  level?: Level,
  points: number,
}

const GamificationModal = (props: IGamificationModalProps) => {

  const { currentStreak, maxStreak, level } = props;
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

  const [dailyPoints, setDailyPoints] = useState<IPoint[]>();
  const availableActions = useMemo(() => {
    const currentStreakOr1 = currentStreak || 1;
    const availableActions = actions.filter(action => !action.streakMin || (action.streakMin && currentStreakOr1 >= action.streakMin && currentStreakOr1 < (action?.streakMax || Infinity)));
    if (dailyPoints) availableActions.forEach(action => {
      const actionPoints = dailyPoints.filter(dp => dp.action === action.name)
      if (actionPoints.length) {
        action.dailyQuota = actionPoints.length;
        action.isComplete = true;
      }
    });
    return availableActions;
  }, [dailyPoints]);

  // get points on load
  const getPoints = async () => {
    try {
      const result = await Parse.Cloud.run("getPoints");
      setDailyPoints(result);
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    getPoints();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => props.onDismiss(null, 'close')}>
              <IonIcon icon={close} slot="icon-only" />
              {/* Default */}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <div className="flex flex-col items-start space-x-1 space-y-2">
          {level?.id && <span className="text-medium text-xs ml-1">{`Level ${level.id}`}</span>}
          {level && <h1 className="mb-0">{level.name}</h1>}
          <div className="flex items-center space-x-2 font-bold">
            <IonIcon icon={leaf} color="medium" />
            {`${props.points} vitality elements`}
          </div>
          {typeof level?.percent === "number" && (
            <>
              <div className="w-full h-2 mt-2 my-8 cursor-pointer bg-gray-200 rounded-lg dark:bg-gray-600 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-md"
                  style={{ width: `${level.percent}%` }}
                ></div>
              </div>
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center justify-between space-x-2 text-lg font-medium'>
                    <span className='text-sm'>{`${level.percent}%`}</span>
                    <span className='text-sm text-medium'>{`${level.pointsRemaining} vitality left to reach ${level.nextLevelName} level!`}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <IonIcon size="large" icon={flame} color="primary" />
            <span className="font-bold">{currentStreak ? `${currentStreak} day streak!` : ""}</span>
            {currentStreak !== maxStreak && <span className="flex items-center space-x-1 text-medium">{`Your best streak was ${maxStreak} days`}</span>}
          </div>
        </div>
        <TextDivider>Daily Vitality</TextDivider>
        <IonList>
          {availableActions.map((action, index) => {
            let left = action.dailyLimit - (action.dailyQuota || 0);
            if (left < 0) left = 0;
            return (
              <IonItem key={index}>
                {action.isComplete ? 
                  <IonIcon icon={checkmarkCircle} className="text-green-500 ml-2" />
                 : 
                 <IonIcon icon={ellipseOutline} className="text-gray-500 ml-2" />
                 }
                <IonLabel>{`${action.message}${left ? ` (${left} left)` : ""}`}</IonLabel>
                <IonNote slot="end">+{action.points}</IonNote>
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}





export default GamificationModal