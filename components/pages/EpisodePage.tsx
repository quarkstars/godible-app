import { IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonLabel, IonPage, IonRippleEffect, IonTextarea, IonTitle, IonToggle, IonToolbar, useIonModal, useIonViewWillEnter } from '@ionic/react'
import { Player, UserState } from 'components/AppShell'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { text, userDefaultLanguage } from 'data/translations'
import { IEpisode } from 'data/types'
import useEpisodes from 'hooks/useEpisodes'
import { add, bookOutline, bookmark,  documentTextOutline, chevronDown, chevronUp, language, pauseCircle,  playCircle, settings, settingsOutline, documentText, megaphone, send, checkmarkCircle } from 'ionicons/icons'
import React, { useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Thumbnail from 'components/ui/Thumbnail'
import SettingsModal from 'components/ui/SettingsModal'
import Inspiration from 'components/ui/Inspiration'
import TextDivider from 'components/ui/TextDivider'
import Inspirations from 'components/ui/Inspirations'



const EpisodePage:React.FC = () => {

  const player = useContext(Player);
  
    //Modal
    const [presentSettings, dimissSettings] = useIonModal(SettingsModal, {
        onDismiss: (data: string, role: string) => dimissSettings(data, role),
    });
    function openSettingsModal() {
        if (!player.list?.episodes || typeof player.index !== "number" ) return;
        presentSettings();
    }
  
  const {
    appendEpisodeStrings,
  } = useEpisodes();

  const [episode, setEpisode] = useState<IEpisode|undefined>()
  useIonViewWillEnter(() => {


    //TODO: Then pull from the server the entire episode
    
  });

  const {user} = useContext(UserState);
  let fontContrast = "text-gray-700 dark:text-gray-300";
  if (user.fontContrast==="low") fontContrast = "text-gray-500";
  if (user.fontContrast==="high") fontContrast = "text-black dark:text-white";
  let fontSize = "text-lg";
  if (user.fontSize==="small") fontSize = "text-sm";
  if (user.fontSize==="large") fontSize = "text-xl";
  let fontStyle = "font-serif";
  if (user.fontStyle==="sanserif") fontStyle = "";



  useEffect(() => {
        //If current episode matches location, get the episode from the server
        const currentSlug = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        //set a preliminary episode lite only once from player if it matches
        const currentPlayerEpisode = (typeof player.index === "number") ? player.list?.episodes[player.index] : undefined;
        if (episode?.slug !== currentSlug && currentPlayerEpisode && currentPlayerEpisode.slug === currentSlug) {
          setEpisode(appendEpisodeStrings(currentPlayerEpisode));
        }
  }, [player.list?.episodes[player.index], location.pathname])
  

  const [showQuote, setShowQuote] = useState(false);  
  useEffect(() => {
    if (!episode) return;
    //TODO: If episode is not in the player, load it.

    
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
  const [showMeta, setShowMeta] = useState(false);  
  useEffect(() => {
      if (showMeta) {
        metaControls.start({ width: 120 });

      }
      else {
        metaControls.start({ width: 60 });
      }
  }, [showMeta]);

  const [presentInspirations, dismissInspirations] = useIonModal(EpisodeInspirations, {
    onDismiss: (data: string, role: string) => dimissSettings(data, role),
    episode,
});


  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        {/* <IonTitle> */}
          <div className='flex items-center justify-center flex-row w-full space-x-2'>
            <div className="h-full flex items-center text-lg font-medium">{episode?._title}</div>
            <IonButtons>
              <IonButton size="small"
                onClick={((e:any) => {
                  presentInspirations()
                })}
              >
                <IonIcon icon={documentTextOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </div>
        {/* </IonTitle> */}
      </Toolbar>
      </IonHeader>
      <IonContent>
      <div 
        style={{
          maxWidth: "100vw",
          backgroundImage: "url(" + imageUrl + ")",
          backgroundSize: "100%",
          backgroundPosition: "center center",
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
            <div className={`flex items-start justify-center sm:items-center w-full`}>
              <motion.div className="overflow-hidden rounded-md pointer-cursor" onClick={()=>setShowMeta(prev => !prev)} animate={metaControls}>
                <img 
                  src={episode?._bookImageUrl}
                  className="w-full cursor-pointer"
                />
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
                  <div className="-ml-2 sm:ml-0">
                  <IonButtons>
                    <IonButton size="small" color="medium"  onClick={()=>setShowMeta(prev => !prev)} >
                      <IonIcon icon={bookOutline} color="medium" size="small" slot="start" />
                      Book
                    </IonButton>
                  </IonButtons>
                  </div>
                </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>   
          <div className="flex justify-center w-full pb-8">
              <IonButtons>
                <IonButton fill="clear" size="small"  onClick={()=>{player.togglePlayPause()}} >
                  <IonIcon icon={player.isPlaying ? pauseCircle : playCircle} color="medium" slot="icon-only" />
                </IonButton>
              </IonButtons>
              <IonButtons>
                <IonButton fill="clear" size="small"  onClick={()=>{}} >
                  <IonIcon icon={bookmark} color="medium" slot="icon-only" />
                </IonButton>
              </IonButtons>
              <IonButtons>
                <IonButton fill="clear" size="small"  onClick={()=>{}} >
                  <IonIcon icon={add} color="medium" slot="icon-only" />
                </IonButton>
              </IonButtons>
              <IonButtons>
                <IonButton fill="clear" size="small"  onClick={()=>openSettingsModal()} >
                  <IonIcon icon={language} color="medium" slot="icon-only" />
                </IonButton>
              </IonButtons>
          </div>    

          {episode?._textBlocks && episode._textBlocks.map((line, index) => {
            // if (index === 0) return;
            const fontWeight = line[0] === '#' ? 'bold' : 'normal';
            let hCount = 0;
            if (line[0] === "#") hCount=1;
            if (line[1] === "#") hCount=2;
            if (line[2] === "#") hCount=3;
            if (line[3] === "#") hCount=4;
            switch (hCount) {
              case 1:
                return(
                  <h1
                    className=""
                    key={line}
                  >
                    {line.replace(/#/g,'')}
                  </h1>
                )
                break;
              case 2:
                return(
                  <h2
                    className=""
                  >
                    {line.replace(/#/g,'')}
                  </h2>
                )
                break;
              case 3:
                return(
                  <h3
                    className=""
                  >
                    {line.replace(/#/g,'')}
                  </h3>
                )
                break;
              case 4:
                return(
                  <h4
                    className=""
                  >
                    {line.replace(/#/g,'')}
                  </h4>
                )
                break;
              default:
                return(
                  <p
                    className={`pb-2 leading-relaxed ${fontStyle} ${fontSize} ${fontContrast}`}
                  >
                    {line.replace(/#/g,'')}
                  </p>
                )
            } 
          })
        }
        <div id="topics" className="flex flex-col w-full p-8 py-4 rounded-lg bg-dark dark:bg-light">
            <h4 className="leading-relaxed">Godible is possible because of the support of listeners like you</h4>
            <div className="flex items-center w-full space-x-2">
            </div>
        </div>
        <div id="topics" className="flex flex-col w-full pt-8">
            <h4 className="leading-none">Topics</h4>
            <div className="flex flex-wrap items-center w-full space-x-2">
              <IonChip outline>God</IonChip>
              <IonChip outline>Love</IonChip>
              <IonChip outline>Joy</IonChip>
            </div>
        </div>
        <div id="inspirations" className="flex flex-col w-full pt-8">
          <div className="flex items-center justify-between w-full space-x-2">
              <h4 className="leading-none">Inspirations</h4>
              <IonChip>0</IonChip>
          </div>
          <form className="mb-6">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
              <IonTextarea placeholder="Write an inspiration..." autoGrow></IonTextarea>
          </div>
          <div className='w-full items-center flex justify-between'>
            <div className="font-bold  space-x-2 flex items-center text-primary ">
              <IonIcon icon={checkmarkCircle} />
              <span className="italic font-medium">Saved to Device</span>
            </div>
            <div className="flex justify-end items-center space-x-2">
              <span className="text-medium italic">Private</span>
              <IonButton color="medium" fill="clear">
                <IonIcon icon={send} slot="end"/>
                Publish
              </IonButton>
            </div>
          </div>
          </form>
        </div>
        <Inspiration />
        <TextDivider>Public Inspirations</TextDivider>
        <div id="trending"></div>
        <Inspiration />
        </div>
      </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

const EpisodeInspirations = ({inspirations, episode}) => {

  return (    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => {}}>
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>My Inspirations</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>New List</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    <IonContent class="ion-padding">
    <Inspirations inspirations={inspirations} isTitleHidden episode={episode} />
  </IonContent>  
  </IonPage>
  )
}

export default EpisodePage