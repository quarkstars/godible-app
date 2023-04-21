import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonReorder, IonReorderGroup, IonRippleEffect, IonTabBar, IonTabButton, IonText, IonTitle, IonToolbar, ItemReorderEventDetail, useIonModal, useIonPopover, useIonRouter, useIonViewDidEnter } from '@ionic/react'
import { Player } from 'components/AppShell'
import { UserState } from 'components/UserStateProvider'
import ListListItem from 'components/ui/ListListItem'
import ListModal from 'components/ui/ListModal'
import { PlayerControls } from 'components/ui/PlayerControls'
import SettingsModal from 'components/ui/SettingsModal'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { sampleEpisodes } from 'data/sampleEpisodes'
import { userDefaultLanguage } from 'data/translations'
import { IList } from 'data/types'
import useLists from 'hooks/useLists'
import { arrowForward, calendar, card, cardOutline, documentText, chevronForward, checkmarkCircle, today, pencil, play, flame, settingsSharp, person, swapVertical, add, ban, closeCircle, timeOutline, logOutOutline } from 'ionicons/icons'
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
  } = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;

  //Modal
  const [presentStreak, dismissStreak] = useIonPopover(StreakDetails, {
      onDismiss: (data: string, role: string) => dismissStreak(data, role),
      currentStreak: user.currentStreak||0,
      maxStreak: user.maxStreak||0,
  });


  const [isScrollToReminders, setIsScrollToReminders] = useState(false);
  const onLogout = (user.objectId) ? logOut : undefined
  const [presentSettings, dismissSettings] = useIonModal(SettingsModal, {
    onDismiss: (data: string, role: string) => dismissSettings(data, role),
    isProfile: true,
    isScrollToReminders,
    onLogout,
    router,
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
      console.log("UNSUBSCRIBE")
      result = await Parse.Cloud.run("unsubscribe", {email}) as any;  
    } catch (err) {
      result = false;
    }
    setIsSuccess(result);
    presentUnsubscribed({});
  }
  useEffect(() => {  
    console.log("UNSUBSCRIBE", router.routeInfo.search, emailParam)
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

  //Get any updated streak when visiting the profile
  useEffect(() => {
    if (!user?.objectId) return;
    getStreak();
    //If reminder param is 1, then open settings
    if (reminders == "1" && user.objectId) {
      setIsScrollToReminders(true);
      presentSettings({
      })
    }
  }, [user?.objectId])


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
    onDismiss: (data: string, role: string) => dimissList(data, role),
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
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    let newListOrder = event.detail.complete();
    // setList(newListOrder);
    reorderLists(event.detail.from, event.detail.to)
  }


  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  useEffect(() => {
    if (!swiperRef) return;
    setTabIndex(swiperRef.activeIndex);
    // contentRef.current && contentRef.current.scrollToTop();
  }, [swiperRef?.activeIndex]);


const responsePopOver = ({onDismiss, response}) => {
  return (    
    <IonContent class="ion-padding">
      <div className={'flex w-full flex-col items-center text-center'}>
        <IonText>{response ? response : ""}</IonText>
      </div>
  </IonContent>  
  )
}


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
    if (defaultTab && defaultTab.length > 0) router.push("/profile/");
  }, [defaultTab, swiperRef]);


  
  useEffect(() => {
    if (!user.objectId) return setLists(undefined);
    getLists(undefined, {limit: 30, userId: user.objectId, sort: "+index", exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
}, [listReloads, user.objectId]);


  const dateTime = useRef<HTMLIonDatetimeElement>(null);
  const [currentDate, setCurrentDate] = useState<string>();
  const recordRange = useRef(0);
  const initializeDates = async (date: string) => {
    const month = date.slice(0, 7);  
    await getMonth(month);
    setCurrentDate(date);
    dateTime.current!.value = date;
  }
  useEffect(() => {
    currentDate
  }, [dateMap])
  
  useEffect(() => {
    if (!dateTime.current) return;

    const date = toIsoString(new Date()).slice(0,10); // get YYYY-MM-DD
    dateTime.current.value = date;
    
    initializeDates(date);
    
  }, [dateTime.current, user.objectId]);
  
  //Create date detail
  const dateDetail = useMemo(() => {
    if (typeof currentDate !== "string") return <></>
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
            No listenings or notes
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
  }, [currentDate, dateMap]);
  
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
  if (userName.length === 0) userName = "Not Logged In"


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
                <div className="hidden px-2 sm:block">
                    <IonBackButton />
                </div>
            </IonButtons>
            <IonTitle>
              <div className={'flex justify-center items-center text-lg'}>
              My Profile
              {user?.objectId &&
                <IonButtons>
                  <IonButton 
                    size="small"
                    onClick={(e: any) => {presentLogoutMenu({
                      event: e,
                      onDidDismiss: (e: CustomEvent) => {},
                      side: "left"
                    })}}
                    color="medium"
                  >
                    <IonIcon icon={logOutOutline} color="medium" size="small" slot="start" />
                  </IonButton>
                </IonButtons>
              }
              </div>
            </IonTitle>
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
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' ref={contentRef}>
        
        <div className='flex justify-center w-full'>
          <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
            <div className='flex items-center justify-between w-full p-4 rounded-lg bg-dark dark:bg-light'>
              
              <IonAvatar
                    onClick={()=>{
                      setIsScrollToReminders(false);
                      presentSettings()
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
                          <InitialsAvatar name={userName}  />
                      </div>
                  }
              </IonAvatar>
              <div className='flex flex-col justify-start'>
                <div className="flex items-center justify-start">
                  <span className="w-full pl-3 font-medium text-md xs:text-2xl mobile:text-lg">{userName}</span>
                  <div className="block xs:hidden" style={{zoom:.7}}>
                    <IonChip color="primary"
                    onClick={(e: any) =>
                      presentStreak({
                          event: e,
                          onDidDismiss: (e: CustomEvent) => {},
                          side: "left"
                      })
                      }
                    >
                      <IonIcon icon={flame} color="primary" />
                      <span className="font-black ">{user.currentStreak||0}</span>
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
              <div className="hidden xs:block">
                    <IonChip color="primary"
                    onClick={(e: any) =>
                      presentStreak({
                          event: e,
                          onDidDismiss: (e: CustomEvent) => {},
                          side: "left"
                      })
                      }
                    >
                    <IonIcon icon={flame} color="primary" />
                    <span className="font-black">{user.currentStreak||0}</span>
                  </IonChip>      
              </div>
              <div className="block xs:hidden"></div>
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
                      setIsScrollToReminders(true);
                      presentSettings({
                      })
                    }}
                    className='relative flex items-center w-auto p-4 pl-6 pr-4 mt-10 space-x-3 overflow-hidden rounded-full shadow-lg text-light sm:mt-4 bg-primary hover:opacity-80 focus:outline-none ion-activatable ripple-parent '
                  >
                    <IonRippleEffect></IonRippleEffect>
                    {(user?.isPushOn || user?.isTextOn || user?.isEmailOn) ?
                      <span className='text-lg text-center'>{`${reminderText} daily reminder at `}<span className="font-bold">{`${(user.sendHour||5) > 13 ? (user.sendHour! - 12) + "PM" : user?.sendHour == 0 ? "12AM" : user.sendHour+"AM"}`}</span></span>
                      :
                      <span className='text-lg text-center'>Daily Reminders OFF</span>
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
                    <span className="font-medium text-light dark:text-dark">My Saved Lists</span>
                    <IonButton size="small" fill="clear" color={isReordering ? "primary" : "medium"}
                      onClick={()=>{setIsReordering(prev=>!prev)}}
                    >
                      <IonIcon icon={swapVertical} slot="start" color={isReordering ? "primary" : "medium"} />
                      {isReordering ? "Done" : "Reorder"}
                    </IonButton>
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
                        className="ion-padding" 
                        disabled={listsIsLoading}
                        onClick={(e) => {
                          if (!isNamingList) {
                            setIsReordering(false);
                            setIsNamingList(true);
                            setTimeout(async () => {
                              await nameListInput.current?.setFocus();
                            }, 200);
                          } else setIsNamingList(false);
                        }}  
                      >
                          <IonIcon icon={add} slot="start"/>
                          {listsIsLoading ? "Loading..." : "Create a List"}
                      </IonButton>
                      }
                    </>
                    }
                </IonList>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col items-center w-full px-1 pb-8">
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

                            Take reading notes
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