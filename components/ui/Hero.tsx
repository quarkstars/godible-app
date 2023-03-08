import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { add, addCircle, chevronBack, chevronDown, chevronForward, play, playCircle } from 'ionicons/icons'
import React from 'react'

const Hero = () => {

  //title
  //children
  //mainButtonText - Let God's Word Be Heard
  //mainButtonIcon
  //onClickMain
  //subButtonText Listen 
  //subButtonIcon PlayCircle
  //isMainClear
  //onClickSub 
  //overlayColor
  //bgImageUrl
  //onNext 
  //TODO: isShowingNext
  //onPrevious
  //isShowingPrevious
  //TODO: isQuote
  //TODO: preImageUrl
  //preText

  return (
    <div 
      style={{
        maxWidth: "100vw",
        backgroundImage: "url(/img/godible-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      // style={{
      //   background: 'url("/img/godible-bg.jpg") no-repeat center center',
      //   backgroundSize: "cover",
      //   maxWidth: "100vw",
      // }}
    >
      <div className="flex flex-col justify-center w-full h-screen bg-gray-700 bg-opacity-50 sm:h-auto">
        <div className="flex flex-row items-center">
            <div 
              className="flex flex-col justify-center flex-grow w-full px-12 py-2 mx-auto sm:max-w-3xl sm:px-16 lg:px-8"
              style={{minHeight: "28em"}}
            >


              <div className="max-w-3xl sm:mx-auto lg:max-w-5xl">
                <div className="flex flex-col mb-6 sm:text-center sm:mb-6 ">
                  <a href="/" className="mb-6 sm:mx-auto">
                    {/* <div className="flex items-center justify-center w-24 rounded-full bg-teal-accent-400">
                      <img src="/logo/godible-logo.png" alt="Pre Image"></img>
                    </div> */}
                  </a>
                  <div className="max-w-5xl mb-4 sm:mx-auto sm:text-center lg:max-w-5xl sm:mb-6">
                    <p className="pb-6 text-sm tracking-wide text-gray-300 uppercase dark:text-gray-300 sm:text-md">
                    Today&apos;s Episode
                    </p>
                    {/* <h2 className="max-w-5xl mb-6 font-sans text-4xl font-bold leading-none tracking-tight text-white dark:text-white sm:text-5xl sm:mx-auto text-shadow">
                      Let God&apos;s Word be Heard
                    </h2> */}
                    <span className="-mb-10 font-serif text-4xl leading-none text-white dark:text-white sm:text-5xl">
                    “
                    </span>
                    <p className="font-serif text-white text-md mobile:text-lg dark:text-white xs:text-2xl" style={{marginTop: /*TODO: isQuote ? */ "-15px"}}>
                      Those were not just steps in my personal life but steps to heal the wounds of God&apos;s bitter sorrow by paying indemnity for history. Those were not just steps in my personal life buhistory.”
                    </p>
                  </div>
                  <div className="flex items-center justify-start w-full sm:justify-center">
                      <div className="w-4 h-4 overflow-hidden rounded-sm">
                        <img src="https://cdn.shopify.com/s/files/1/0267/3780/3343/files/CBG_Thumbnail_160x160.png?v=1666202514" className="w-full h-full"/>
                      </div>
                      <span className="pl-2 text-xs italic text-white dark:text-white">Chung Bu Mo Gyung Episode 6</span>
                  </div>
                  <div className="mt-6 -ml-5 sm:ml-0">
                    {/* <IonButton color="primary" fill="solid">
                      <IonIcon icon={playCircle} color="fullblack" />
                      <span className="pl-2 text-black dark:text-black">Sign Up</span>
                    </IonButton> */}
                    <IonButton fill="clear">
                      <IonIcon icon={playCircle} color="fullwhite" size="large" />
                      <span className="pl-2 text-white dark:text-white">Listen</span>
                      {/* Sign Up */}
                    </IonButton>
                    <IonButton fill="clear">
                      <IonIcon icon={add} color="fullwhite" />
                      <span className="pl-2 text-white dark:text-white">To List</span>
                    </IonButton>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="flex items-start justify-center w-full h-10 sm:hidden">
          <div className='flex flex-col items-center justify-start'>
            <span className="w-full text-xs uppercase text-medium">Scroll</span>
            <IonIcon icon={chevronDown} color="medium" size="small" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero