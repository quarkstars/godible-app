import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonProgressBar, IonRange, IonRippleEffect, IonToolbar } from '@ionic/react'
import { bookmarkOutline, chevronDown, chevronUp, heartOutline, list, pauseCircle, play, playCircle, playSkipBack, playSkipForward, radio, returnDownBack, returnUpForward, volumeHigh } from 'ionicons/icons'
import React, { useEffect } from 'react'
import { Player } from 'components/AppShell';
import { useContext, useState } from 'react';
import { IEpisode } from 'data/types';
import { AnimatePresence } from 'framer-motion';
import { motion } from "framer-motion";
import { calculateTime } from 'hooks/usePlayer';

export const PlayerControls = () => {

    const player = useContext(Player);

    const sampleEpisodes: IEpisode[] = [
        {
            number: 1, 
            book: {
                name: {
                    defaultLanguage: "english",
                    english: "Cheon Bomo Gyeong"
                }
            },
            audioPath: {
                defaultLanguage: "english",
                english: "https://res.cloudinary.com/dcgw7rsyo/video/upload/v1676658093/307961689-44100-2-b910d8b215148_dnnfxm.mp3"
            },
            // chapter?: number,
            // chapterName?: ILangString,
            // speech?: ISpeech,
            // publishedAt?: number,
            // searchText?: ILangString,
        }
    ]
    useEffect(() => {
        if (player.episodes) return;
        player.setEpisodes(sampleEpisodes);
        //player.setIndex(0);
    }, [player.episodes]);

    
    // console.log(player)

    


    return (
        <AnimatePresence>
            {!player.isVisible ?
            <motion.div
                key={"hidden-bar"}
                initial={{ scale: 0, opacity: 0}}
                animate={{ scale: 1, opacity: 1}}
                exit={{opacity: 0, scale: 0}}
                transition={{ scale: "easeInOut" }}
            >
                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={()=>{player.setIsVisible(true)}}>
                    <IonFabButton color="light">
                        <IonIcon icon={radio}></IonIcon>
                    </IonFabButton>
                </IonFab>
                <IonProgressBar value={(player.currentSeconds)/(player.duration||100)}></IonProgressBar>
            </motion.div>
            :
            <motion.div
                key={"visible-bar"}
                initial={{ height: 0, opacity: 0}}
                animate={{ height: "auto", opacity: 1}}
                exit={{opacity: 0, height: 0}}
                transition={{ ease: "easeInOut" }}
            >
                <IonToolbar color={"light"}>
                    <div className="flex flex-row items-center justify-center w-full px-4 space-x-4">   
                        <div className="flex justify-center">    
                            <div className="flex-shrink-0 hidden w-16 h-16 bg-black rounded-sm xs:block sm:w-28 sm:h-28">
                            {/* TODO: Add the episode icon */}
                            </div>
                            <div className="flex-row items-center justify-center hidden w-full h-auto max-w-sm sm:flex">
                                <IonButtons>
                                    <IonButton>
                                        <IonIcon slot="icon-only" icon={list} />
                                    </IonButton>
                                </IonButtons>
                                <IonButtons>
                                    <IonButton>
                                        <IonIcon slot="icon-only" icon={bookmarkOutline} />
                                    </IonButton>
                                </IonButtons>
                                <span className="hidden text-xs text-gray-500 min-w-max flex-grow-1 md:text-md lg:block">Cheon Bomo Gyung Episode 30</span>
                            </div>
                        </div> 
                        <div className="flex flex-col items-center justify-center w-full h-auto max-w-lg">
                            <div className="flex items-center content-center justify-between w-full mt-4">
                                
                                <div className="block sm:hidden">
                                    <IonButtons>
                                        <IonButton>
                                            <IonIcon slot="icon-only" icon={list} />
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <div className="block sm:hidden">
                                    <IonButtons>
                                        <IonButton>
                                            <IonIcon slot="icon-only" icon={bookmarkOutline} />
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <IonButtons>
                                    <div className="hidden sm:block">
                                        <IonButton>
                                            <IonIcon slot="icon-only" icon={playSkipBack} />
                                        </IonButton>
                                    </div>
                                </IonButtons>
                                <IonButtons>
                                    <IonButton size="large">
                                        <IonIcon slot="start" icon={returnDownBack} />
                                        <span className='text-xs'>30</span>
                                    </IonButton>
                                </IonButtons>
                                    <button 
                                        className="flex items-center justify-center w-10 h-10 rounded-full shadow-md sm:w-16 sm:h-16 ion-activatable ripple-parent circle bg-primary hover:bg-primary-shade focus:outline-none"
                                        onClick={() => player.togglePlayPause()}
                                    >   
                                            <IonRippleEffect type="unbounded"></IonRippleEffect>
                                            {player.isPlaying ?
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
                                            :
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="3 3 20 20"><polygon points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/></svg>
                                        }
                                    </button>
                                <IonButtons>                        
                                    <div className="hidden sm:block">
                                        <IonButton>
                                            <span className='text-xs'>30</span>
                                            <IonIcon slot="end" icon={returnUpForward} />
                                        </IonButton>
                                    </div>
                                </IonButtons>

                                <IonButtons>
                                    <IonButton>
                                        <IonIcon slot="icon-only" icon={playSkipForward} />
                                    </IonButton>
                                </IonButtons>
                                <div className="block sm:hidden">
                                    <IonButtons>
                                        <IonButton>
                                            <IonIcon slot="icon-only" icon={volumeHigh} />
                                        </IonButton>
                                    </IonButtons>
                                </div>
                                <div className="block sm:hidden">
                                <IonButtons>
                                    <IonButton size="large" onClick={()=>{player.setIsVisible(false)}}>
                                        <IonIcon slot="start" icon={chevronDown} />
                                        {/* TODO: Hide if Volume is availbable */}
                                        <span className='text-xs'>hide</span>
                                    </IonButton>
                                </IonButtons>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="text-xs text-gray-500 sm:text-md">
                                    <span>{(player.currentSeconds && !isNaN(player.currentSeconds )) ? calculateTime(player.currentSeconds) : "00:00"}</span>
                                </div>
                                <IonRange
                                    value={player.currentSeconds}
                                    max={player.duration||100}
                                    // onClick={() => {player.setIsSeeking(true)}}
                                    onIonKnobMoveStart={() => {player.setIsSeeking(true)}}
                                    onIonKnobMoveEnd={() => {
                                        player.seekTime(player.currentSeconds);
                                        player.setIsSeeking(false);
                                    }}
                                    onIonChange={(detail) => { 
                                        const seconds = Number(detail.target.value);
                                        player.setCurrentSeconds(seconds);
                                        // player.seekTime(seconds);
                                        
                                    }}
                                />
                                <div className="text-xs text-gray-500 sm:text-md">
                                    <span>{(player.duration && !isNaN(player.duration)) ? calculateTime(player.duration) : "00:00"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-row items-center justify-center hidden w-full h-auto max-w-sm sm:flex">
                            {/* VOLUME ONLY ON WEB?  */}
                            <IonButtons>
                                <IonButton>
                                    <IonIcon slot="icon-only" icon={volumeHigh} />
                                </IonButton>
                            </IonButtons>
                            <IonButtons>
                                <IonButton size="large" onClick={()=>{console.log('TEST');player.setIsVisible(false)}}>
                                    <IonIcon slot="start" icon={chevronDown} />
                                    <span className='text-xs'>hide</span>
                                </IonButton>
                            </IonButtons>
                        </div>
                    </div>
                </IonToolbar>
            </motion.div>
            }
        </AnimatePresence>
    )
}
