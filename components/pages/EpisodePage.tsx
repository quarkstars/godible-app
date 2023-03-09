import { IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, useIonModal, useIonViewWillEnter } from '@ionic/react'
import { Player, UserState } from 'components/AppShell'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { text, userDefaultLanguage } from 'data/translations'
import { IEpisode } from 'data/types'
import useEpisodes from 'hooks/useEpisodes'
import { add, bookOutline, bookmark, chevronDown, language, playCircle, settings, settingsOutline } from 'ionicons/icons'
import React, { useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Thumbnail from 'components/ui/Thumbnail'
import SettingsModal from 'components/ui/SettingsModal'



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

  useEffect(() => {
        //If current episode matches location, get the episode from the server
        const currentSlug = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        //set a preliminary episode lite only once from player if it matches
        const currentPlayerEpisode = (typeof player.index === "number") ? player.list?.episodes[player.index] : undefined;
        if (episode?.slug !== currentSlug && currentPlayerEpisode && currentPlayerEpisode.slug === currentSlug) {
          setEpisode(appendEpisodeStrings(currentPlayerEpisode));
        }
  }, [player.list?.episodes[player.index], location.pathname])
  

  useEffect(() => {
    if (!episode) return;
    //If the episode matches the current location and there's nothing playing, load the episode into the player
  }, [episode]);
  
  
  //Prep episode data
  const quote = (episode?.quote) ? `${episode?.quote}”` : undefined;
  let imageUrl = episode?.imageUrl || "/img/godible-bg.jpg";


  //TODO: Show quote only when no text available
  const [showQuote, setShowQuote] = useState(true);  
  const controls = useAnimationControls();
  useEffect(() => {
      if (showQuote) controls.start({ rotate: 180 })
      else controls.start({ rotate: 0 })
  }, [showQuote]);
  const metaControls = useAnimationControls();
  const metaControls2 = useAnimationControls();
  const [showMeta, setShowMeta] = useState(true);  
  useEffect(() => {
      if (showMeta) {
        metaControls.start({ rotate: 180 });
        metaControls2.start({ width: 120 });

      }
      else {
        metaControls.start({ rotate: 0 });
        metaControls2.start({ width: 60 });
      }
  }, [showMeta]);''



  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          {episode?._title}
        </IonTitle>
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
                <span className="ml-16 -mb-8 font-serif text-6xl leading-none text-white dark:text-white sm:text-7xl">
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
                    <div className="p-3 font-serif text-xl font-medium text-white dark:text-white">
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
          <div className='flex justify-center w-full -ml-3 xs:ml-0'>
            {(episode?._bookTitle && episode?._chapterName) && 
            <IonBreadcrumbs color="dark">
              <IonBreadcrumb href={episode?._bookPath}>{episode?._bookTitle}</IonBreadcrumb>
              {episode && <IonBreadcrumb href={episode?._chapterPath}>{episode?._chapterName}</IonBreadcrumb>}
            </IonBreadcrumbs>
            }
            {(episode?._bookTitle && !episode?._chapterName) && 
              <IonBreadcrumb color="dark" href={episode?._bookPath}>{episode?._bookTitle}</IonBreadcrumb>
            }   
            
            <motion.div
              key={"quote"}
              animate={metaControls}
              className="opacity-50"
            >
              {episode?._metaDataBlocks &&
              <IonButtons>
                <IonButton fill="clear" size="small"  onClick={()=>setShowMeta(prev => !prev)} >
                  <IonIcon icon={chevronDown} color="dark" size="small" slot="icon-only" />
                </IonButton>
              </IonButtons>
              }
            </motion.div>
          </div>     
          <div className="flex flex-wrap justify-center w-full pb-8">
            <div className={`flex items-start justify-center sm:items-center w-full`}>
              <motion.div className="overflow-hidden rounded-md pointer-cursor" onClick={()=>setShowMeta(prev => !prev)} animate={metaControls2}>
                <img 
                  src={episode?._bookImageUrl}
                  className="w-full"
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
                <IonButton fill="clear" size="small"  onClick={()=>{}} >
                  <IonIcon icon={playCircle} color="medium" slot="icon-only" />
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
                    className="pb-2 font-serif"
                  >
                    {line.replace(/#/g,'')}
                  </p>
                )
            } 
          })
        }
        </div>
      </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default EpisodePage