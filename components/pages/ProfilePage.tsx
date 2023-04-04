import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonReorder, IonReorderGroup, IonRippleEffect, IonTabBar, IonTabButton, IonTitle, IonToolbar, useIonModal, useIonPopover, useIonRouter } from '@ionic/react'
import { UserState } from 'components/AppShell'
import ListListItem from 'components/ui/ListListItem'
import SettingsModal from 'components/ui/SettingsModal'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { sampleEpisodes } from 'data/sampleEpisodes'
import { arrowForward, calendar, card, cardOutline, documentText, chevronForward, checkmarkCircle, today, pencil, play, flame, settingsSharp, person, swapVertical } from 'ionicons/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import { FreeMode, Navigation, Thumbs }  from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
//https://chrisgriffith.wordpress.com/2019/05/14/ionic-design-profile-page/
const ProfilePage:React.FC = () => {

	const router = useIonRouter();



  const {
    logIn,
    logInError,
    setLogInError,
    isLoading,
    user,
    logOut,
    logOutError,
    reroutePath,
    logInWithGoogle,
    setReroutePath
  } = useContext(UserState);

  //Modal
  const [presentStreak, dismissStreak] = useIonPopover(StreakDetails, {
      onDismiss: (data: string, role: string) => dismissStreak(data, role),
      streak: 7,
      max: 10,
  });

  //Because sliders are different sizes, on switch, use scroller
  const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  };

  const [presentSettings, dismissSettings] = useIonModal(SettingsModal, {
    onDismiss: (data: string, role: string) => dismissSettings(data, role),
    isProfile: true,
});

  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  useEffect(() => {
    if (!swiperRef) return;
    setTabIndex(swiperRef.activeIndex);
    contentRef.current && contentRef.current.scrollToTop();
  }, [swiperRef?.activeIndex]);


  const [isReordering, setIsReordering] = useState(false);

  const urlParams = new URLSearchParams(router.routeInfo.search)
  const defaultTab = urlParams.get("tab");
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  useEffect(() => {
    window.scroll(0, 0);
    if (!swiperRef) return;
    switch (defaultTab) {
      case "calendar":
        swiperRef.slideTo(0);
        break;
      case "lists":
        swiperRef.slideTo(1);
        break;
      case "donation":
        swiperRef.slideTo(2);
        break;
    }  
  }, [defaultTab, swiperRef])

  

  return (
    <IonPage>
    <IonHeader>
    <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
                <div className="hidden px-2 sm:block">
                    <IonBackButton />
                </div>
            </IonButtons>
            <IonTitle>
              My Profile
            </IonTitle>
            <IonButtons slot="end">
                <IonButton
                    onClick={() =>
                      presentSettings({
                          // initialBreakpoint:0.85,
                      })
                      }
                      size="small"
                    >
                  <IonIcon icon={person} slot="start" />
                  Settings
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' ref={contentRef}>
        
        <div className='flex justify-center w-full'>
          <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
            <div className='flex items-center justify-between w-full p-4 rounded-lg bg-dark dark:bg-light'>
              
              <IonAvatar
                    onClick={()=>{router.push("/profile");}}
                    
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
              </IonAvatar>
              <div className='flex flex-col justify-start'>
                <div className="flex items-center justify-start">
                  <span className="w-full pl-3 text-lg font-medium xs:text-2xl">{`${user.firstName} ${user.lastName}`}</span>
                  <div className="block xs:hidden">
                    <IonChip color="primary"
                    onClick={(e: any) =>
                      presentStreak({
                          event: e,
                          onDidDismiss: (e: CustomEvent) => {},
                      })
                      }
                    >
                      <IonIcon icon={flame} color="primary" />
                      <span className="font-black">7</span>
                    </IonChip>   
                  </div>
                </div>
                <IonButton fill="clear">
                  <div className="flex flex-col justify-start w-full -ml-2 text-sm tracking-tight normal-case">
                    <div className="flex items-center gap-x-1">
                      My Next Episode
                      <IonIcon size="small" icon={arrowForward} slot="end" />
                    </div>
                    <div className="flex items-center text-xs text-medium">
                      Chambumo Gyeong Ep 3 
                      {/* <IonIcon size="small" icon={arrowForward} slot="end" /> */}
                    </div>
                  </div>
                </IonButton>
              </div>
              <div className="hidden xs:block">
                    <IonChip color="primary"
                    onClick={(e: any) =>
                      presentStreak({
                          event: e,
                          onDidDismiss: (e: CustomEvent) => {},
                      })
                      }
                    >
                    <IonIcon icon={flame} color="primary" />
                    <span className="font-black">7</span>
                  </IonChip>      
              </div>
              <div className="block xs:hidden"></div>
            </div>
            <div className='flex w-full mb-6 border-b justify-evenly'>
              {/* <IonTabBar slot="bottom"> */}

                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(0)}>
                      <div className="flex flex-col">
                        <span className="text-lg">Calendar</span>
                        {(tabIndex === 0) &&
                          <div className="w-full h-0.5 bg-primary rounded-full"></div>
                        }
                      </div>
                    </IonButton>
 
                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(1)}>
                      <div className="flex flex-col">
                        <span className="text-lg">Lists</span>
                        {(tabIndex === 1) &&
                          <div className="w-full h-0.5 bg-primary rounded-full"></div>
                        }
                      </div>
                    </IonButton>
                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(2)}>
                      <div className="flex flex-col">
                        <span className="text-lg">Donation</span>
                        {(tabIndex === 2) &&
                          <div className="w-full h-0.5 bg-primary rounded-full"></div>
                        }
                      </div>
                    </IonButton>

            {/* </IonTabBar> */}
          </div>
          <Swiper
              // style={{
              //   "--swiper-navigation-color": "#fff",
              //   "--swiper-pagination-color": "#fff",
              // }}
              onSlideChange={(swiper) => setTabIndex(swiper.activeIndex)}
              onSwiper={(swiper) => setSwiperRef(swiper)}
              spaceBetween={0}
              // thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation]}
              className="mySwiper2"
            >
              <SwiperSlide>
                <div className="flex flex-col items-center w-full pb-8">
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='flex justify-center'>
                      <IonDatetime
                        presentation="date"
                        value="2023-03-20"
                        highlightedDates={[
                          {
                            date: '2023-03-15',
                            backgroundColor: '#91caa8',
                          },
                          {
                            date: '2023-03-16',
                            backgroundColor: '#91caa8',
                          },
                          {
                            date: '2023-03-17',
                            backgroundColor: '#91caa8',
                          },
                          {
                            date: '2023-03-18',
                            backgroundColor: '#91caa8',
                          },
                          {
                            date: '2023-03-19',
                            backgroundColor: '#91caa8',
                          },
                        ]}
                    ></IonDatetime>
                    </div>
                    <div className="px-6 -mt-6 sm:mt-0">
                      <h5 className="text-center">Monday, March 20</h5>
                      <IonList>
                        <IonItem button>
                          <IonIcon icon={checkmarkCircle} size="small" color="primary" slot="start" />
                          Listened to Episode 6
                          <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={flame} size="small" color="primary" slot="start" />
                          Day 3 of 7-day streak
                        </IonItem>
                        <IonItem button>
                          <IonIcon icon={documentText} size="small" color="secondary" slot="start" />
                          <span className="line-clamp-1"><span>Note </span><span className="italic text-medium">I really love that True Parents work covers business</span></span>
                          <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
                        </IonItem>
                        <IonItem button>
                          <IonIcon icon={today} size="small" color="tertiary" slot="start" />
                          Ahn Shi Il
                          <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
                        </IonItem>
                      </IonList>
                    </div>
                  </div>
                  <button className='relative flex items-center w-auto p-4 pl-6 pr-4 mt-10 space-x-3 overflow-hidden rounded-full shadow-lg text-light sm:mt-4 bg-primary hover:opacity-50 focus:outline-none ion-activatable ripple-parent '>
                    <IonRippleEffect></IonRippleEffect>
                    <span className='text-lg text-center'>Text, Push, and Email daily at <span className="font-bold">5AM</span></span>
                            <IonIcon size="small" icon={pencil} slot="icon-only" />
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <IonList>
                  <ListListItem
                    list={{name: "Bookmarked Episodes", episodes: sampleEpisodes}}
                  />
                  <div className="flex items-center justify-between w-full pt-8">
                    <span className="font-medium text-medium">My Saved Lists</span>
                    <IonButton size="small" fill="clear" color={isReordering ? "primary" : "medium"}
                      onClick={()=>{setIsReordering(prev=>!prev)}}
                    >
                      <IonIcon icon={swapVertical} slot="start" color={isReordering ? "primary" : "medium"} />
                      {isReordering ? "Done" : "Reorder"}
                    </IonButton>
                  </div>
                  </IonList>
                  <IonList>
                    <IonReorderGroup disabled={!isReordering} onIonItemReorder={() => {}}>
                        <IonReorder>
                          <ListListItem
                            list={{name: "How to Gain Spiritual Help", episodes: sampleEpisodes, description: "1975\nWashington Monument\nSun Myung Moon"}}
                            isReordering={isReordering}
                          />
                        </IonReorder>
                        <IonReorder>
                          <ListListItem
                            list={{name: "How to Gain Spiritual Help", episodes: sampleEpisodes, description: "1975\nWashington Monument\nSun Myung Moon"}}
                            isReordering={isReordering}
                          />
                      </IonReorder>
                    </IonReorderGroup>

                </IonList>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col items-center w-full pb-8">
                  <h2 className="w-full text-3xl font-bold text-left dark:text-primary text-light">Become a Godible Donor</h2>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center justify-center space-x-2 text-lg font-medium'>
                        <span className='text-2xl font-bold'>$365</span>
                        <span className='text-sm text-medium'>from 26 donors</span> 
                      </div>
                      <span className='text-sm font-medium text-medium'>
                        $2.5k March goal <span className="hidden xs:inline">covers expenses</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-8 p-1 overflow-hidden bg-gray-200 border rounded-lg dark:bg-gray-600">
                    <div
                      className="bg-primary flex justify-center items-center p-0.5 h-6 rounded-md text-xs font-medium leading-none overflow-hidden text-dark"
                      style={{width: "21%"}}
                      >
                    </div>
                  </div>
                  <h5 className="w-full text-left"><span className="font-bold">Let God&apos;s Word Be Heard!</span> Godible is only made possible by listeners like you.</h5>
                  <div className="flex justify-start w-full">
                    <IonButton color="primary">
                      Donate Now
                    </IonButton>
                  </div>
                  <h2 className="w-full pt-12 text-2xl font-bold dark:text-dark">And Upgrade to Unlimited Access</h2>
                  <div className="grid w-full grid-cols-1 gap-6 mx-auto xs:grid-cols-2">
                    
                  <div className="p-5 bg-white border border-t-4 rounded-lg shadow border-medium dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-500 uppercase">
                        Free Account
                      </p>

                      <p className="mt-4 text-3xl font-medium text-gray-700 dark:text-gray-100">
                        $0 <span className="text-base font-normal"></span>
                      </p>

                      <p className="mt-4 font-medium text-gray-700 dark:text-gray-100">
                        Not yet supporting Godible
                      </p>

                      <div className="mt-8">
                        <ul className="grid grid-cols-1 gap-4">
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>
                            1 newest episode daily
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Email and push daily reminders
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Save lists of episodes
                          </li>
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Note your Notes
                          </li>
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Spiritual life calendar
                          </li>
                        </ul>
                      </div>


                    </div>
                    <div className="p-5 bg-white border border-t-4 rounded-lg shadow border-primary dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-500 uppercase">
                        Donor Account
                      </p>

                      <p className="mt-4 text-3xl font-medium text-gray-700 dark:text-gray-100">
                        $Any <span className="text-base font-normal">/month</span>
                      </p>

                      <p className="mt-4 font-medium text-gray-700 dark:text-gray-100">
                        Support Godible and you get
                      </p>

                      <div className="mt-8">
                        <ul className="grid grid-cols-1 gap-4">


                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                            </div>
                              <span><span className="inline font-bold">Full access to all episodes</span> 
                              <span className="block text-sm">500+ episodes with 100+ speeches & 5 Holy Books</span>
                            </span>
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                            </div>

                            Text daily reminders
                          </li>                          
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pt-1 pr-2">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            All features of a free account
                          </li>
                        </ul>
                      </div>

                      <div className="mt-8">
                        <IonButton size="large" color="primary" expand="block">
                          Donate Now
                        </IonButton>
                      </div>
                    </div>

                  </div>
                <div className="flex flex-col items-start w-full">
                  <h2>Select your donation <span className="pb-1 border-b-4 border-primary">monthly</span></h2>
                  <div>
                    <IonChip><span className="pr-1 text-xs text-light">$</span><span className="text-lg font-bold">7</span></IonChip>
                    <IonChip><span className="pr-1 text-xs text-light">$</span><span className="text-lg font-bold">12</span></IonChip>
                    <IonChip><span className="pr-1 text-xs text-light">$</span><span className="text-lg font-bold tracking-tighter">21</span></IonChip>
                    <IonChip><span className="pr-1 text-xs text-light">$</span><span className="text-lg font-bold">40</span></IonChip>
                    <IonChip>Enter an amount</IonChip>
                  </div>
                </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}


const StreakDetails = ({streak, max}) => {
  return (
    
    <IonContent className="ion-padding">
    <div className="flex flex-col items-center space-x-1">
      <div className="flex items-center space-x-2 font-medium">
        <IonIcon size="small" icon={flame} color="primary" />
          {`${streak ? streak : 0}-Day Streak`}
      </div>
      <div className="flex items-center space-x-1 text-medium">
          {`${max ? max : 0}-day max streak`}
      </div>
    </div>
    </IonContent>
  )
}

export default ProfilePage