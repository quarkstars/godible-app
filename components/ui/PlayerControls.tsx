import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonModal, IonPopover, IonProgressBar, IonRange, IonRippleEffect, IonTitle, IonToolbar, useIonModal, useIonRouter } from '@ionic/react'
import { bookmarkOutline, chevronDown, chevronUp, heartOutline, list, pauseCircle, play, playCircle, playSkipBack, playSkipForward, radio, returnDownBack, returnUpForward, volumeHigh, volumeLow, volumeMedium, volumeOff } from 'ionicons/icons'
import React, { useEffect, useRef } from 'react'
import { Player } from 'components/AppShell';
import { useContext, useState } from 'react';
import { IEpisode } from 'data/types';
import { AnimatePresence } from 'framer-motion';
import { motion } from "framer-motion";
import { calculateTime } from 'hooks/usePlayer';
import { sampleEpisodes } from 'data/sampleEpisodes';
import Thumbnail from './Thumbnail';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import ListModal from './ListModal';
import useEpisodes from 'hooks/useEpisodes';
import SettingsModal from './SettingsModal';

export const PlayerControls = () => {

    const player = useContext(Player);
        
    //Player Functions

    //List Modal
    const [presentList, dimissList] = useIonModal(ListModal, {
        onDismiss: (data: string, role: string) => dimissList(data, role),
        list: player.list,
        setList: player.setList,
        index: player.index,
        setIndex: player.setIndex,
    });
    function openListModal() {
        if (!player.list?.episodes || typeof player.index !== "number" ) return;
        presentList();
    }
    //Settings Modal
    const [presentSettings, dimissSettings] = useIonModal(SettingsModal, {
        onDismiss: (data: string, role: string) => dimissSettings(data, role),
    });
    function openSettingsModal() {
        if (!player.list?.episodes || typeof player.index !== "number" ) return;
        presentSettings();
    }

    const bookmarkEpisode = () => {

    }

    let volumeIcon = volumeHigh;
    if (player.volume < .66) volumeIcon =volumeMedium;
    if (player.volume < .33) volumeIcon = volumeLow;
    if (player.volume < .05) volumeIcon = volumeOff;

    let episode: undefined|IEpisode;
    let bookPath: undefined|string;
    const {
        appendEpisodeStrings,
    } = useEpisodes()
	const router = useIonRouter();
    if (player.list?.episodes && typeof player.index == "number") {
        episode = appendEpisodeStrings(player.list.episodes[player.index]);
    }

    const modal = useRef<HTMLIonModalElement>(null);
  

  

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
      if (ev.detail.role === 'confirm') {
        // setMessage(`Hello, ${ev.detail.data}!`);
      }
    }
    return (
        <>
        <AnimatePresence>
            {!player.isVisible  ?
            <motion.div
                key={"hidden-bar"}
                initial={{ scale: 0, opacity: 0}}
                animate={{ scale: 1, opacity: 1}}
                exit={{opacity: 0,  x: -100}}
                transition={{ scale: "easeInOut" }}
            >
                { player.list?.episodes &&<>
                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={()=>{player.setIsVisible(true)}}>
                    <IonFabButton color="light">
                        <IonIcon icon={radio}></IonIcon>
                    </IonFabButton>
                </IonFab>
                <IonProgressBar value={(player.currentSeconds)/(player.duration||100)}></IonProgressBar>
                </>}
            </motion.div>
            :
            <motion.div
                key={"visible-bar"}
                initial={{ height: 0, opacity: 0}}
                animate={{ height: "auto", opacity: 1}}
                exit={{opacity: 0, height: 0}}
                transition={{ ease: "easeInOut" }}
            >
                {player.list?.episodes && <>
                <IonToolbar color={"light"}>
                    <div className="flex flex-row items-center justify-center w-full px-4 space-x-4">   
                        <div className="justify-start hidden xs:flex sm:w-full">    
                            <div className="flex-shrink-0 hidden w-28 h-28 xs:block">
                                <Thumbnail 
                                    size={112}
                                    imageUrl={episode?.imageUrl}
                                    onCornerClick={() => {if (episode?._bookPath) router.push(episode._bookPath)}}
                                    cornerImageUrl={episode?._bookImageUrl}
                                    onClick={() => {if (episode) router.push(episode._path!)}}
                                    overlayColor='#000000'
                                >
                                    <span className="text-4xl font-bold text-white dark:text-white">
                                        {episode?.number}
                                    </span>
                                </Thumbnail>
                            </div>
                            <div className="flex-row items-center justify-center hidden w-full h-auto max-w-sm xs:flex">
                                <IonButtons>
                                    <IonButton                                            
                                        //TODO: Ion Modal - Player Episode Modal *
                                        id="open-modal"
                                        onClick={()=>{
                                            openListModal()
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={list} />
                                    </IonButton>
                                </IonButtons>
                                <IonButtons>
                                    <IonButton>
                                        {/* TODO: Bookmark */}
                                        <IonIcon slot="icon-only" icon={bookmarkOutline} />
                                    </IonButton>
                                </IonButtons>
                            </div>
                        </div> 
                        <div className="flex flex-col items-center justify-center w-full h-auto max-w-lg">
                            <div className="flex items-center content-center justify-between w-full mt-4">
                                
                                <div className="block xs:hidden">
                                    <IonButtons>
                                        <IonButton                                            
                                             //TODO: Ion Modal - Player Episode Modal 
                                            onClick={()=>{
                                                openListModal()
                                            }}
                                        >
                                            <IonIcon slot="icon-only" icon={list}/>
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <div className="block xs:hidden">
                                    <IonButtons>
                                        <IonButton>
                                            {/* TODO: Bookmark */}
                                            <IonIcon slot="icon-only" icon={bookmarkOutline} />
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <IonButtons>
                                    <div className="hidden xs:block">
                                        <IonButton
                                            disabled={!player.isReady && !player.isPlaying && player.index === 0}
                                            onClick={()=> {
                                                player.rewind()
                                            }}
                                        >
                                            <IonIcon slot="icon-only" icon={playSkipBack} />
                                        </IonButton>
                                    </div>
                                </IonButtons>
                                <IonButtons>
                                    <IonButton size="large"
                                        onClick={()=>{player.jump(-30)}}
                                        disabled={!player.isReady}
                                    >
                                        <IonIcon slot="start" icon={returnDownBack} />
                                        <span className='text-xs'>30</span>
                                    </IonButton>
                                </IonButtons>
                                    <button 
                                        className="flex items-center justify-center w-10 h-10 rounded-full shadow-md xs:w-16 xs:h-16 ion-activatable ripple-parent circle bg-primary hover:bg-primary-shade focus:outline-none"
                                        onClick={() => player.togglePlayPause()}
                                        style={{opacity: player.audio?.src ? 1 : .5}}
                                    >   
                                            <IonRippleEffect type="unbounded"></IonRippleEffect>
                                            {player.isPlaying ?
                                                <svg className="w-6 h-6 xs:w-8 xs:h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
                                            :
                                                <svg className="w-6 h-6 xs:w-8 xs:h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="3 3 20 20"><polygon points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/></svg>
                                        }
                                    </button>
                                <IonButtons>                        
                                    <div className="hidden sm:block">
                                        <IonButton
                                            onClick={()=>{player.jump(30)}}
                                            disabled={!player.isReady}
                                        >
                                            <span className='text-xs'>30</span>
                                            <IonIcon slot="end" icon={returnUpForward} />
                                        </IonButton>
                                    </div>
                                </IonButtons>

                                <IonButtons>
                                    <IonButton
                                        disabled={!player.isReady && !player.isPlaying && player.index+2 > (player.list?.episodes?.length||0)}
                                        onClick={()=> {
                                            player.next()
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={playSkipForward} />
                                    </IonButton>
                                </IonButtons>
                                <div className="block sm:hidden">
                                    <IonButtons>
                                        <IonButton onClick={()=>openSettingsModal()}>
                                            <IonIcon slot="icon-only" icon={volumeIcon} />
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <div className="block sm:hidden">
                                <IonButtons>
                                    <IonButton size="large" onClick={()=>{player.setIsVisible(false)}}>
                                        <IonIcon slot="start" icon={chevronDown} />
                                        {/* TODO: Hide if Volume is availbable */}
                                        <span className='hidden text-xs xs-block'>hide</span>
                                    </IonButton>
                                </IonButtons>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-full h-16 ">
                                {((player.isReady || player.isPlaying || player.currentSeconds > 0) && player.audio?.src ) && 
                                    <div className="text-xs text-gray-500 sm:text-md">
                                        <span>{(player.currentSeconds && !isNaN(player.currentSeconds)) ? calculateTime(player.currentSeconds) : "00:00"}</span>
                                    </div>
                                }
                                {player.audio?.src &&<>
                                {(player.isReady || player.isPlaying || player.currentSeconds > 0) ?
                                    <IonRange
                                        value={player.currentSeconds}
                                        max={player.duration||100}
                                        onIonKnobMoveStart={() => {player.setIsSeeking(true)}}
                                        onIonKnobMoveEnd={() => {
                                            player.seekTime(player.currentSeconds);
                                            player.setIsSeeking(false);
                                        }}
                                        onIonChange={(detail) => { 
                                            const seconds = Number(detail.target.value);
                                            player.setCurrentSeconds(seconds);                                            
                                        }}
                                    />
                                :
                                    // Show buffering
                                    <div className="flex items-center w-full h-16 p-3">
                                        <IonProgressBar value={player.isPlaying? undefined : 0} type={player.isPlaying ? "indeterminate" : undefined}></IonProgressBar>
                                    </div>

                                }
                                </>}
                                <div className="flex items-center h-16 text-xs text-gray-500 sm:text-md">
                                    <AnimatePresence>
                                    {!player.message ? <>
                                        {(player.isReady || player.isPlaying || player.currentSeconds > 0) && 
                                            <span className="w-full text-center">
                                                {(player.duration && !isNaN(player.duration)) ? calculateTime(player.duration) : "00:00"}
                                            </span>
                                        }
                                    </>
                                    :
                                        <motion.div 
                                            className="flex space-x-2"
                                            key={"hidden-bar"}
                                            initial={{ scale: 0, opacity: 0}}
                                            animate={{ scale: 1, opacity: 1}}
                                            exit={{opacity: 0,  scale: 0}}
                                            transition={{ scale: "easeInOut" }}
                                        >
                                            <span>{player.message}</span>
                                            {typeof player.timeTilNext === "number" && 
                                                <span
                                                 className={'block border-b-2 cursor-pointer'}
                                                 onClick={()=>{
                                                    player.setTimeTilNext(undefined)
                                                    player.setMessage(undefined);
                                                }}
                                                >
                                                    Cancel
                                                </span>
                                            }
                                        </motion.div>
                                    }
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="flex-row items-center justify-center hidden w-full h-auto max-w-xs sm:flex">
                            {/* TODO: VOLUME ONLY ON WEB? Capacitor control?  */}
                            <IonButtons>
                                <IonButton onClick={()=>openSettingsModal()}>
                                    <IonIcon slot="icon-only" icon={volumeIcon} />
                                </IonButton>
                            </IonButtons>
                            <IonButtons>
                                <IonButton size="large" onClick={()=>{player.setIsVisible(false)}}>
                                    <IonIcon slot="start" icon={chevronDown} />
                                    <span className='text-xs'>hide</span>
                                </IonButton>
                            </IonButtons>
                        </div>
                    </div>
                </IonToolbar>
                </>}
            </motion.div>
            }
        </AnimatePresence>

        {/* <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Welcome</IonTitle>
            <IonButtons slot="end">
            <IonButton strong={true} onClick={() => confirm()}>
                Confirm
            </IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonItem>
            Hi
        </IonItem>
        </IonContent>
        </IonModal> */}
        </>
    )
}
