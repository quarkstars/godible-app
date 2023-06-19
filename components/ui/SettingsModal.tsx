import { IonAvatar, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonRange, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonSpinner, IonText, IonThumbnail, IonTitle, IonToggle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover, isPlatform } from '@ionic/react'
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
import { App } from '@capacitor/app';

interface ISettingsModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  isProfile?: boolean,
  isScrollToReminders?: number,
  onLogout?: Function,
  isOnboarding?: Function,
  router?: UseIonRouterResult,
}

const SettingsModal = (props: ISettingsModalProps) => {

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
  
  
  

  const player = useContext(Player);

  const {
    user,
    updateUser,
    isLoading,
    reroutePath,
    setReroutePath,
    getCurrentUser,
    isModalOpen
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

  const reader = new FileReader();
  const {
    takePhoto,
    isLoading: photoIsLoading,
    uploadToCloudinary,
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

  
  const [onboardingEdit, setOnboardingEdit] = useState<boolean>(false);
  const [onboardingUpgrade, setOnboardingUpgrade] = useState<boolean>(false);
  
  //Set up input values from the current logged in user
  const firstNameInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!firstNameInput.current) return;
    if (!user?.objectId) return firstNameInput.current.value = undefined;
    firstNameInput.current.value = user.firstName;
  }, [user?.objectId, firstNameInput.current, onboardingEdit]);

  const lastNameInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!lastNameInput.current) return;
    if (!user?.objectId) return lastNameInput.current.value = undefined;
    lastNameInput.current.value = user.lastName;
  }, [user?.objectId, lastNameInput.current, onboardingEdit]);

  const emailInput = useRef<HTMLIonInputElement>(null);
  useEffect(() => {
    if (!emailInput.current) return;
    if (!user?.objectId) return emailInput.current.value = undefined;
    emailInput.current.value = user.email;
  }, [user?.objectId, emailInput.current, onboardingEdit]);
  
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
    sendHour.current.value = user?.sendHour||"8";
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
  const [countryCode, setCountryCode] = useState<string|undefined>("+1 US");
  useEffect(() => {
    if (!user?.objectId) return;
    if (user.imageUrl) setImageUrl(user.imageUrl);
    if (user.countryCode) setCountryCode(user.countryCode);
    else {
      updateUser({countryCode: "+1 US"});
      setCountryCode("+1 US");
    }
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
  
  
  const [response, setResponse] = useState<string|undefined>();
  const [presentResponse, dimissResponse] = useIonPopover(responsePopOver, {
    onDismiss: (data: string, role: string) => dimissResponse(data, role),
    response,
  });



  const handleUploadPhoto = async (blobUrl?: any) => {
    if (!user?.objectId) return;
    let photo:any;
    if (!blobUrl) photo = await takePhoto(user?.objectId);
    else {    
      photo = await uploadToCloudinary(blobUrl, user?.objectId);
    }
    
    if (!photo?.url) return;
    let imageUrl = photo.url.replace("/upload/", "/upload/c_thumb,w_250,h_250/").replace("http://", "https://");
    setImageUrl(imageUrl);
    updateUser({imageUrl});
  }
  
  //TODO: Change this to the input values 
  let userName = `${user?.firstName ? user?.firstName:""}${user?.lastName ? " "+user?.lastName:""}`
  if (userName.length === 0) userName = "M E"

  let volumeIcon = volumeHigh;
  if (player?.volume < .66) volumeIcon =volumeMedium;
  if (player?.volume < .33) volumeIcon = volumeLow;
  if (player?.volume < .05) volumeIcon = volumeOff;


  if (onboardingUpgrade) return (
    
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
          <IonTitle>Support Godible</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" ref={content}>
        <h2 className="w-full text-center">Join Godible Pro to get unlimited access</h2>
        <Pricing 
          onClick={() => {
            if (props.router) {
              setReroutePath(props.router.routeInfo.pathname);
              props.router?.push("/subscription")
            }
            props.onDismiss()
          } } 
        />
        
        <IonButton
            onClick={async (e) => {
              props.onDismiss()
            }}
            expand="block"
            color="primary"
            fill="clear"
          >
            Not Now
          </IonButton>
      </IonContent>
    </IonPage>
  )

  else return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => {props.onDismiss(null, 'close')}}>
              <IonIcon icon={close} slot="icon-only"/>
              {/* Default */}
            </IonButton>
          </IonButtons>
          <div className="pr-10">
          <IonTitle className="font-bold">{props?.isOnboarding ? "Account Setup" : "Settings"}</IonTitle>
          </div>
            {/* <IonIcon icon={isLoading ? sync : checkmarkCircle} slot="end" className="ion-padding" /> */}
            {/* <IonSpinner name="dots" slot="end" className="ion-padding" /> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" ref={content}>
      {props.isOnboarding && !onboardingEdit &&
      <div className="flex justify-center w-full">
        <div className="flex items-center justify-between w-full p-2 space-x-1 bg-gray-100 rounded-md dark:border-gray-800">
            <div className="flex items-center space-x-2">

              {user.imageUrl ?

                <img 
                  className='w-10 h-10 rounded-full'
                  src={user.imageUrl} 
                  alt="My Profile" 
                ></img>
                :
                <div
                    className='p-2'
                >
                    <InitialsAvatar name={userName}  />
                </div>
                }

                <div className="flex flex-col w-full">
                  <div className="font-medium text-md xs:text-lg line-clamp-1">{`Welcome ${userName}!`}</div>
                  <div className="text-xs xs:text-sm text-medium line-clamp-1">{`${user.email}`}</div>
                </div>
              </div>
              <IonButtons>
                <IonButton size="small" onClick={()=>{setOnboardingEdit(true)}}>
                  Edit
                </IonButton>
              </IonButtons>
        </div>
      </div>
      }
        {(props.isProfile || onboardingEdit) && 
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
              <>
              {!photoIsLoading && !isLoading &&
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
                Take
              </IonButton>
              }
              {!photoIsLoading && !isLoading &&
              <form>
                <label className="px-4 py-2 text-sm font-medium tracking-wide text-gray-500 uppercase cursor-pointer hover:text-gray-600">
                Choose
                <input 
                  type="file" 
                  name="photo" 
                  accept="image/*"
                  className="hidden" 
                  onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const blobUrl = URL.createObjectURL(file);
                      handleUploadPhoto(blobUrl);
                  }}
                />
                </label>
              </form>
              }
              </>
              }
            </IonButtons>
          </IonItem>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position={props.isOnboarding ? 'stacked' : 'floating'}>First name</IonLabel>
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
                    <IonLabel position={props.isOnboarding ? 'stacked' : 'floating'}>Last name</IonLabel>
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
                <IonLabel position={props.isOnboarding ? 'stacked' : 'floating'}>Email</IonLabel>
                <IonInput 
                  ref={emailInput}
                  placeholder="Email" 
                  debounce={1000}
                  onFocus={()=>setEmailNote(undefined)}
                  onIonChange={(event) => {
                    if (typeof emailInput.current?.value === "string" && emailInput.current.value.length > 0) {
                      
                      handleInputChange({email: emailInput.current?.value.slice(0,500), username: emailInput.current?.value.slice(0,500), emailErrorCount: 0, lastEmailResponse: null})
                  }}}
                >
                  

                </IonInput>
                    <IonNote slot="helper"><span className="text-xs text-primary">{emailNote}</span></IonNote>
              </IonItem>
            </div>
            <IonItem lines="none"></IonItem>
            </>}
        <IonList>
          {(!props.isProfile && !props.isOnboarding) &&
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
          {!props.isOnboarding &&
          <IonItem>
            <IonIcon slot={'start'} icon={theme.isDark ?  moonOutline : sunnyOutline} />
            <IonToggle
              name="darkMode"
              checked={theme.isDark}
              onClick={() => {theme.setIsDark(!theme.isDark)}}
            />
          </IonItem>
          }
          <IonItem> 
            <IonIcon icon={languageIcon} slot="start" />
            <IonButtons>
              <IonButton 
                size="small" 
                color={(language === "english" || typeof language === "undefined") ? "dark" : "medium"} 
                onClick={async () => {
                  if (language !== "english") await updateUser({language: "english"})
                  
                }}
              >
                <IonIcon icon={(language === "english" || typeof language === "undefined") ? checkmarkCircle : ellipseOutline} slot="start"/>
                English
              </IonButton>
              <IonButton 
                size="small" 
                color={language === "japanese" ? "dark" : "medium"} 
                onClick={async () => {
                  if (language !== "japanese") await updateUser({language: "japanese"})
                  
                }}
              >                
                <IonIcon icon={language === "japanese" ? checkmarkCircle : ellipseOutline} slot="start"/>
                Japanese
              </IonButton>
            </IonButtons>
        </IonItem>
        
        {(props.isProfile || props.isOnboarding) && <>
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
                if (user?.objectId) updateUser(
                  {
                    sendHour: e.detail.value, 
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    nextSendTime: nextSendTime(e.detail.value),
                  }
                )
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
                    if (user?.objectId) updateUser({sendType: e.detail.value})
                  }}
                >
                  <IonSelectOption value="newest">Newest release</IonSelectOption>
                  <IonSelectOption value="next">My next episode</IonSelectOption>
                </IonSelect>
        </IonItem>
        <IonItem> 
            <IonIcon icon={mail} slot="start" />
            <IonLabel>{`Email ${user?.isEmailOn ? "on": "off"}`}</IonLabel>
            {user.lastEmailResponse && 
              <IonIcon 
                size="small" 
                color={user.lastEmailResponse.includes("success") ?"primary":"danger"} 
                icon={user.lastEmailResponse.includes("success") ? checkmarkCircle : closeCircle} 
                onClick={(e:any) => {
                  setResponse(user.lastEmailResponse!)
                  presentResponse({})
                }}
              />
            }
            <IonToggle
              name="email"
              ref={isEmailOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user?.objectId) updateUser({isEmailOn: e.detail.checked})
              }}
            />
        </IonItem>
        {isPlatform("capacitor") &&
        <IonItem> 
            <IonIcon icon={notifications} slot="start" />
            <IonLabel>{`Push notifications ${user?.isPushOn ? "on": "off"}`}</IonLabel>
            <IonToggle
              name="push"
              ref={isPushOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user?.objectId) updateUser({isPushOn: e.detail.checked, pushErrorCount: 0, lastPushResponse: null})
              }}
            />
        </IonItem>
        }
        <IonItem> 
            <IonIcon icon={chatbox} slot="start" />
            
            <IonLabel>{`Text message ${user?.isTextOn ? "on": "off"}`}</IonLabel>
            {user.lastTextResponse && 
              <IonIcon 
                size="small" 
                color={user.lastTextResponse.includes("success") ?"primary":"danger"} 
                icon={user.lastTextResponse.includes("success") ? checkmarkCircle : closeCircle} 
                onClick={(e:any) => {
                  setResponse(user.lastTextResponse!)
                  presentResponse({})
                }}
              />
            }
            <IonToggle
              name="text"
              ref={isTextOn}
              // checked={theme.isDark}
              onIonChange={(e) => {
                if (user?.objectId) updateUser({isTextOn: e.detail.checked})
              }}
            />
        </IonItem>
        <IonItem > 
            {/* <IonLabel slot="start">Mobile</IonLabel> */}
            <div className="flex justify-start w-full ml-10">
              <IonSelect 
                slot="start" 
                interface="action-sheet" 
                value={countryCode||"+1 US"}  
                selectedText={countryCode}
                onIonChange={(e) => {
                  setCountryCode(e.detail.value);
                  if (user?.objectId) updateUser({countryCode: e.detail.value, textErrorCount: 0, lastTextResponse: null});
                }}
              >
                {countryCodes.map((countryCode)=>{
                  return (
                    <IonSelectOption key={countryCode.dial_code+countryCode.name} value={countryCode.dial_code}>
                        {`${countryCode.dial_code} ${countryCode.name} (${countryCode.code})`}
                      </IonSelectOption>
                  )
                })
                }
              </IonSelect>
                <IonInput 
                  ref={phoneInput} 
                  type="tel" 
                  placeholder='Enter your mobile #'
                  debounce={1000}
                  onFocus={()=>setPhoneNote(undefined)}
                  onIonChange={(event) => {
                    if (typeof phoneInput.current?.value === "string" && phoneInput.current.value.length > 0) {
                      const phone = phoneInput.current?.value .replace(/[^0-9]/g,"");
                      handleInputChange({phone: Number(phone), textErrorCount: 0, lastTextResponse: null});
                  }}}
                >
              </IonInput>
            </div>

              <IonNote slot="helper"><span className="text-xs text-primary">{phoneNote}</span></IonNote>
          </IonItem>
        </>
        }
        <IonItem lines="none"></IonItem>
        {(!props.isProfile && !props.isOnboarding) && <>
        <IonItem> 
          <IonIcon icon={text} slot="start" />
          <IonButtons>
              <IonButton 
                size="small" 
                color={(fontStyle === "serif") ? "dark" : "medium"} 
                onClick={async () => {
                  if (fontStyle !== "serif") await updateUser({fontStyle: "serif"})
                  
                }}
              >     
              <IonIcon icon={(fontStyle === "serif")  ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="font-serif capitalize">Serif</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={(fontStyle === "sanserif" || typeof fontStyle === "undefined") ? "dark" : "medium"} 
                onClick={async () => {
                  if (fontStyle !== "sanserif" || typeof fontStyle === "undefined") await updateUser({fontStyle: "sanserif"})
                  
                }}
              >     
              <IonIcon icon={(fontStyle === "sanserif" || typeof fontStyle === "undefined") ? checkmarkCircle : ellipseOutline} slot="start"/>
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
                onClick={async () => {
                  if (fontSize !== "small") await updateUser({fontSize: "small"})
                  
                }}
              >     
              <IonIcon icon={fontSize === "small" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="capitalize text-md">Small</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={(fontSize === "regular" || typeof fontSize === "undefined") ? "dark" : "medium"} 
                onClick={async () => {
                  if (fontSize !== "regular") await updateUser({fontSize: "regular"})
                  
                }}
              >     
              <IonIcon icon={(fontSize === "regular" || typeof fontSize === "undefined") ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="capitalize text-md xs:text-lg">Regular</span>
            </IonButton>
              <IonButton 
                size="small" 
                color={fontSize === "large" ? "dark" : "medium"} 
                onClick={async () => {
                  if (fontSize !== "large") await updateUser({fontSize: "large"})
                  
                }}
              >     
              <IonIcon icon={fontSize === "large" ? checkmarkCircle : ellipseOutline} slot="start"/>
              <span className="capitalize text-md xs:text-xl">Large</span>
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
                onClick={async () => {
                  if (fontContrast !== "low") await updateUser({fontContrast: "low"})
                  
                }}
              >     
              <IonIcon icon={fontContrast === "low" ? checkmarkCircle : ellipseOutline} slot="start" />
              <span className="font-bold text-gray-500 dark:text-gray-500">Low</span>
            </IonButton>
              <IonButton 
                size="small" 
                onClick={async () => {
                  if (fontContrast !== "normal") await updateUser({fontContrast: "normal"})
                  
                }}
              >     
              <IonIcon icon={(!fontContrast || fontContrast === "normal") ? checkmarkCircle : ellipseOutline} slot="start" />
              <span className="font-bold text-gray-700 dark:text-gray-300">Normal</span>
            </IonButton>
              <IonButton 
                size="small" 
                onClick={async () => {
                  if (fontContrast !== "high") await updateUser({fontContrast: "high"});
                  
                  
                }}
              >     
              <IonIcon icon={fontContrast === "high" ? checkmarkCircle : ellipseOutline} slot="start" />
              <span className="font-bold text-black dark:text-white">High</span>
            </IonButton>
          </IonButtons>
        </IonItem>
        </>}
        {(props.onLogout && !props.isOnboarding) &&
          <IonItem 
            lines="none" 
          > 
            <IonButton
              onClick={async (e) => {
                if (!props.onLogout) return;
                await props.onLogout();
                if (props.router) props.router.push("/");
                props.onDismiss();
                setTimeout(()=>{if (content.current) content.current.scrollToTop();}, 200)
              }}
              fill="clear"
            >
              <IonLabel slot="end" color="danger">Log out</IonLabel>
              <IonIcon icon={logOutOutline} slot="start"  color="danger"/>    
            </IonButton>
          </IonItem>
        }
        {props.isOnboarding && 
          <IonButton
            onClick={async (e) => {
              setOnboardingUpgrade(true)
            }}
            expand="block"
            color="primary"
          >
            Next
          </IonButton>
        }
        </IonList>
      </IonContent>
    </IonPage>
  )
}


const responsePopOver = ({onDismiss, response}) => {
  return (    
    <IonContent class="ion-padding">
      <div className={'flex w-full flex-col items-center text-center'}>
        <IonText>{response ? response : ""}</IonText>
      </div>
  </IonContent>  
  )
}



export default SettingsModal