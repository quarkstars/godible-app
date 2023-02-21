import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonProgressBar, IonRange, IonRippleEffect, IonToolbar } from '@ionic/react'
import { bookmarkOutline, chevronDown, chevronUp, heartOutline, list, pauseCircle, play, playCircle, playSkipBack, playSkipForward, radio, returnDownBack, returnUpForward, volumeHigh } from 'ionicons/icons'
import React from 'react'

export const Player = () => {
  return (
    <>
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton color="light">
            <IonIcon icon={radio}></IonIcon>
        </IonFabButton>
    </IonFab>
    <IonProgressBar value={.4}></IonProgressBar>
    <IonToolbar color={"light"}>

        <div className="flex flex-row items-center justify-center w-full px-4 space-x-4">        
            <div className="flex-shrink-0 hidden w-16 h-16 bg-black rounded-sm xs:block sm:w-28 sm:h-28">
            2333 fda fda fafds a
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
                <span className="hidden text-xs text-gray-500 md:text-md lg:block">Cheon Bomo Gyung Episode 30</span>
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
                        <button className="flex items-center justify-center w-10 h-10 rounded-full shadow-md sm:w-16 sm:h-16 ion-activatable ripple-parent circle bg-primary hover:bg-primary-shade focus:outline-none">   
                                <IonRippleEffect type="unbounded"></IonRippleEffect>
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
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
                        <IonButton size="large">
                            <IonIcon slot="start" icon={chevronDown} />
                            {/* TODO: Hide if Volume is availbable */}
                            <span className='text-xs'>hide</span>
                        </IonButton>
                    </IonButtons>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-gray-500 sm:text-md">
                        <span>00:00</span>
                    </div>
                    <IonRange
                        
                    />
                    <div className="text-xs text-gray-500 sm:text-md">
                        <span>03:30</span>
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
                    <IonButton size="large">
                        <IonIcon slot="start" icon={chevronDown} />
                        <span className='text-xs'>hide</span>
                    </IonButton>
                </IonButtons>
            </div>
        </div>
    </IonToolbar>
    </>
  )
}
