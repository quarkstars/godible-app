import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { Player, Theme } from 'components/AppShell';
import { IEpisode, IList, IUser } from 'data/types';
import { checkmarkCircle, ellipseOutline, moonOutline, sunnyOutline, volumeHigh, volumeLow, volumeMedium, volumeOff, contrast, language as languageIcon, information, text, trendingUp, refresh, close, mail, chatbox, notifications, chatboxOutline, phonePortraitOutline, alarm, send, sync, camera, logOutOutline } from 'ionicons/icons';
import React, {useRef, useContext, useEffect, useState} from 'react'
import TextDivider from './TextDivider';
import InitialsAvatar from 'react-initials-avatar';
import { UserState } from 'components/UserStateProvider';
import usePhoto from 'hooks/usePhoto';

interface ISettingsModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  isProfile?: boolean,
  isScrollToReminders?: number,
  onLogout?: Function,
  router?: UseIonRouterResult,
}

const SettingsModal = (props: ISettingsModalProps) => {

  //TODO: Get translations

  const player = useContext(Player);

  const {
    user,
    updateUser,
    isLoading,
  } = useContext(UserState);

  const {
    takePhoto,
    isLoading: photoIsLoading,
  } = usePhoto();

  const  {
    language,
    fontContrast,
    fontStyle,
    fontSize,
    firstName,
    lastName,
    email,
    phone,
  } = user;
  
  const theme = useContext(Theme);
  
  //Set up input values from the current logged in user
  const firstNameInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!firstNameInput.current) return;
    if (!user?.objectId) return firstNameInput.current.value = undefined;
    firstNameInput.current.value = user.firstName;
  }, [user?.objectId, firstNameInput.current]);

  const lastNameInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!lastNameInput.current) return;
    if (!user?.objectId) return lastNameInput.current.value = undefined;
    lastNameInput.current.value = user.lastName;
  }, [user?.objectId, lastNameInput.current]);

  const emailInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!emailInput.current) return;
    if (!user?.objectId) return emailInput.current.value = undefined;
    emailInput.current.value = user.email;
  }, [user?.objectId, emailInput.current]);
  
  const phoneInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!phoneInput.current) return;
    if (!user?.objectId) return phoneInput.current.value = undefined;
    phoneInput.current.value = user.phone;
  }, [user?.objectId, phoneInput.current]);

  const sendHour = useRef<HTMLIonSelectElement>(null);
  useEffect(() => {
    if (!sendHour.current) return;
    if (!user?.objectId) return sendHour.current.value = undefined;
    sendHour.current.value = user?.sendHour||"5";
  }, [user?.objectId, sendHour.current]);

  const sendType = useRef<HTMLIonSelectElement>(null);
  useEffect(() => {
    if (!sendType.current) return;
    if (!user?.objectId) return sendType.current.value = undefined;
    sendType.current.value = user.sendType||"newest";
  }, [user?.objectId, sendType.current]);

  const isPushOn = useRef<HTMLIonToggleElement>(null);
  useEffect(() => {
    if (!isPushOn.current) return;
    if (!user?.objectId) return isPushOn.current.value = undefined;
    isPushOn.current.checked = user.isPushOn||false;
  }, [user?.objectId, isPushOn.current]);

  const isTextOn = useRef<HTMLIonToggleElement>(null);
  useEffect(() => {
    if (!isTextOn.current) return;
    if (!user?.objectId) return isTextOn.current.value = undefined;
    isTextOn.current.checked = user.isTextOn||false;
  }, [user?.objectId, isTextOn.current]);

  const isEmailOn = useRef<HTMLIonToggleElement>(null);
  useEffect(() => {
    if (!isEmailOn.current) return;
    if (!user?.objectId) return isEmailOn.current.value = undefined;
    isEmailOn.current.checked = user.isEmailOn||false;
  }, [user?.objectId, isEmailOn.current]);

  
  const [imageUrl, setImageUrl] = useState<string|undefined>();
  useEffect(() => {
    if (!user?.objectId) return;
    if (user.imageUrl) setImageUrl(user.imageUrl)
  }, [user?.objectId]);

  const [firstNameNote, setFirstNameNote] = useState<string|undefined>();
  const [lastNameNote, setLastNameNote] = useState<string|undefined>();
  const [emailNote, setEmailNote] = useState<string|undefined>();
  const [phoneNote, setPhoneNote] = useState<string|undefined>();
  
  const handleInputChange = async (update: IUser) => {
    //If no change, exit and don't show any note
    if (update.firstName &&  firstNameInput.current && user.firstName === firstNameInput.current!.value) return setFirstNameNote(undefined);
    if (update.lastName &&  lastNameInput.current && user.lastName === lastNameInput.current!.value) return setLastNameNote(undefined);
    if (update.email &&  emailInput.current && user.email === emailInput.current!.value) return setEmailNote(undefined);
    if (update.phone &&  phoneInput.current && user.phone === phoneInput.current!.value) return setPhoneNote(undefined);

    if (update.firstName) setFirstNameNote("Saving...");
    if (update.lastName) setLastNameNote("Saving...");
    if (update.email) setEmailNote("Saving...");
    if (update.phone) setPhoneNote("Saving...");
    let response = await updateUser(update);
    if (response && response.email) {
      if (update.firstName) setFirstNameNote("Saved!");
      if (update.lastName) setLastNameNote("Saved!");
      if (update.email) setEmailNote("Saved!");
      if (update.phone) setPhoneNote("Saved!");
    } else {
      if (update.firstName) setFirstNameNote(undefined);
      if (update.lastName) setLastNameNote(undefined);
      if (update.email) setEmailNote(undefined);
      if (update.phone) setPhoneNote(undefined);
    }
  }
  

  const handleUploadPhoto = async () => {
    if (!user?.objectId) return;
    let photo = await takePhoto(user?.objectId);
    
    if (!photo?.url) return;
    let imageUrl = photo.url.replace("/upload/", "/upload/c_thumb,w_250,h_250/");
    setImageUrl(imageUrl);
    updateUser({imageUrl});
  }
  
  //TODO: Change this to the input values 
  let userName = `${user?.firstName ? user?.firstName:""}${user?.lastName ? " "+user?.lastName:""}`
  if (userName.length === 0) userName = "M E"

  let volumeIcon = volumeHigh;
  if (player.volume < .66) volumeIcon =volumeMedium;
  if (player.volume < .33) volumeIcon = volumeLow;
  if (player.volume < .05) volumeIcon = volumeOff;


  const content = useRef<HTMLIonContentElement | null>(null);
  const reminders = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!reminders.current || !content.current) return
    if (!props.isScrollToReminders) {
      content.current.scrollToTop();
      return;
    }
    reminders.current.scrollIntoView();
  }, [reminders.current, content.current, props.isScrollToReminders]);
  

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
          <IonTitle>Settings</IonTitle>
          </div>
            {/* <IonIcon icon={isLoading ? sync : checkmarkCircle} slot="end" className="ion-padding" /> */}
            {/* <IonSpinner name="dots" slot="end" className="ion-padding" /> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" ref={content}>
        {props.isProfile && 
        <>
          <IonItem>  
            {photoIsLoading ?   
            <div className="p-6"><IonSpinner /></div>
            :           
            <div
                  className="w-20 h-20 overflow-hidden rounded-full"
                >
                  {imageUrl ?
                      <img 
                          src={imageUrl} 
                          alt="My Profile" 
                          className='p-2 rounded-full'
                      />
                  :
                      <div
                          className='p-2'
                      >
                          <InitialsAvatar name={userName}  />
                      </div>
                  }
              </div>
              }
            <IonButtons>
              {user?.imageUrl ? <>
              <IonButton 
                size="small" 
                color="medium"
                disabled={photoIsLoading || isLoading}
                onClick={async () => {
                  await updateUser({imageUrl: null});
                  setImageUrl(undefined)
                }}

              >
                Clear
              </IonButton>
              <IonButton 
                size="small" 
                fill="outline"
                color="medium"
                disabled={photoIsLoading || isLoading}
                onClick={() => {
                  handleUploadPhoto();
                }}

              >                
                Change
              </IonButton>
              </>:
              <IonButton 
                size="small" 
                fill="outline"
                color="medium"
                disabled={photoIsLoading || isLoading}
                onClick={() => {
                  handleUploadPhoto();
                }}

              >                
                <IonIcon icon={camera} slot="start" />
                Add
              </IonButton>
              
              }
            </IonButtons>
          </IonItem>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>First name</IonLabel>
                    <IonInput 
                      ref={firstNameInput}
                      placeholder="First" 
                      debounce={1000}
                      onFocus={()=>setFirstNameNote(undefined)}
                      onIonChange={(event) => {
                        if (typeof firstNameInput.current?.value === "string" && firstNameInput.current.value.length > 0) {
                          
                          handleInputChange({firstName: firstNameInput.current?.value.slice(0,100)})
                      }}}
                    >
                      

                    </IonInput>
                       <IonNote slot="helper"><span className="text-xs text-primary">{firstNameNote}</span></IonNote>
                  </IonItem>
              </div>
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Last name</IonLabel>
                    <IonInput 
                      ref={lastNameInput}
                      placeholder="Last" 
                      debounce={1000}
                      onFocus={()=>setLastNameNote(undefined)}
                      onIonChange={(event) => {
                        if (typeof lastNameInput.current?.value === "string" && lastNameInput.current.value.length > 0) {
                          
                          handleInputChange({lastName: lastNameInput.current?.value.slice(0,100)})
                      }}}
                    >
                      

                    </IonInput>
                       <IonNote slot="helper"><span className="text-xs text-primary">{lastNameNote}</span></IonNote>
                  </IonItem>
              </div>
            </div>
            <div className="w-full">
              <IonItem>
                <IonLabel position='floating'>Email</IonLabel>
                <IonInput 
                  ref={emailInput}
                  placeholder="Email" 
                  debounce={1000}
                  onFocus={()=>setEmailNote(undefined)}
                  onIonChange={(event) => {
                    if (typeof emailInput.current?.value === "string" && emailInput.current.value.length > 0) {
                      
                      handleInputChange({email: emailInput.current?.value.slice(0,1000), username: emailInput.current?.value.slice(0,1000)})
                  }}}
                >
                  

                </IonInput>
                    <IonNote slot="helper"><span className="text-xs text-primary">{emailNote}</span></IonNote>
              </IonItem>
            </div>
            <IonItem lines="none"></IonItem>
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
        <IonItem lines="none"></IonItem>
        <div ref={reminders}></div>
        <IonItem> 
            <IonIcon icon={alarm} slot="start" />
            <IonLabel>Daily Reminder Time</IonLabel>
            <IonSelect 
              ref={sendHour} 
              interface="action-sheet" 
              slot="end" 
              onIonChange={(e) => {
                if (user.objectId) updateUser({sendHour: e.detail.value})
              }}
            >
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

                <IonSelect 
                  ref={sendType} 
                  slot="end"
                  onIonChange={(e) => {
                    if (user.objectId) updateUser({sendType: e.detail.value})
                  }}
                >
                  <IonSelectOption value="newest">Newest release</IonSelectOption>
                  <IonSelectOption value="next">My next episode</IonSelectOption>
                </IonSelect>
        </IonItem>
        <IonItem> 
            <IonIcon icon={mail} slot="start" />
            <IonLabel>Email ON</IonLabel>
            <IonToggle
              name="email"
              ref={isEmailOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user.objectId) updateUser({isEmailOn: e.detail.checked})
              }}
            />
        </IonItem>
        
        <IonItem> 
            <IonIcon icon={notifications} slot="start" />
            <IonLabel>Push Notification ON</IonLabel>
            <IonToggle
              name="push"
              ref={isPushOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user.objectId) updateUser({isPushOn: e.detail.checked})
              }}
            />
        </IonItem>
        <IonItem> 
            <IonIcon icon={chatbox} slot="start" />
            <IonLabel>Text Message ON</IonLabel>
            <IonToggle
              name="text"
              ref={isTextOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user.objectId) updateUser({isTextOn: e.detail.checked})
              }}
            />
        </IonItem>
        <IonItem > 
            <IonIcon icon={phonePortraitOutline} slot="start" />    
            <IonLabel>Mobile</IonLabel>

            <IonInput 
              ref={phoneInput} 
              type="tel" 
              placeholder='1 (000) 000-0000'
              debounce={1000}
              onFocus={()=>setPhoneNote(undefined)}
              onIonChange={(event) => {
                if (typeof phoneInput.current?.value === "string" && phoneInput.current.value.length > 0) {
                  const phone = phoneInput.current?.value .replace(/[^0-9]/g,"");
                  handleInputChange({phone: Number(phone)})
              }}}
            >

            </IonInput>
               <IonNote slot="helper"><span className="text-xs text-primary">{phoneNote}</span></IonNote>
          </IonItem>
        </>
        }
        <IonItem lines="none"></IonItem>
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
        {props.onLogout &&
          <IonItem 
            lines="none" 
            button
            onClick={async (e) => {
              if (!props.onLogout) return;
              await props.onLogout();
              if (props.router) props.router.push("/");
              props.onDismiss();
            }}
          > 
              <IonLabel slot="end" color="danger">Log out</IonLabel>
              <IonIcon icon={logOutOutline} slot="end"  color="danger"/>    
          </IonItem>
        }
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default SettingsModal