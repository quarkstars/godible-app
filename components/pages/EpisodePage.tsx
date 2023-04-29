import { IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonLabel, IonPage, IonRippleEffect, IonSkeletonText, IonTextarea, IonTitle, IonToggle, IonToolbar, useIonModal, useIonRouter, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react'
import { Player } from 'components/AppShell'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { text, userDefaultLanguage } from 'data/translations'
import { IEpisode, IList } from 'data/types'
import useEpisodes from 'hooks/useEpisodes'
import { add, bookOutline, bookmark,  documentTextOutline, chevronDown, chevronUp, language, pauseCircle,  playCircle, settings, settingsOutline, documentText, megaphone, send, checkmarkCircle, calendar, close, addCircleOutline, list, bookmarkOutline, arrowBack, arrowForward, time, timeOutline } from 'ionicons/icons'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Thumbnail from 'components/ui/Thumbnail'
import SettingsModal from 'components/ui/SettingsModal'
import Note from 'components/ui/Note'
import TextDivider from 'components/ui/TextDivider'
import Notes from 'components/ui/Notes'
import Copyright from 'components/ui/Copyright'
import { UserState } from 'components/UserStateProvider'
import ListModal from 'components/ui/ListModal'
import useLists from 'hooks/useLists'
import useNotes from 'hooks/useNotes'
import { useParams } from 'react-router'
import { resolveLangString } from 'utils/resolveLangString'



const EpisodePage:React.FC = () => {

  const player = useContext(Player);
	const router = useIonRouter();
  
  //Modal
  const [presentSettings, dimissSettings] = useIonModal(SettingsModal, {
      onDismiss: (data: string, role: string) => dimissSettings(data, role),
  });
  function openSettingsModal() {
      if (!player.list?.episodes || typeof player.index !== "number" ) return;
      presentSettings({
        initialBreakpoint:0.85,
    });
  }
  
  const {
    getEpisodes,
    episodes,
    getAdjacentEpisodes,
    setEpisodes,
  } = useEpisodes();
  
  const {user, listReloads, setListReloads, updateUser, setReroutePath} = useContext(UserState);
  const lang = (user?.language) ? user.language : userDefaultLanguage;


  //User Bookmarks
  const {
    getLists,
    lists,
    addEpisodeToList,
    removeEpisodeFromList,
    setLists,
  } = useLists();
  const [hasBookmark, setHasBookmark] = useState<boolean>(false);
  useEffect(() => {
    if (!user?.objectId) return setHasBookmark(false);
    if (!location.pathname.includes("episode")) return setHasBookmark(false);
    getLists(undefined, { sort: "+index", limit: 1, userId: user?.objectId, exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
  }, [user?.objectId, listReloads, location.pathname]);
  
  useEffect(() => {
    if (!lists || !lists?.[0]) return setHasBookmark(false);
    const list = lists[0];
    
    let foundBookmark = false;
    for (let i = 0; i < list.episodes.length; i++) {
      if (list.episodes[i].objectId === episode?.objectId) {
        foundBookmark = true;
        break;
      }
    }
    if (foundBookmark) setHasBookmark(true)
    else setHasBookmark(false);
  }, [lists]);
  const  handleBookmark = async (isBookmarking=true) => {
    if (!episode?.objectId) return;
    if (isBookmarking) {
      setHasBookmark(true);
      addEpisodeToList(0, episode.objectId, true);
    } else {
      if (!lists?.[0]) return;
      setHasBookmark(false);
      removeEpisodeFromList(lists[0], episode.objectId);
    }
    setTimeout(() => setListReloads(prev => prev + 1), 1000);
  }
  
  

  const [episode, setEpisode] = useState<IEpisode|undefined>()


  let fontContrast = "text-gray-700 dark:text-gray-300";
  if (user.fontContrast==="low") fontContrast = "text-gray-500";
  if (user.fontContrast==="high") fontContrast = "text-black dark:text-white";
  let fontSize = "text-lg";
  let paddingSize = "pb-4";
  if (user.fontSize==="small") {
    fontSize = "text-sm";
    paddingSize = "pb-2";
  }
  if (user.fontSize==="large") {
    fontSize = "text-xl";
    paddingSize = "pb-6";
  }
  let fontStyle = "sanserif";
  if (user.fontStyle==="serif") fontStyle = "font-serif";



  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    //If current episode matches location, get the episode from the server
    if (!router.routeInfo || !user || loaded) return;
    setLoaded(true);
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const languageParam = urlParams.get("l");
    if (languageParam === "j") updateUser({language:"japanese"})
}, [router.routeInfo, user])

  useEffect(() => {
        //If current episode matches location, get the episode from the server
        if (!router.routeInfo) return;
        const currentSlug = router.routeInfo.pathname.substring(router.routeInfo.pathname.lastIndexOf('/') + 1);
        if (currentSlug.length === 0) return;
        //set a preliminary episode lite only once from player if it matches
        const currentPlayerEpisode = (typeof player?.index === "number") ? player.list?.episodes?.[player.index] : undefined;
        if (episode?.slug !== currentSlug && currentPlayerEpisode && currentPlayerEpisode.slug === currentSlug) {
          setEpisode(currentPlayerEpisode);
        }
        const urlParams = new URLSearchParams(router.routeInfo.search)
        const tokenParam = urlParams.get("token");
        const token = (tokenParam) ? tokenParam : undefined;
        getEpisodes(undefined, {slug: currentSlug, token})
  }, [player.list?.episodes?.[player.index], router.routeInfo])

  //Update the episode when episodes is updated
  useEffect(() => {
    if (!episodes) return;
    setEpisode(episodes[0]);
  }, [episodes]);

  
  useEffect(() => {
    if (!episode) return;
    setupAdjacentEpisodes();
  }, [episode]);
  const [adjacentEpisodes, setAdjacentEpisodes] = useState<Array<IEpisode|null>>([null, null]);
  const [isAdjacentEpisodeFromList, setIsAdjacentEpisodesFromList] = useState<Array<boolean>>([false, false]);
  const setupAdjacentEpisodes = async () => {
    if (!player.list || typeof player.index !== "number") return;
    let _isAdjacentEpisodeFromList = [false, false];
    let previousPlayerEpisode = player.list.episodes[player.index-1];
    if (previousPlayerEpisode) {
      _isAdjacentEpisodeFromList[0] = true;
      setAdjacentEpisodes(adjacentEps => {
        adjacentEps[0] = previousPlayerEpisode;
        return adjacentEps;
      });
    }
    let nextPlayerEpisode = player.list.episodes[player.index+1];
    if (nextPlayerEpisode) {
      _isAdjacentEpisodeFromList[1] = true;
      setAdjacentEpisodes(adjacentEps => {
        adjacentEps[1] = nextPlayerEpisode;
        return adjacentEps;
      });
    }
    setIsAdjacentEpisodesFromList(_isAdjacentEpisodeFromList);
    if (!_isAdjacentEpisodeFromList[0] || !_isAdjacentEpisodeFromList[1]) {
      const [previousEpisode, nextEpisode] = await getAdjacentEpisodes(episode!, !_isAdjacentEpisodeFromList[0], !_isAdjacentEpisodeFromList[1]);
      setAdjacentEpisodes(adjacentEps => {
        if (previousEpisode) adjacentEps[0] = previousEpisode;
        if (nextEpisode) adjacentEps[1] = nextEpisode;
        return adjacentEps;
      })
    }

    // If the user remains on the same episode for 2 minutes, assign the next episode to the user
    if (user?.objectId) setTimeout(() => saveNextEpisode(episode!.slug), 120000)

  }

  const saveNextEpisode = async(expectedSlug: string) => {
    if (!user?.objectId || !adjacentEpisodes[1]) return; 
    if (expectedSlug === episode?.slug) {
      updateUser({nextEpisode: adjacentEpisodes[1]});
    }
  }
  

  const [showQuote, setShowQuote] = useState(false);  
  useEffect(() => {
    if (!episode) return;
    //If episode from the episode page is not in the player, load it.
    const currentPlayerEpisode = (typeof player.index === "number") ? player.list?.episodes?.[player.index] : undefined;
    //only load it if the currently playing episode is different and we are on an episode page 
    if (!player.isMutatingList && currentPlayerEpisode?.objectId !== episode.objectId && location.pathname.includes("episode")) {
      player.setList({episodes: [episode]});
      player.setIndex(0);
    }

    if (showQuote === false && episode.isForbidden) setShowQuote(true);
  }, [episode]);


  
  //Prep episode data
  const quote = (episode?._quote) ? `${episode?._quote}”` : undefined;
  let imageUrl = episode?.imageUrl || "/img/godible-bg.jpg";

  const controls = useAnimationControls();
  useEffect(() => {
      if (showQuote) controls.start({ rotate: 180 })
      else controls.start({ rotate: 0 })
  }, [showQuote]);
  const metaControls = useAnimationControls();
  const [showMeta, setShowMeta] = useState(true);  
  useEffect(() => {
      let width = episode?._metaDataBlocks && episode._metaDataBlocks.length > 1 ? 120 : 60;
      if (!episode?._metaDataBlocks)
      if (showMeta) {
        metaControls.start({ width });

      }
      else {
        metaControls.start({ width: 60 });
      }
  }, [showMeta, episode?._metaDataBlocks]);

  const [presentNotes, dismissNotes] = useIonModal(EpisodeNotes, {
    onDismiss: (data: string, role: string) => dismissNotes(data, role),
    episode,
  });
  useEffect(() => {  
    if (!router.routeInfo.search) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const notesParam = urlParams.get("notes");
    if (notesParam == "1") {
      presentNotes({
          initialBreakpoint:0.85,
      })
    }
  }, [router.routeInfo.search]);

  //List modal trigger
  const [presentList, dimissList] = useIonModal(ListModal, {
    onDismiss: (data: string, role: string) => dimissList(data, role),
      router,
      isAddingEpisode: true,
      addEpisodeId: episode?.objectId,
  });
  
  const episodeText = useMemo(() => {
    return episode?._textBlocks && episode._textBlocks.map((_line, index) => {
        // if (index === 0) return;
        let line = _line;
        const fontWeight = line[0] === '#' ? 'bold' : 'normal';
        let hCount = 0;
        if (line[0] === "#") hCount=1;
        if (line[1] === "#") hCount=2;
        if (line[2] === "#") hCount=3;
        if (line[3] === "#") hCount=4;
        if (/^\d+\s/.test(line)) {
          line = line.replace(/^(\d+)\s/, '$1\u00A0\u00A0');
        }
        switch (hCount) {
          case 1:
            return(
              <h1
                className="w-full text-left"
                key={line}
              >
                {line.replace(/#/g,'')}
              </h1>
            )
            break;
          case 2:
            return(
              <h2
                className="w-full text-left"
              >
                {line.replace(/#/g,'')}
              </h2>
            )
            break;
          case 3:
            return(
              <h3
                className="w-full text-left"
              >
                {line.replace(/#/g,'')}
              </h3>
            )
            break;
          case 4:
            return(
              <h4
                className="w-full text-left"
              >
                {line.replace(/#/g,'')}
              </h4>
            )
            break;
          default:
            return(
              <p
                className={`leading-relaxed ${paddingSize} ${fontStyle} ${fontSize} ${fontContrast}`}
              >
                {line.replace(/#/g,'')}
              </p>
          )
        }
      })
  }, [episode,fontStyle, fontSize, fontContrast])


  //Clear data when leaving unless it's another episode
  useIonViewDidEnter(() => {

    if (!player.list?.episodes?.[player.index]?.audioPath) player.setIsVisible(true)
  }, [])

  useIonViewDidLeave(() => {
    if (location.pathname.includes("episode")) return;
    setEpisodes(undefined);
    setLists(undefined);
    setEpisode(undefined);
    setAdjacentEpisodes([null, null])

    if (!player.list?.episodes?.[player.index]?.audioPath && player.isVisible) player.setIsVisible(false);
  });


  return (
    <IonPage>
      <IonHeader>
        <Toolbar>
          {/* <IonTitle> */}
            <div className='flex flex-row items-center justify-center w-full space-x-2'>
              <div className="flex items-center h-full text-lg font-medium">
                {episode ? 
                  episode._title
                  :
                  <IonSkeletonText animated={true} style={{ 'width': '100px' }}></IonSkeletonText>
                }
              </div>
                <IonButton size="small"
                  onClick={((e:any) => {
                    presentNotes({
                      initialBreakpoint:0.85,
                  })
                  })}
                  color="primary"
                >
                  <IonIcon icon={documentTextOutline} slot="start" size="small"/>
                  Notes
                </IonButton>
            </div>
          {/* </IonTitle> */}
        </Toolbar>
        </IonHeader>
        <IonContent>
        <div 
          style={{
            maxWidth: "100vw",
            backgroundImage: "url(" + imageUrl + ")",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "none none",
          }}
          >
          <div className="flex flex-col items-center justify-center w-full bg-black bg-opacity-50">
            <div className="flex flex-col items-start w-full px-4 py-8" style={{color: "white !important", maxWidth: "800px"}}>           
              {quote && 
                <div className="flex flex-col w-full">
                  <div 
                    className="flex justify-center w-full cursor-pointer"
                    onClick={()=>setShowQuote(prev => !prev)}
                  >
                  <span className="ml-6 -mb-8 font-serif text-6xl leading-none text-white dark:text-white sm:text-7xl">
                    “
                  </span>
                  <motion.div
                    key={"quote"}
                    animate={controls}
                    className="opacity-50"
                  >
                  <IonButtons>
                    <IonButton fill="clear" size="small">
                      <IonIcon icon={chevronDown} color="fullwhite" size="small" slot="icon-only" />
                    </IonButton>
                  </IonButtons>
                  </motion.div>
                  </div>                
                  <AnimatePresence>
                    {showQuote &&
                      <motion.div
                        key={"quote"}
                        initial={{ height: 0, opacity: 0}}
                        animate={{ height: "auto", opacity: 1}}
                        exit={{opacity: 0,  height: 0}}
                      >
                      <div className="p-3 font-serif text-xl font-medium leading-relaxed text-white dark:text-white">
                        {quote}
                      </div>
                      </motion.div>
                      }
                  </AnimatePresence>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex justify-center px-4 py-4 width-full">  
          <div className="justify-center px-4" style={{ maxWidth: "768px"}}> 
            <div className='flex flex-wrap justify-center w-full -ml-3 xs:ml-0'>
              {(episode?._bookTitle && episode?._chapterName) && 
              <IonBreadcrumbs color="dark">
                <IonBreadcrumb href={episode?._bookPath}>{episode?._bookTitle}</IonBreadcrumb>
                {episode && <IonBreadcrumb href={episode?._chapterPath}>{episode?._chapterName}</IonBreadcrumb>}
              </IonBreadcrumbs>
              }
              {(episode?._bookTitle && !episode?._chapterName) && 
                <IonBreadcrumb color="dark" href={episode?._bookPath}>{episode?._bookTitle}</IonBreadcrumb>
              }   
                {episode?._metaDataBlocks &&
                  <IonButton fill="clear" size="small" color="medium" onClick={()=>setShowMeta(prev => !prev)} >
                    <IonIcon icon={showMeta ? chevronUp : chevronDown} color="medium" size="small" slot="start" />
                    <IonLabel color="medium">{showMeta ? "Less" : "More"}</IonLabel>
                  </IonButton>
                }
            </div>     
            <div className="flex flex-wrap justify-center w-full pb-8">
              <div className={`rounded-md p-2 flex justify-center items-start ${!episode ? "py-6": ""} ${showMeta ? "bg-gray-100 dark:bg-gray-800": ""} ${episode?._metaDataBlocks && episode?._metaDataBlocks.length > 1 ? "w-full" : ""}`}>
                <motion.div className="overflow-hidden rounded-md pointer-cursor" onClick={()=>setShowMeta(prev => !prev)} animate={metaControls}>
                  
                  {episode ? 
                    <img 
                      src={episode?._bookImageUrl}
                      className="w-full rounded-md cursor-pointer"
                    />
                    :
                    <div className="flex flex-col items-center w-full">
                      <IonSkeletonText animated={true} style={{ 'width': '90px','height': '90px' }}></IonSkeletonText>
                    </div>
                  }
                </motion.div>
                                
                <AnimatePresence>
                {showMeta &&
                  <motion.div 
                    className={`px-2 ${showMeta? "flex-grow" : ""}`}
                    key={"quote"}
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                  >
                  {episode?._metaDataBlocks && episode?._metaDataBlocks.map((metaData, index) => {
                      return(
                        <p className="pb-1 text-sm text-light" key={index}>{metaData}</p>
                      )
                    })
                    
                    }
                    {episode &&
                    <div className="-ml-2 ">
                      <IonButtons>
                        <IonButton size="small" color="medium"  onClick={()=>{if (episode?._bookPath) router.push(episode?._bookPath)}} >
                          <IonIcon icon={bookOutline} color="medium" size="small" slot="start" />
                          Book
                        </IonButton>
                      </IonButtons>
                    </div>
                    }
                  </motion.div>
                  }
                </AnimatePresence>
              </div>
            </div>   
            <div className="flex justify-center w-full pb-8">
                <IonButtons>
                  <IonButton fill="clear" size="small"  onClick={()=>{player.togglePlayPause()}} >
                    <IonIcon icon={player.isPlaying ? pauseCircle : playCircle} color="primary" slot="icon-only" />
                  </IonButton>
                </IonButtons>
                <IonButtons>
                  <IonButton 
                    fill="clear" 
                    size="small"  
                    onClick={()=>{
                      if (!user?.objectId)  {
                        setReroutePath(router.routeInfo.pathname)
                        router.push("/signin?message=Log in to save bookmarks")
                        return;
                      }
                      handleBookmark(!hasBookmark);
                    }}
                  >
                    <IonIcon icon={hasBookmark ? bookmark: bookmarkOutline} color="medium" slot="icon-only" />
                  </IonButton>
                </IonButtons>
                <IonButtons>
                  <IonButton fill="clear" size="small"  onClick={(e)=>{
                      if (!user?.objectId) return router.push("/signin?message=Log in to save lists")
                      presentList({

                      })
                  }} >
                    <IonIcon icon={addCircleOutline} color="medium" slot="icon-only" />
                  </IonButton>
                </IonButtons>
                <IonButtons>
                  <IonButton fill="clear" size="small"  onClick={()=>openSettingsModal()} >
                    <IonIcon icon={language} color="medium" slot="icon-only" />
                  </IonButton>
                </IonButtons>
            </div>    

            {(episode && episode.text) ? 
                episodeText
              :
              new Array(20).fill(undefined).map((item, index) => { return <IonSkeletonText key={"skel-"+index} animated={true} style={{ 'width': '100%' }}></IonSkeletonText>})
            }
          <Copyright />
          <div id="topics" className="flex flex-col items-center w-full p-8 py-4 rounded-lg bg-dark dark:bg-light">
              {episode?.isForbidden && <h3 className="font-bold leading-relaxed text-center text-light dark:text-dark">Become a donor to access this episode</h3>}
              <h4 className="pb-2 leading-relaxed text-center">{user?.subscriptionId ? `Godible is possible because of your support. Thank you.` : `Godible is possible because of the support of listeners like you`}</h4>
              {!user?.subscriptionId &&
              <div className="flex justify-center w-full">
                <IonButton 
                  color="primary" 
                  onClick={() => {
                    setReroutePath(router.routeInfo.pathname);
                    router.push("/donation");
                  }}>
                  Become a Donor
                </IonButton>
              </div>
              }
              <div className="flex items-center w-full space-x-2">
              </div>
          </div>
          <div id="topics" className="flex justify-between w-full">
            {adjacentEpisodes[0] &&
                <IonButton 
                  fill="clear"
                  onClick={(e) => {if (adjacentEpisodes[0]?._path) router.push(adjacentEpisodes[0]._path)}}
                >
                  <IonIcon icon={arrowBack} slot="start" />
                  {adjacentEpisodes[0]._bookImageUrl && <img className="w-4 h-4 mx-1" src={adjacentEpisodes[0]._bookImageUrl} />}
                  {`${adjacentEpisodes[0].number ? adjacentEpisodes[0].number : ""}`}
                </IonButton>
            }
            <div></div>
            {adjacentEpisodes[1] &&
                <IonButton 
                  fill="clear"
                  disabled={(adjacentEpisodes[1]?.publishedAt && adjacentEpisodes[1]?.publishedAt > Date.now())? true: false}
                  onClick={(e) => {if (adjacentEpisodes[1]?._path) router.push(adjacentEpisodes[1]._path)}}
                >
                  <IonIcon icon={(adjacentEpisodes[1]?.publishedAt && adjacentEpisodes[1]?.publishedAt > Date.now())? timeOutline: arrowForward} slot="end" />
                  {adjacentEpisodes[1]._bookImageUrl && <img className="w-4 h-4 mx-1" src={adjacentEpisodes[1]._bookImageUrl} />}
                  {`${adjacentEpisodes[1].number ? adjacentEpisodes[1].number : ""}`}
                </IonButton>
            }
          </div>
          {(episode?.topics && episode?.topics.length > 0) ?
          <div id="topics" className="flex flex-col w-full pt-8">
              <h4 className="leading-none">Topics</h4>
              <div className="flex flex-wrap items-center w-full pb-10 space-x-2">
              {
                episode?.topics.map((topic, index) => {
                  return (
                    <IonChip key={"topic-"+topic.objectId} outline onClick={() => {router.push(`/search?topic=${topic.slug}&init=0`)}}>{resolveLangString(topic.name, lang)}</IonChip>
                  )
                }) 
              }
              </div>
          </div>
          :<></>}
          </div>
        </div>
        </IonContent>
        <IonFooter>
          <PlayerControls />
        </IonFooter>
      </IonPage>
    )
  }

  const EpisodeNotes = ({onDismiss, notes, episode}) => {

    return (    
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton 
                  onClick={() => onDismiss(null, 'close')}
                >
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle><span className="pr-10">Notes</span></IonTitle>
            {/* <IonButtons slot="end">
              <IonButton onClick={() => {}}>
                <IonIcon icon={calendar} slot="icon-only" />
              </IonButton>
            </IonButtons> */}
          </IonToolbar>
        </IonHeader>
      <IonContent class="ion-padding">
      <Notes isTitleHidden episode={episode} />
      <div className="pb-40"></div>
    </IonContent>  
  </IonPage>
  )
}

export default EpisodePage