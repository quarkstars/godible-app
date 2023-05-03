import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonReorder, IonReorderGroup, IonRippleEffect, IonTabBar, IonTabButton, IonText, IonTitle, IonToolbar, ItemReorderEventDetail, useIonModal, useIonPopover, useIonRouter, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react'
import { Player } from 'components/AppShell'
import { UserState } from 'components/UserStateProvider'
import Hero from 'components/ui/Hero'
import ListListItem from 'components/ui/ListListItem'
import ListModal from 'components/ui/ListModal'
import { PlayerControls } from 'components/ui/PlayerControls'
import Pricing from 'components/ui/Pricing'
import SettingsModal from 'components/ui/SettingsModal'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import TrailerModal from 'components/ui/TrailerModal'
import { sampleEpisodes } from 'data/sampleEpisodes'
import { userDefaultLanguage } from 'data/translations'
import { IList } from 'data/types'
import useDonation from 'hooks/useDonation'
import useLists from 'hooks/useLists'
import { arrowForward, calendar, card, cardOutline, documentText, chevronForward, checkmarkCircle, today, pencil, play, flame, settingsSharp, person, swapVertical, add, ban, closeCircle, timeOutline, logOutOutline, playCircle } from 'ionicons/icons'
import { list } from 'postcss'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import { FreeMode, Navigation, Thumbs }  from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { addMonths } from 'utils/addMonths'
import { formatDate } from 'utils/formatDate'
import { resolveLangString } from 'utils/resolveLangString'
import { toIsoString } from 'utils/toIsoString'
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
    setReroutePath,
    getMonth,
    dateMap,
    setListReloads,
    listReloads,
    getStreak,
    setDateMap,
    getCurrentUser,
    isModalOpen,
  } = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;
  useIonViewDidEnter(() => {
    if (user?.objectId) getCurrentUser();
  }, [user?.objectId]);

  //Modal
  const [presentStreak, dismissStreak] = useIonPopover(StreakDetails, {
      onDismiss: (data: string, role: string) => dismissStreak(data, role),
      currentStreak: user.currentStreak||0,
      maxStreak: user.maxStreak||0,
  });


  const [isScrollToReminders, setIsScrollToReminders] = useState(false);
  const onLogout = (user?.objectId) ? logOut : undefined
  const [presentSettings, dismissSettings] = useIonModal(SettingsModal, {
    onDismiss: (data: string, role: string) => {
      dismissSettings(data, role); 
      if (isModalOpen) isModalOpen.current = false;
    },
    isProfile: true,
    isScrollToReminders,
    onLogout,
    router,
    // isOnboarding: true,
});
//Handle unsubsribe or reminder in url params
  const urlParams = new URLSearchParams(router.routeInfo.search)
  const emailParam = urlParams.get("unsubscribe");
  const reminders = urlParams.get("reminders");
  const [isSuccess, setIsSuccess] = useState(false);
  const [presentUnsubscribed, dismissUnsubscribed] = useIonPopover(unsubscribePopOver, {
    onDismiss: (data: string, role: string) => dismissUnsubscribed(data, role),
    isSuccess,
    email: emailParam,
  });
  const unsubscribe = async (email: string) => {
    let result:any;
    try {
      result = await Parse.Cloud.run("unsubscribe", {email}) as any;  
    } catch (err) {
      result = false;
    }
    setIsSuccess(result);
    presentUnsubscribed({});
  }
  useEffect(() => {  
    if (!router.routeInfo.search) return;
    if (emailParam && emailParam.length > 0) unsubscribe(emailParam);
  }, [router.routeInfo.search]);

 

const player = useContext(Player);
    
  const {
    getLists, 
    setLists,
    postList,
    isLoading: listsIsLoading,
    error: listError,
    lists,
    skip: listSkip,
    deleteList,
    reorderLists
  } = useLists();

  // //Get any updated streak when visiting the profile
  // useEffect(() => {
  //   if (!user?.objectId) return;
  //   getStreak();
  //   //If reminder param is 1, then open settings
  //   if (reminders == "1" && user?.objectId) {
  //     setIsScrollToReminders(true);
  //     presentSettings({
  //     })
  //   }
  // }, [user?.objectId])

    //List modal trigger
    const [presentTrailer, dismissTrailer] = useIonModal(TrailerModal, {
      onDismiss: (data: string, role: string) => {
        dismissTrailer(data, role); 
        if (isModalOpen) isModalOpen.current = false;
      },

    })

  //Focus name input
  const nameListInput = useRef<HTMLIonInputElement>(null);
  const [isNamingList, setIsNamingList] = useState(false);
  //List Modal
  const [inspectedListIndex, setInspectedListIndex] = useState<number|undefined>();
  function setList(list?: IList) {
    setLists(prevLists => {
      if (typeof inspectedListIndex !== "number" || !list) return prevLists;
      let newLists = prevLists || [];
      newLists[inspectedListIndex] = list;
      return newLists;
    })
    player.setList(list);
  }
  //get player index if it matches the current episode

  let playerIndex = (typeof player.index === "number" &&  player.list?.episodes?.[player.index] &&  lists?.[inspectedListIndex||0]?.episodes?.[player.index]?.objectId === player.list?.episodes?.[player.index]?.objectId) ? player.index : undefined
  //List modal trigger
  const [presentList, dimissList] = useIonModal(ListModal, {
    onDismiss: (data: string, role: string) => {
      dimissList(data, role); 
      if (isModalOpen) isModalOpen.current = false;
    },
      list: lists?.[inspectedListIndex||0],
      setList: setList,
      index: playerIndex,
      setIndex: player.setIndex,
      isBookmarks: inspectedListIndex === 0,
      router,
  });
   //List modal trigger
   const [presentLogoutMenu, dismissLogoutMenu] = useIonPopover(LogoutMenu, {
    onDismiss: (data: string, role: string) => dismissLogoutMenu(data, role),
      logOut,
      router,
  });   

  //List saving
  async function handleSaveList(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, _name?: string) {
    let saveList;
    let name = (_name === "Bookmarks") ? "More Bookmarks" : _name;
    if (lists && lists.length >= 1) saveList = {name, index: lists.length};
    else return setListReloads(prev => prev + 1);
    const updatedList = await postList(saveList);
    setListReloads(prev => prev + 1);
  }
  //List deleting
  async function handleDelete(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, episodeId: string) {
    if (!lists) return;
    await deleteList(episodeId);
    setListReloads(prev => prev + 1);
  }

  //Handle play
  async function handlePlay(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, listIndex: number) {
    const episode = lists?.[listIndex]?.episodes?.[0];
    if (!episode) return;
    //Reverse episodes because playlist should be incremental
      event.preventDefault();
      player.setIsAutoPlay(true);
      player.setList(lists?.[listIndex]);
      player.setIndex(0);
      if (!player.isPlaying) player.togglePlayPause(true);
      if (router) router.push(episode._path!);
  }

  //Handle reordering
  const [isReordering, setIsReordering] = useState(false);
  async function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    let newListOrder = event.detail.complete();
    // setList(newListOrder);
    await reorderLists(event.detail.from, event.detail.to)
    setListReloads(prev => prev + 1);
  }


  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  useEffect(() => {
    if (!swiperRef) return;
    setTabIndex(swiperRef.activeIndex);
    // contentRef.current && contentRef.current.scrollToTop();
  }, [swiperRef?.activeIndex]);

  //Monthly donation
  //donation is an array of two items: amount in cents and # of donors
  const [donations, setDonations] = useState<number[]>([0, 0]);
  const {getMonthlyDonation} = useDonation();
  useEffect(() => {
    const getAmount = async () => {
      const newDonations = await getMonthlyDonation();
      if (newDonations) setDonations(newDonations);
    }
    getAmount();
  }, [])
  const goal = 5000;
  //amount is in cents so it already makes meter a percentage of 100
  let meter = donations[0]/goal;
  if (meter > 100) meter = 100;
  if (meter === 0) meter = 1;
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const thisMonth = monthNames[new Date().getMonth()]
  


  const defaultTab = urlParams.get("tab");
  const contentRef = useRef<HTMLIonContentElement | null>(null);



  useEffect(() => {
    // window.scroll(0, 0);
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
    // if (defaultTab && defaultTab.length > 0) router.push("/profile/");
  }, [defaultTab, swiperRef]);


  
  useEffect(() => {
    if (!location.pathname.includes("profile")) return setLists(undefined);
    if (!user?.objectId) return setLists(undefined);
    getLists(undefined, {limit: 30, userId: user?.objectId, sort: "+index", exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
  }, [listReloads, user?.objectId, location.pathname]);


  const dateTime = useRef<HTMLIonDatetimeElement>(null);
  const [currentDate, setCurrentDate] = useState<string>();
  const recordRange = useRef(0);
  const initializeDates = async (date: string) => {
    const month = date.slice(0, 7);  
    await getMonth(month, true);
    setCurrentDate(date);
    dateTime.current!.value = date;
  }

  useEffect(() => {
    if (!dateTime.current) return setDateMap({});
    if (!location.pathname.includes("profile")) return setDateMap({});

    const date = toIsoString(new Date()).slice(0,10); // get YYYY-MM-DD
    dateTime.current.value = date;
    
    initializeDates(date);
    
  }, [dateTime.current, user?.objectId, location.pathname]);

  
  
  //Create date detail
  const dateDetail = useMemo(() => {
    if (typeof currentDate !== "string" || !dateMap) return <></>
    const formattedDate = formatDate(currentDate);
    // const hasDate = dateMap.hasOwnProperty(currentDate);
    let records = dateMap[currentDate];
    const listenings = records?.listenings;
    let listening = listenings?.[0];
    const notes = records?.notes;
    return (
      <div className="px-6 -mt-6 sm:mt-0">
        <h5 className="text-center">{formattedDate}</h5>
        {(!listening?.positions && !notes) && 
          <span className="flex justify-center w-full py-4 text-medium">
            {user?.objectId ? "No listenings or notes" : "Track your listenings and notes here"}
          </span>
        }
        <IonList>
          {listening?.positions && listening?.positions.map((position, index) => {
            if (index > 2) return <></>
            else return (
              <IonItem button 
                  onClick={(e) => {
                    if (position?.episode?.slug) router.push("/episode/"+position?.episode?.slug)
                  }} 
                  key={position?.episode?.objectId+"-"+index}
                >
                <IonIcon icon={checkmarkCircle} size="small" color="secondary" slot="start" onClick={(e) => {
                  
                }} />
                  {`Listened to Episode${typeof position?.episode?.number === "number" ? " "+ position?.episode?.number :""}`}
                <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />
              </IonItem>
            )
          })
          }
          {listening?.positions && listening?.positions.length > 3 && <span className="flex justify-center w-full text-sm text-medium">{`and ${listening.positions.length - 3} more`}</span>}
          {notes && notes.map((note, index) => {
            if (index > 2) return <></>
            return (
              <IonItem 
                button 
                key={note.objectId} 
                onClick={(e) => { if (note.episode?.slug) router.push(`/episode/${note.episode?.slug}?notes=1`)}}
              >
                <IonIcon icon={documentText} size="small" color="tertiatry" slot="start" />
                <span className="line-clamp-1"><span>Note </span><span className="italic text-medium">{note?.text}</span></span>
                {note.episode?.slug && <IonIcon icon={chevronForward} size="small" color="medium" slot="end" />}
              </IonItem>
            )
          })
          }
          {notes && notes.length > 3 && <span className="flex justify-center w-full text-sm text-medium">{`and ${notes.length - 3} more`}</span>}

        </IonList>
      </div>
    )
  }, [currentDate, dateMap, location.pathname]);
  //Refetch Months
  function handleDateChange(e) {
    if (typeof e.detail.value !== "string") return;
    setCurrentDate(e.detail.value.slice(0,10));
    recordRange.current = 0;
  }
  function handleDateClick(e) {
    if (typeof e.target.value !== "string") return;
    const month = e.target.value.slice(0, 7);
    let expandedRange = recordRange.current+1
    const minMonth = addMonths(month, expandedRange*-1)
    const maxMonth = addMonths(month, expandedRange)
    getMonth(minMonth);
    getMonth(maxMonth);
    recordRange.current = recordRange.current + 1
  }

  
  
  let userName = `${user?.firstName ? user?.firstName:""}${user?.lastName ? " "+user?.lastName:""}`
  if (userName.length === 0) userName = "Your Hoon Dok Hae Profile!"


  //Construct Reminder Button Text
  const reminderTextArray = [] as string[];
  if (user.isPushOn) reminderTextArray.push("Push");
  if (user.isTextOn) reminderTextArray.push("Text");
  if (user.isEmailOn) reminderTextArray.push("Email");
  const reminderText = reminderTextArray.join(", ")
  

  return (
  <IonPage>
    <IonHeader>
    <IonToolbar>
          <IonButtons slot="start">
            
        
            <IonMenuButton />
            <IonBackButton />

            </IonButtons>
            <IonTitle>
              <div className={'flex items-center text-lg'}>
              {user?.objectId ? "My Profile" : "Welcome to Godible"}
              {user?.objectId &&
                <IonButtons>
                  <IonButton 
                    size="small"
                    onClick={(e: any) => {presentLogoutMenu({
                      onDidDismiss: (e: CustomEvent) => {},

                      
                    })}}
                    color="medium"
                  >
                    <IonIcon icon={logOutOutline} color="medium" size="small" slot="start" />
                  </IonButton>
                </IonButtons>
              }
              </div>
            </IonTitle>
            {user?.objectId &&
            <IonButtons slot="end">
                <IonButton
                    onClick={(e: any) =>{
                      setIsScrollToReminders(false);
                      presentSettings({
                          // initialBreakpoint:0.85,
                          // event: e,
                      })}
                      }
                      size="small"
                    >
                  <IonIcon icon={person} slot="start" size="small" />
                  <span className="text-xs mobile:text-md">Settings</span>
                </IonButton>
            </IonButtons>
            }
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' ref={contentRef}>
        
        <div className='flex justify-center w-full'>
          <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
            {(!user?.objectId && !isLoading) && 
              <div className="flex flex-col w-full pb-2">
                <Hero 
                  title={"Let God's Word Be Heard"}
                  // subtitle={"Playable Hoon Dok Hae"}
                  mainButtonText={"Get Started"}
                  onClickMain={() => {player.togglePlayPause(false);router.push("/signup")}}
                  subButtonText={"Trailers"}
                  subButtonIcon={playCircle}
                  onClickSub={() => {presentTrailer({})}}
                  overlayColor={"linear-gradient(90deg, rgba(97,219,146,.4) 0%, rgba(0,165,196,.2) 100%)"}
                  bgImageUrl={"/img/godible-bg.jpg"} //"/logo/godible.png"
                  preImageUrl={"/logo/godible-logo-white.png"}
                  // postText={"Now available as an Android and iOS Phone App"}
                  isRounded
                /> 
              </div>
            }
            <div className='flex items-center justify-between w-full p-4 rounded-lg bg-dark dark:bg-light'>
              <div className="flex items-center">
              <IonAvatar
                    onClick={()=>{
                      setIsScrollToReminders(false);
                      if (user?.objectId) presentSettings()
                      else router.push("/signin")
                    }}
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
                          <InitialsAvatar name={user?.objectId ? userName : "→"}  />
                      </div>
                  }
              </IonAvatar>
              <div className='flex flex-col justify-start'>
                <div className="flex items-center justify-start">
                  <span className="w-full pl-3 font-medium text-md mobile:text-2xl">{userName}</span>
                  <div className="block mobile:hidden" style={{zoom:.7}}>
                    <IonChip color="primary"
                    onClick={(e: any) => {
                        if (user?.objectId) {
                            presentStreak({
                              onDidDismiss: (e: CustomEvent) => {},
    
                          })
                        }
                        else router.push("/signin")
                        }
                      }
                    >
                      {user?.objectId && <IonIcon icon={flame} color="primary" />}
                      {user?.objectId ? <span className="font-black ">{user.currentStreak||0}</span> : <span className="font-medium ">Login</span>}
                    </IonChip>   
                  </div>
                </div>
                {user.nextEpisode && 
                <IonButton 
                  fill="clear"
                  disabled={(user.nextEpisode?.publishedAt && user.nextEpisode?.publishedAt > Date.now())? true: false}
                  onClick={(e) => {if (user.nextEpisode?._path) router.push(user.nextEpisode._path)}}
                >
                  <div className="flex flex-col justify-start w-full -ml-2 text-sm tracking-tight normal-case">
                    <div className="flex items-center gap-x-1">
                      My Next Episode
                      <IonIcon size="small" icon={(user.nextEpisode?.publishedAt && user.nextEpisode?.publishedAt > Date.now())? timeOutline: arrowForward} slot="end" />
                    </div>
                    <div className="flex items-center text-xs text-medium">
                      {`${resolveLangString(user.nextEpisode.book?.title, lang)} Ep ${user.nextEpisode.number}`}
                    </div>
                  </div>
                </IonButton>
                }
              </div>
              </div>
              <div className="hidden mobile:block">
                    <IonChip color="primary"
                    onClick={(e: any) =>{
                      if (user?.objectId) {
                          presentStreak({
                            onDidDismiss: (e: CustomEvent) => {},

                        })
                      }
                      else router.push("/signin")
                      }
                    }
                    >
                    <IonIcon icon={user?.objectId ? flame : arrowForward} color="primary" />
                    {user?.objectId ? <span className="font-black">{user.currentStreak||0}</span> : <span className="font-medium "  style={{minWidth: "50px"}}>Log in</span>}
                  </IonChip>      
              </div>
              <div className="block mobile:hidden"></div>
            </div>
            <div className='flex w-full mt-4 mb-6 border-b justify-evenly'>
              {/* <IonTabBar slot="bottom"> */}

                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(0)}>
                      <div className="flex flex-col">
                        <span className="text-md mobile:text-lg">Calendar</span>
                        {(tabIndex === 0) &&
                          <div className="w-full h-0.5 bg-primary rounded-full"></div>
                        }
                      </div>
                    </IonButton>
 
                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(1)}>
                      <div className="flex flex-col">
                        <span className="text-md mobile:text-lg">Lists</span>
                        {(tabIndex === 1) &&
                          <div className="w-full h-0.5 bg-primary rounded-full"></div>
                        }
                      </div>
                    </IonButton>
                    <IonButton fill="clear" onClick={() => swiperRef.slideTo(2)}>
                      <div className="flex flex-col">
                        <span className="text-md mobile:text-lg">Donation</span>
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
              allowTouchMove={false}
              // thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation]}
              className="mySwiper2"
            >
              <SwiperSlide>
                <div className="flex flex-col items-center w-full pb-8">
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='flex justify-center'>
                      <IonDatetime
                        ref={dateTime}
                        presentation="date"
                        onIonChange={(e) => {
                          handleDateChange(e)
                        }}
                        onClick={(e) => {
                          handleDateClick(e)
                        }}
                        highlightedDates={(date) => {
                          if (!dateMap) return;
                          if(dateMap.hasOwnProperty(date) && dateMap[date].listenings) return {
                            textColor: '#000000',
                            backgroundColor: '#61eac8'
                            };
                            
                          if(dateMap.hasOwnProperty(date) && dateMap[date].notes) return {
                            textColor: '#000000',
                            backgroundColor: '#afc4b7'
                            };
                  
                          return undefined;
                        }}
                    ></IonDatetime>
                    </div>
                    {dateDetail}

                  </div>
                  <button 
                    onClick={()=>{
                      if (!user?.objectId)  {
                        router.push("/signin")
                        return;
                      }
                      setIsScrollToReminders(true);
                      presentSettings({
                      })
                    }}
                    className='relative flex items-center w-auto p-4 pl-6 pr-4 mt-10 space-x-3 overflow-hidden rounded-full shadow-lg text-light sm:mt-4 bg-primary hover:opacity-80 focus:outline-none ion-activatable ripple-parent '
                  >
                    <IonRippleEffect></IonRippleEffect>
                    {(user?.isPushOn || user?.isTextOn || user?.isEmailOn) ?
                      <span className='text-lg text-center'>{`${reminderText} daily reminder at `}<span className="font-bold">{`${(user.sendHour||8) > 13 ? (user.sendHour! - 12) + "PM" : user?.sendHour == 0 ? "12AM" : user.sendHour+"AM"}`}</span></span>
                      :
                      <span className='text-lg text-center'>{user?.objectId ? "Daily Reminders OFF" : "Get Daily Text, Email, Push Reminders"}</span>
                    }
                            <IonIcon size="small" icon={pencil} slot="icon-only" />
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <IonList>
                  {lists && lists[0] &&
                  <ListListItem
                    list={lists[0]}
                    onPlay={(e) => handlePlay(e, 0)}
                    onClick={(e) => {
                      if (isReordering || isLoading) return;
                      e.preventDefault();
                      setInspectedListIndex(0)
                      presentList({
                        onDidDismiss: () => {setInspectedListIndex(undefined)},

                      })
                    }}
                    
                  />
                  }
                  <div className="flex items-center justify-between w-full pt-8">
                    {user?.objectId && lists && lists.length > 1 && <span className="font-medium text-light dark:text-dark">My Saved Lists</span>}
                    {(lists && lists.length > 2) && 
                    <IonButton size="small" fill="clear" color={isReordering ? "primary" : "medium"}
                      onClick={()=>{setIsReordering(prev=>!prev)}}
                    >
                      <IonIcon icon={swapVertical} slot="start" color={isReordering ? "primary" : "medium"} />
                      {isReordering ? "Done" : "Reorder"}
                    </IonButton>
                    }
                  </div>
                  </IonList>
                  <IonList>
                  <IonReorderGroup disabled={!isReordering} onIonItemReorder={(e) => {handleReorder(e)}}>
                        {lists && [...lists].slice(1,lists.length).map((list, _index) => {
                          return (
                          <IonReorder key={"mylists-"+list.objectId}>
                            <ListListItem
                              list={list}
                              onPlay={(e) => handlePlay(e, _index+1)}
                              isReordering={isReordering}
                              disabled={listsIsLoading}
                              onClick={(e) => {
                                if (isReordering || isLoading) return;
                                e.preventDefault();
                                setInspectedListIndex(_index+1)
                                presentList({
                                  onDidDismiss: () => {setInspectedListIndex(undefined)},
          
                                })
                              }}
                              onDelete={(e, listId) => {
                                if (isReordering || isLoading) return;
                                e.preventDefault();
                                handleDelete(e, listId);
                              }}
                            />
                          </IonReorder>
                          )
                        })}

                    </IonReorderGroup>
                    {(lists && lists.length >= 30) ?
                    <IonItem color="medium" fill="outline" lines="none" className="ion-padding">
                        <IonIcon icon={ban} slot="start"/>
                        You have reached the 30 list limit. (Delete a list to make a new one)
                    </IonItem>
                    :
                    <>
                      
                      {isNamingList ?
                      <div className="flex w-full">
                        <div className="w-full">
                      <IonItem>
                        <IonInput 
                          placeholder="Name your list..." 
                          ref={nameListInput}
                          onIonChange={(e) => {
                            if (typeof e.detail.value !== "string") return;
                          }}
                        >
                        </IonInput>
                      </IonItem>
                      </div>
                      <IonButtons slot="end">
                        <IonButton onClick={(e) => {
                          const name = typeof nameListInput.current?.value === "string" ? nameListInput.current?.value : undefined
                          handleSaveList(e, name?.slice(0,250));
                          setIsNamingList(false);
                        }}  
                          size="small"
                          color="primary"
                          fill="clear"
                        >
                        <IonIcon icon={checkmarkCircle} slot="start" />
                          Save
                        </IonButton>
                        <IonButton onClick={(e) => {
                          setIsNamingList(false);
                        }}  
                          size="small"
                          color="medium"
                          fill="clear"
                        >
                        <IonIcon icon={closeCircle} slot="start" />
                          Cancel
                        </IonButton>
                      </IonButtons>
                      </div>
                      :
                      <IonButton 
                        color="medium" 
                        fill="clear" 
                        expand="block"
                        className="ion-padding" 
                        disabled={listsIsLoading}
                        onClick={(e) => {
                          if (!user?.objectId) {
                            router.push("/signin")
                            return;
                          }
                          if (!isNamingList) {
                            setIsReordering(false);
                            setIsNamingList(true);
                            setTimeout(async () => {
                              await nameListInput.current?.setFocus();
                            }, 200);
                          } else setIsNamingList(false);
                        }}  
                      >
                        {user?.objectId ? <>
                          <IonIcon icon={add} slot="start"/>
                          {listsIsLoading ? "Loading..." : "Create a List"}
                        </>
                        :
                        <span>Save your favorite episodes</span>
                        
                      }
                      </IonButton>
                      }
                    </>
                    }
                </IonList>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col items-center w-full px-1 pb-8">
                  {!user?.subscriptionId &&<h2 className="w-full text-3xl font-bold text-left dark:text-primary text-light">Become a Godible Donor</h2>}
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center justify-center space-x-2 text-lg font-medium'>
                        <span className='text-2xl font-bold'>{`$${Math.floor(donations[0]/100)}`}</span>
                        <span className='text-sm text-medium'>{`from ${donations[1]} donors`}</span> 
                      </div>
                      <span className='text-sm font-medium text-medium'>
                        {`$${Math.floor(goal/100)/10}k ${thisMonth} goal `}<span className="hidden xs:inline">covers expenses</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-8 p-1 overflow-hidden bg-gray-200 border rounded-lg dark:bg-gray-600">
                    <div
                      className="bg-primary flex justify-center items-center p-0.5 h-6 rounded-md text-xs font-medium leading-none overflow-hidden text-dark"
                      style={{width: `${meter}%`}}
                      >
                    </div>
                  </div>
                  <h5 className="w-full text-left"><span className="font-bold">Let God&apos;s Word Be Heard!</span> Godible is only made possible by listeners like you.</h5>
                  <div className="flex justify-start w-full">
                  {!user?.subscriptionId &&
                      <IonButton 
                      color="primary" 
                      onClick={() => {player.togglePlayPause(false);
                        setReroutePath(undefined);
                        router.push("/donation")}
                      }
                      >
                        Donate Now
                      </IonButton>
                    }
                  </div>
                  <h2 className="w-full pt-12 text-2xl font-bold dark:text-dark">{user?.subscriptionId ? "Thank you for your donation" : "And Upgrade to Unlimited Access"}</h2>
                  <Pricing 
                    onClick={() => {
                      setReroutePath(undefined);
                      player.togglePlayPause(false);
                      router.push("/donation")
                    }} 
                    />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}


const StreakDetails = ({currentStreak, maxStreak}) => {
  return (
    
    <IonContent className="ion-padding">
    <div className="flex flex-col items-center space-x-1">
      <div className="flex items-center space-x-2 font-medium">
        <IonIcon size="small" icon={flame} color="primary" />
          {`${currentStreak}-day Streak`}
      </div>
      <div className="flex items-center space-x-1 text-medium">
          {`${maxStreak}-day max streak`}
      </div>
    </div>
    </IonContent>
  )
}



const LogoutMenu = ({onDismiss, logOut, router}) => {
  return (    
    <IonContent class="ion-padding">
      <IonTitle>Confirm log out...</IonTitle>
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" 
                  onClick={(e) => {
                    logOut();
                    router.push("/")
                    onDismiss();
                  }}
                >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={checkmarkCircle} color="danger" />
                        <IonLabel color="danger">Log out</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block" 
                  onClick={(e) => {
                    onDismiss();
                  }}
                >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={closeCircle} color="medium" />
                        <IonLabel color="medium">Cancel</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
  </IonContent>  
  )
}

const unsubscribePopOver = ({onDismiss, email, isSuccess}) => {
  return (    
    <IonContent class="ion-padding">
      <div className={'flex w-full flex-col items-center text-center'}>
      {isSuccess ? 
      <IonText>{`You have successfully unsubscribed${email ? " " + email : ""}`}</IonText>
      :
      <IonText>{`Sorry, something went wrong unsubscribing${email ? " " + email : ""}. Try unsubcribing in your account settings or contact support.`}</IonText>
      }
      <IonButton onClick={onDismiss}>Close</IonButton>
      </div>
  </IonContent>  
  )
}

export default ProfilePage