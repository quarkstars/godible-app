import {
  IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonToggle,
    useIonModal,
    useIonRouter,
  } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, arrowForward, bookmark, bookmarkOutline, heartOutline, heartSharp, list, listCircle, listCircleOutline, mailOutline, mailSharp, moonOutline, paperPlaneOutline, paperPlaneSharp, reorderFour, settingsSharp, sunnyOutline, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { Player, Theme } from 'components/AppShell';
import { pages } from 'components/Routes';
import SettingsModal from './SettingsModal';
import useLists from 'hooks/useLists';
import ListModal from './ListModal';
import { UserState } from 'components/UserStateProvider';
import { IList } from 'data/types';
  
  interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }
  
  
const Menu: React.FC = () => {
    const location = useLocation();
    const router = useIonRouter();

    let hideClass:string|undefined;
    if (location.pathname === "/signup" || location.pathname === "/signin") {
      // If there are url params, don't hide menu beacuse it can cause bugs
      if (!router.routeInfo.search) hideClass = "hide"
    }

  const player = useContext(Player);
    
  const {
    getLists, 
    setLists,
    postList,
    isLoading: listsIsLoading,
    error: listError,
    lists,
    skip: listSkip,
  } = useLists();
  
  const {
    user,
    listReloads,
    setListReloads,
    logOut,
    isModalOpen,
    setReroutePath,
  } = useContext(UserState);


  useEffect(() => {
      if (!user?.objectId) return setLists(undefined);
      getLists(undefined, {limit: 5, userId: user?.objectId, sort: "+index", exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
  }, [listReloads, user?.objectId]);

  //Create a Bookmarks list by default
  useEffect(() => {
    if (!user?.objectId || !lists) return;
    if (lists.length === 0) postList({name: "Bookmarks", index: 0});
    if (listReloads === 0) setTimeout(() => {setListReloads(prev => prev + 1)}, 5000)
  }, [lists]);
  

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
    
    //Settings Modal
  const onLogout = (user?.objectId) ? logOut : undefined;
  
    //Settings Modal
    const [presentSettings, dimissSettings] = useIonModal(SettingsModal, {
      onDismiss: (data: string, role: string) => {
          // if (userState.isModalOpen) userState.isModalOpen.current = false;
          dimissSettings(data, role); 
        },
        router,
        onLogout,
  });

  function openSettingsModal() {
      presentSettings({
          initialBreakpoint:0.85,
      })
  }
  
    return (
        <IonMenu contentId="main" type="overlay" className={hideClass}>
          <IonContent>
            <div className="flex flex-col items-start justify-start w-full h-full max-h-screen overflow-y-scroll border-r-2 border-gray-400 border-opacity-10" id="menu">
              <div className="items-center justify-center w-full">
                <IonList id="inbox-list" >
                  <IonListHeader>
                    <img src='/logo/godible-logo.png' className='w-32 mb-4' onClick={() => router.push("/")} />
                  </IonListHeader>
                  {pages.map((page, index) => {
                    if (!page.isNav) return;
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem 
                          className={location.pathname === page.path ? 'selected' : ''} 
                          //Search Query is empty to start
                          routerLink={page.path} 
                          routerDirection="forward" 
                          lines="none" 
                          detail={false}
                          ion-padding={false}
                        >
                          <IonIcon slot="start" ios={page.iosIcon} md={page.icon} />
                          <IonLabel>{page.label}</IonLabel>
                        </IonItem>
                      </IonMenuToggle>
                    );
                  })}
                </IonList>
              </div>
              <div className="items-start justify-start flex-grow w-full overflow-y-scroll min-h-[100px]" style={{minHeight: "100px"}}>
                <IonList id="labels-list">
                  {lists ? [...lists].slice(0,4).map((myList, index) => (
                    <IonItem 
                      lines="none" 
                      key={myList.objectId} 
                      onClick={(e: any) => {
                        e.preventDefault();
                        setInspectedListIndex(index)
                        presentList({
                          // onDidDismiss: () => {setInspectedListIndex(undefined)},
                          // list: myList,

                        })
                      }}
                      routerDirection="forward"  
                      button 
                    >
                      <IonIcon slot="start" icon={myList.name==="Bookmarks" ? bookmark : list} />
                      <IonLabel>{myList.name}</IonLabel>
                    </IonItem>
                  ))
                :
                  <IonItem 
                    lines="none" 
                    routerDirection="forward"  
                    button 
                    onClick={()=>{
                       player.togglePlayPause(false);
                       setReroutePath(router.routeInfo.pathname)
                      router.push("/signin?message=Log in to save bookmarks");
                    }}
                  >
                    <IonIcon slot="start" icon={bookmark} />
                    <IonLabel>Bookmarks</IonLabel>
                  </IonItem>
                  }
                  {lists && lists.length > 4 &&
                  <IonItem 
                    lines="none" 
                    routerLink={"/profile?tab=lists"}
                    routerDirection="forward"  
                    button 
                  >
                    <IonIcon slot="start" icon={arrowForward} color="medium" />
                    <IonLabel><span className="italic text-medium">All Lists</span></IonLabel>
                  </IonItem>
                }
                </IonList>
              </div>
              <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10"></span>
              <div className="flex items-center justify-center w-full md:justify-start">
                <IonButton 
                    onClick={()=> {
                      openSettingsModal()
                    }}
                    routerDirection="none" 
                    fill="clear"
                    size="small" 
                  >
                    <IonIcon slot="icon-only" size="small" icon={settingsSharp} />
                  </IonButton>
                  {!user.subscriptionId &&
                  <>
                    <div className="h-full border-r dark:border-gray-800" />
                    <IonButton 
                        routerLink={"/profile?tab=pro"}
                        routerDirection="forward" 
                        fill="clear"
                        size="small" 
                      >
                        <span className="text-medium">Pro</span>
                    </IonButton>
                  </>
                  }
                  <div className="h-full border-r dark:border-gray-800" />
                <IonButton 
                    routerLink={"/faq"}
                    routerDirection="forward" 
                    fill="clear"
                    size="small" 
                  >
                    <span className="text-medium">FAQ</span>
                  </IonButton>
                  <div className="h-full border-r dark:border-gray-800" />
                <IonButton 
                    routerLink={"/terms"}
                    routerDirection='forward'
                    fill="clear"
                    size="small" 
                  >
                    <span className="text-medium">Terms</span>
                  </IonButton>
                  
                {/* <IonItem>
                  <IonToggle
                    slot="start"
                    name="darkMode"
                    checked={theme.isDark}
                    onClick={() => {theme.setIsDark(!theme.isDark)}}
                  />
                <IonIcon slot={'start'} icon={theme.isDark ?  moonOutline : sunnyOutline} />
                <IonButton color={"primary"} slot="end">English</IonButton>
                </IonItem> */}
              </div>
            </div>
          </IonContent>
        </IonMenu>
    );
  };
  
  export default Menu;
  