import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonRippleEffect, IonTabBar, IonTabButton, IonTitle, IonToolbar, useIonPopover, useIonRouter } from '@ionic/react'
import { UserState } from 'components/AppShell'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { arrowForward, calendar, card, cardOutline, documentText, chevronForward, checkmarkCircle, today, pencil, play, flame, settingsSharp, person } from 'ionicons/icons'
import React, { useContext, useState } from 'react'
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
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  console.log(thumbsSwiper)


  return (
    <IonPage>
    <IonHeader>
    <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
                <div className="hidden px-2 md:block">
                    <IonBackButton />
                </div>
            </IonButtons>
            <IonTitle>
              My Profile
            </IonTitle>
            <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={person} slot="start" />
                  Edit
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        
        <div className='w-full flex justify-center'>
          <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
            <div className='w-full bg-dark p-4 rounded-lg flex items-center justify-between'>
              
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
            <div className='w-full mb-6 border-b'>
              <IonTabBar slot="bottom">
                <IonTabButton tab="home">
                  {/* <IonIcon icon={calendar} /> */}
                  <span className="text-lg">Calendar</span>
                  <div className="w-full h-0.5 bg-primary rounded-full"></div>
                </IonTabButton>
                <IonTabButton tab="home">
                  {/* <IonIcon icon={cardOutline} /> */}
                  <span className="text-lg">Donation</span>
                </IonTabButton>
                <IonTabButton tab="home">
                  {/* <IonIcon icon={cardOutline} /> */}
                  <span className="text-lg">Lists</span>
                </IonTabButton>
            </IonTabBar>
          </div>
          <div className='grid gap-4 grid-cols-1 xs:grid-cols-2'>
            <div className='flex justify-center'>
              <IonDatetime
                presentation="date"
                value="2023-01-01"
                // highlightedDates={[
                //   {
                //     date: '2023-01-05',
                //     textColor: '#800080',
                //     backgroundColor: '#ffc0cb',
                //   },
                // ]}
            ></IonDatetime>
            </div>
            <div className="px-6 -mt-8 xs:mt-0">
              <h5 className="text-center">Monday, January 7</h5>
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
                  <span className="line-clamp-1"><span>Wrote </span><span className="italic text-medium">Truncated Inspiration from something wrote on the day and more info</span></span>
                  <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
                </IonItem>
                <IonItem button>
                  <IonIcon icon={today} size="small" color="tertiary" slot="start" />
                  Ahn Shi Il
                  <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
                </IonItem>
              </IonList>
            </div>
            <Swiper
        // style={{
        //   "--swiper-navigation-color": "#fff",
        //   "--swiper-pagination-color": "#fff",
        // }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={(swipe) => setThumbsSwiper(swipe)}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
        </SwiperSlide>
      </Swiper>
          </div>
            <button className='flex w-auto bg-dark p-4 rounded-full flex items-center space-x-3 hover:opacity-50 relative overflow-hidden shadow-lg pr-4 pl-6 mt-8 focus:outline-none ion-activatable ripple-parent '>
              <IonRippleEffect></IonRippleEffect>
              <span className='text-lg text-center'>Text, push, and email daily at <span className="font-bold">5AM</span></span>
                      <IonIcon size="small" icon={pencil} slot="icon-only" />
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}


const StreakDetails = ({streak, max}) => {
  return (
    
    <IonContent class="ion-padding">
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