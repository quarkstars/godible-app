import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonReorderGroup, IonRippleEffect, IonTabBar, IonTabButton, IonTitle, IonToolbar, useIonModal, useIonPopover, useIonRouter } from '@ionic/react'
import { UserState } from 'components/AppShell'
import ListListItem from 'components/ui/ListListItem'
import SettingsModal from 'components/ui/SettingsModal'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { sampleEpisodes } from 'data/sampleEpisodes'
import { arrowForward, calendar, card, cardOutline, documentText, chevronForward, checkmarkCircle, today, pencil, play, flame, settingsSharp, person } from 'ionicons/icons'
import React, { useContext, useEffect, useState } from 'react'
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


  const [presentSettings, dismissSettings] = useIonModal(SettingsModal, {
    onDismiss: (data: string, role: string) => dismissSettings(data, role),
    isProfile: true,
});

  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  useEffect(() => {
    if (swiperRef) setTabIndex(swiperRef.activeIndex)
  }, [swiperRef]);
  
  const slideTo = (index) => {
    swiperRef.slideTo(index - 1, 0);
  };

  console.log(swiperRef)

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
                    >
                  <IonIcon icon={person} slot="start" />
                  Edit
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        
        <div className='w-full flex justify-center'>
          <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
            <div className='w-full bg-dark dark:bg-light p-4 rounded-lg flex items-center justify-between'>
              
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
                <div className="flex justify-start items-center">
                  <span className="w-full font-medium text-lg pl-3 xs:text-2xl">{`${user.firstName} ${user.lastName}`}</span>
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
                <IonButton size="small" fill="clear">
                  Continue to Episode 6
                  <IonIcon size="small" icon={arrowForward} slot="end" />
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
            <div className='w-full mb-6 border-b flex justify-evenly'>
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
                <div className="flex w-full flex-col items-center pb-8">
                  <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
                    <div className='flex justify-center'>
                      <IonDatetime
                        presentation="date"
                        value="2023-03-20"
                        highlightedDates={[
                          {
                            date: '2023-01-15',
                            backgroundColor: '#c0ffd9',
                          },
                          {
                            date: '2023-01-16',
                            backgroundColor: '#c0ffd9',
                          },
                          {
                            date: '2023-01-17',
                            backgroundColor: '#c0ffd9',
                          },
                          {
                            date: '2023-01-18',
                            backgroundColor: '#c0ffd9',
                          },
                          {
                            date: '2023-01-19',
                            backgroundColor: '#c0ffd9',
                          },
                        ]}
                    ></IonDatetime>
                    </div>
                    <div className="px-6 -mt-8 sm:mt-0">
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
                          <span className="line-clamp-1"><span>Inspiration </span><span className="italic text-medium">I really love that True Parents work covers business</span></span>
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
                  <button className='sm:-mt-2 w-auto bg-dark p-4 rounded-full flex items-center space-x-3 hover:opacity-50 relative overflow-hidden shadow-lg pr-4 pl-6 mt-4 focus:outline-none ion-activatable ripple-parent '>
                    <IonRippleEffect></IonRippleEffect>
                    <span className='text-lg text-center'>Text, push, and email daily at <span className="font-bold">5AM</span></span>
                            <IonIcon size="small" icon={pencil} slot="icon-only" />
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <IonList>
                  <ListListItem
                    list={{name: "Saved", episodes: sampleEpisodes, description: "Your bookmarked episodes"}}
                  />
                  <IonReorderGroup disabled={false} onIonItemReorder={() => {}}>
                    <ListListItem
                      list={{name: "How to Gain Spiritual Help", episodes: sampleEpisodes, description: "1975\nWashington Monument\nSun Myung Moon"}}
                    />
                  </IonReorderGroup>
                </IonList>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex w-full flex-col items-center pb-8">
                  <h2 className="w-full text-left text-3xl font-bold dark:text-primary text-light">Become a Godible Donor</h2>
                  <div className='w-full flex justify-between items-center'>
                    <div className='w-full flex justify-between items-center'>
                      <div className='font-medium text-lg justify-center items-center flex space-x-2'>
                        <span className='text-2xl font-bold'>$365</span>
                        <span className='text-medium text-sm'>from 26 donors</span> 
                      </div>
                      <span className='text-medium text-sm font-medium'>
                        $2.5k in March <span className="hidden xs:inline">covers expenses</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-8 border dark:bg-gray-600 rounded-lg p-1 overflow-hidden">
                    <div
                      className="bg-primary flex justify-center items-center p-0.5 h-6 rounded-md text-xs font-medium leading-none overflow-hidden text-dark"
                      style={{width: "21%"}}
                      >
                    </div>
                  </div>
                  <h5 className="text-left w-full">Godible is made possible by listeners like you</h5>
                  <div className="w-full flex justify-start">
                    <IonButton color="primary">
                      Donate Now
                    </IonButton>
                  </div>
                  <h2 className="w-full text-center text-xl font-bold pt-12 dark:text-dark">Get Unlimited Access</h2>
                  <div className="w-full grid grid-cols-1 xs:grid-cols-2 gap-6 mx-auto">
                    <div className="shadow p-5 rounded-lg border-t-4 border-primary bg-white dark:bg-gray-800">
                      <p className="uppercase text-sm font-medium text-gray-500">
                        Donor Account
                      </p>

                      <p className="mt-4 text-3xl text-gray-700 dark:text-gray-100 font-medium">
                        $Any <span className="text-base font-normal">/month</span>
                      </p>

                      <p className="mt-4 font-medium text-gray-700 dark:text-gray-100">
                        Support Godible and you get
                      </p>

                      <div className="mt-8">
                        <ul className="grid grid-cols-1 gap-4">


                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                            </div>
                              <span><span className="font-bold inline">Full access to all episodes</span> 
                              <span className="text-sm block">500+ episodes with 100+ speeches & 5 Holy Books</span>
                            </span>
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                            </div>

                            Text daily reminders
                          </li>                          
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
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

                    <div className="shadow p-5 rounded-lg border-t-4 border-medium bg-white dark:bg-gray-800">
                      <p className="uppercase text-sm font-medium text-gray-500">
                        Free Account
                      </p>

                      <p className="mt-4 text-3xl text-gray-700 dark:text-gray-100 font-medium">
                        $0 <span className="text-base font-normal"></span>
                      </p>

                      <p className="mt-4 font-medium text-gray-700 dark:text-gray-100">
                        Not yet supporting
                      </p>

                      <div className="mt-8">
                        <ul className="grid grid-cols-1 gap-4">
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>
                            1 newest episode daily
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Email and push daily reminders
                          </li>

                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Save lists of episodes
                          </li>
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Note your inspirations
                          </li>
                          <li className="flex items-start text-gray-600 dark:text-gray-200">
                            <div className="w-6 pr-2 pt-1">
                              <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                            </div>

                            Spiritual life calendar
                          </li>
                        </ul>
                      </div>


                    </div>
                  </div>
                <div className="w-full flex flex-col items-start">
                  <h2>Select your donation <span className="border-b-4 border-primary pb-1">monthly</span></h2>
                  <div>
                    <IonChip><span className="text-light text-xs pr-1">$</span><span className="font-bold text-lg">7</span></IonChip>
                    <IonChip><span className="text-light text-xs pr-1">$</span><span className="font-bold text-lg">12</span></IonChip>
                    <IonChip><span className="text-light text-xs pr-1">$</span><span className="font-bold text-lg tracking-tighter">21</span></IonChip>
                    <IonChip><span className="text-light text-xs pr-1">$</span><span className="font-bold text-lg">40</span></IonChip>
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
      <div className="flex items-center font-medium space-x-2">
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