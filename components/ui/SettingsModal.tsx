import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { Player, Theme } from 'components/AppShell';
import { IEpisode, IList } from 'data/types';
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send } from 'ionicons/icons';
import React, {useRef, useContext} from 'react'
import TextDivider from './TextDivider';
import InitialsAvatar from 'react-initials-avatar';
import { UserState } from 'components/UserStateProvider';

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  isProfile?: boolean,

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
              <IonIcon icon={close} slot="icon-only"/>
              {/* Default */}
            </IonButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
            <IonIcon icon={checkmarkCircle} slot="end" className="ion-padding" />
            {/* <IonSpinner name="dots" slot="end" className="ion-padding" /> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {props.isProfile && 
        <>
          <IonItem>               
            <div
                  className="w-20 h-20 overflow-hidden rounded-full"
                >
                  {user.imageUrl ?
                      <img 
                          src={user.imageUrl} 
                          alt="My Profile" 
                          className='p-2'
                      />
                  :
                      <div
                          className='p-2'
                      >
                          <InitialsAvatar name={`${user.firstName} ${user.lastName}`}  />
                      </div>
                  }
              </div>
            <IonButtons>
              <IonButton 
                size="small" 
                color="medium"

              >
                Clear
              </IonButton>
              <IonButton 
                size="small" 
                fill="outline"
                color="medium"

              >                
                Change
              </IonButton>
            </IonButtons>
          </IonItem>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>First name</IonLabel>
                    <IonInput 
                      placeholder="First" 
                      // onIonChange={(event) => setFirst(typeof event.target.value === "string" ? event.target.value : "")}
                    >

                    </IonInput>
                  </IonItem>
              </div>
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Last name</IonLabel>
                    <IonInput 
                      placeholder="Last" 
                      // onIonChange={(event) => setLast(typeof event.target.value === "string" ? event.target.value : "")}
                    >

                    </IonInput>
                  </IonItem>
              </div>
            </div>
            <div className="w-full">
                  <IonItem>
                    <IonLabel position='floating'>Email</IonLabel>
                    <IonInput 
                      placeholder="Email" 
                      // onIonChange={(event) => setFirst(typeof event.target.value === "string" ? event.target.value : "")}
                    >

                    </IonInput>
                  </IonItem>
            </div>
            </>}
        <IonList>
          {!props.isProfile &&
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
          }
          <IonItem>
            <IonIcon slot={'start'} icon={theme.isDark ?  moonOutline : sunnyOutline} />
            <IonToggle
              name="darkMode"
              checked={theme.isDark}
              onClick={() => {theme.setIsDark(!theme.isDark)}}
            />
          </IonItem>
          <IonItem> 
            <IonIcon icon={languageIcon} slot="start" />
            <IonButtons>
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
        
        {props.isProfile && <>
        <IonItem><IonIcon slot="start"></IonIcon></IonItem>
        <IonItem> 
            <IonIcon icon={alarm} slot="start" />
            <IonLabel>Daily Reminder Time</IonLabel>
            <IonSelect value="5" interface="action-sheet" slot="end" >
              <IonSelectOption value="0">12:00 AM</IonSelectOption>
              <IonSelectOption value="1">1:00 AM</IonSelectOption>
              <IonSelectOption value="2">2:00 AM</IonSelectOption>
              <IonSelectOption value="3">3:00 AM</IonSelectOption>
              <IonSelectOption value="4">4:00 AM</IonSelectOption>
              <IonSelectOption value="5">5:00 AM</IonSelectOption>
              <IonSelectOption value="6">6:00 AM</IonSelectOption>
              <IonSelectOption value="7">7:00 AM</IonSelectOption>
              <IonSelectOption value="8">8:00 AM</IonSelectOption>
              <IonSelectOption value="9">9:00 AM</IonSelectOption>
              <IonSelectOption value="10">10:00 AM</IonSelectOption>
              <IonSelectOption value="11">11:00 AM</IonSelectOption>
              <IonSelectOption value="12">12:00 PM</IonSelectOption>
              <IonSelectOption value="13">1:00 PM</IonSelectOption>
              <IonSelectOption value="14">2:00 PM</IonSelectOption>
              <IonSelectOption value="15">3:00 PM</IonSelectOption>
              <IonSelectOption value="16">4:00 PM</IonSelectOption>
              <IonSelectOption value="17">5:00 PM</IonSelectOption>
              <IonSelectOption value="18">6:00 PM</IonSelectOption>
              <IonSelectOption value="19">7:00 PM</IonSelectOption>
              <IonSelectOption value="20">8:00 PM</IonSelectOption>
              <IonSelectOption value="21">9:00 PM</IonSelectOption>
              <IonSelectOption value="22">10:00 PM</IonSelectOption>
              <IonSelectOption value="23">11:00 PM</IonSelectOption>
            </IonSelect>
        </IonItem>
        <IonItem> 
            <IonIcon icon={send} slot="start" />
            <IonLabel>Send Me</IonLabel>

                <IonSelect value="newest" slot="end">
                  <IonSelectOption value="newest">Newest release</IonSelectOption>
                  <IonSelectOption value="next">My next episode</IonSelectOption>
                </IonSelect>
        </IonItem>
        <IonItem> 
            <IonIcon icon={mail} slot="start" />
            <IonLabel>Email ON</IonLabel>
            <IonToggle
              name="darkMode"
              // checked={theme.isDark}
              onClick={() => {}}
            />
        </IonItem>
        
        <IonItem> 
            <IonIcon icon={notifications} slot="start" />
            <IonLabel>Push Notification ON</IonLabel>
            <IonToggle
              name="darkMode"
              // checked={theme.isDark}
              onClick={() => {}}
            />
        </IonItem>
        <IonItem> 
            <IonIcon icon={chatbox} slot="start" />
            <IonLabel>Text Message ON</IonLabel>
            <IonToggle
              name="darkMode"
              // checked={theme.isDark}
              onClick={() => {}}
            />
        </IonItem>
        <IonItem> 
            <IonIcon icon={phonePortraitOutline} slot="start" />    
            <IonLabel>Phone</IonLabel>

            <IonInput type="tel" placeholder='1 (000) 000-0000'>

            </IonInput>
        </IonItem>
        </>
        }
        <IonItem><IonIcon slot="start"></IonIcon></IonItem>
        {!props.isProfile && <>
        <IonItem> 
          <IonIcon icon={text} slot="start" />
          <IonButtons>
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
          <IonIcon icon={trendingUp} slot="start" />
          <IonButtons>
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
          <div className='-space-x-2 '>
          </div>

        </IonItem>
        <IonItem> 
          <IonIcon icon={contrast} slot="start" />
          <IonButtons>
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
        </>}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default SettingsModal