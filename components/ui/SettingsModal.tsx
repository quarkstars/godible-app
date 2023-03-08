import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRange, IonReorder, IonReorderGroup, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { Player, Theme, UserState } from 'components/AppShell';
import { IEpisode, IList } from 'data/types';
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff } from 'ionicons/icons';
import React, {useRef, useContext} from 'react'

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const SettingsModal = (props: IPlayerListModalProps) => {

  //TODO: Get translations

  const player = useContext(Player);

  const {
    user,
    updateUser,
  } = useContext(UserState);

  const  {
    language,
    fontContrast,
    fontStyle,
    fontSize,
  } = user;
  
  const theme = useContext(Theme);

  let volumeIcon = volumeHigh;
  if (player.volume < .66) volumeIcon =volumeMedium;
  if (player.volume < .33) volumeIcon = volumeLow;
  if (player.volume < .05) volumeIcon = volumeOff;
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => props.onDismiss(null, 'close')}>
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => props.onDismiss(null, 'undo')}>Undo</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem> 
            <IonIcon icon={volumeIcon} />
            <IonRange
                value={player.volume}
                max={1}
                step={.01}
                onIonChange={(detail) => {
                    let volume = Number(detail.target.value); 
                    player.setVolume(volume);                                            
                }}
            />
          </IonItem>
          <IonItem>
            <IonLabel><span className="block">Theme</span></IonLabel>
              <IonToggle
                slot="end"
                name="darkMode"
                checked={theme.isDark}
                onClick={() => {theme.setIsDark(!theme.isDark)}}
              />
            <IonIcon slot={'end'} icon={theme.isDark ?  moonOutline : sunnyOutline} />
          </IonItem>
          <IonItem> 
            <IonLabel><span className="hidden xs:block">Language</span></IonLabel>
            <IonButtons slot="end">
              <IonButton 
                size="small" 
                color={(language === "english" || typeof language === "undefined") ? "dark" : "medium"} 
                onClick={() => {
                  if (language !== "english") updateUser({language: "english"})
                }}
              >
                <IonIcon icon={(language === "english" || typeof language === "undefined") ? checkmarkCircle : ellipseOutline} slot="start"/>
                English
              </IonButton>
              <IonButton 
                size="small" 
                color={language === "japanese" ? "dark" : "medium"} 
                onClick={() => {
                  if (language !== "japanese") updateUser({language: "japanese"})
                }}
              >                
                <IonIcon icon={language === "japanese" ? checkmarkCircle : ellipseOutline} slot="start"/>
                Japanese
              </IonButton>
            </IonButtons>
        </IonItem>
        <IonItem></IonItem>
        <IonItem> 
          <IonLabel><span className="hidden xs:block">Font</span></IonLabel>
          <IonButtons slot="end">
              <IonButton 
                size="small" 
                color={(fontStyle === "serif" || typeof fontStyle === "undefined") ? "dark" : "medium"} 
                onClick={() => {
                  if (fontStyle !== "serif") updateUser({fontStyle: "serif"})
                }}
              >     
              <IonIcon icon={(fontStyle === "serif" || typeof fontStyle === "undefined")  ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="font-serif capitalize">Serif</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={fontStyle === "sanserif" ? "dark" : "medium"} 
                onClick={() => {
                  if (fontStyle !== "sanserif") updateUser({fontStyle: "sanserif"})
                }}
              >     
              <IonIcon icon={fontStyle === "sanserif" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="capitalize">San Serif</span>
            </IonButton>
          </IonButtons>
        </IonItem>
        <IonItem> 
          <IonLabel><span className="hidden xs:block">Size</span></IonLabel>
          <IonButtons slot="end">
              <IonButton 
                size="small" 
                color={fontSize === "small" ? "dark" : "medium"} 
                onClick={() => {
                  if (fontSize !== "small") updateUser({fontSize: "small"})
                }}
              >     
              <IonIcon icon={fontSize === "small" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="capitalize text-md">Small</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={(fontSize === "regular" || typeof fontSize === "undefined") ? "dark" : "medium"} 
                onClick={() => {
                  if (fontSize !== "regular") updateUser({fontSize: "regular"})
                }}
              >     
              <IonIcon icon={(fontSize === "regular" || typeof fontSize === "undefined") ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="text-lg capitalize">Regular</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={fontSize === "large" ? "dark" : "medium"} 
                onClick={() => {
                  if (fontSize !== "large") updateUser({fontSize: "large"})
                }}
              >     
              <IonIcon icon={fontSize === "large" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="text-xl capitalize">Large</span>
            </IonButton>
          </IonButtons>
        </IonItem>
        <IonItem> 
          <IonLabel><span className="hidden xs:block">Contrast</span></IonLabel>
          <IonButtons slot="end">
              <IonButton 
                size="small" 
                onClick={() => {
                  if (fontContrast !== "low") updateUser({fontContrast: "low"})
                }}
              >     
              <IonIcon icon={fontContrast === "low" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="font-bold text-gray-500 dark:text-gray-500">Low</span>
            </IonButton>
              <IonButton 
                size="small" 
                onClick={() => {
                  if (fontContrast !== "normal") updateUser({fontContrast: "normal"})
                }}
              >     
              <IonIcon icon={fontContrast === "normal" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="font-bold text-gray-700 dark:text-gray-300">Normal</span>
            </IonButton>
              <IonButton 
                size="small" 
                onClick={() => {
                  if (fontContrast !== "high") updateUser({fontContrast: "high"})
                }}
              >     
              <IonIcon icon={fontContrast === "high" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="font-bold text-black dark:text-white">High</span>
            </IonButton>
          </IonButtons>
        </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default SettingsModal