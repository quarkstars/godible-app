import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { add, addCircle, chevronBack, chevronDown, chevronForward, play, playCircle } from 'ionicons/icons'
import React from 'react'

interface IHeroProps {
  title?: string,
  subtitle?: string,
  mainButtonText?: string,
  mainButtonIcon?: string,
  onClickMain?: Function,
  subButtonText?: string,
  subButtonIcon?: string,
  onClickSub?: Function,
  overlayColor?: string,
  bgImageUrl?: string,
  isQuote?: boolean,
  scrollIsHidden?: boolean,
  preImageUrl?: string,
  preText?: string,
  postImageUrl?: string,
  postText?: string,
}

const Hero = (props: IHeroProps) => {

const {
  
  title, //Let God's Word Be Heard
  subtitle,
  mainButtonText,
  mainButtonIcon,
  onClickMain,
  subButtonText,
  subButtonIcon,
  onClickSub,
  overlayColor,
  bgImageUrl, //"/logo/godible.png"
  postImageUrl, 
  postText,
  scrollIsHidden,
  isQuote,
  preImageUrl,
  preText,
} = props;

  return (
    <div 
      style={{
        maxWidth: "100vw",
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}

    >
      <div className="flex flex-col justify-center w-full h-screen bg-opacity-50 sm:h-auto" style={{background: overlayColor}}>
        <div className="flex flex-row items-center">
            <div 
              className="flex flex-col justify-center flex-grow w-full px-12 py-2 mx-auto sm:max-w-3xl sm:px-16 lg:px-8"
              style={{minHeight: "26em"}}
            >


              <div className="max-w-3xl sm:mx-auto lg:max-w-5xl">
                <div className="flex flex-col items-center w-full mb-2 sm:text-center sm:mb-2 ">
                  {preImageUrl &&
                    <div className="flex items-center justify-center w-24 rounded-full bg-teal-accent-400">
                      <img src={preImageUrl} alt="Pre Image"></img>
                    </div>
                  }
                  <div className="max-w-5xl mb-2 sm:mx-auto sm:text-center lg:max-w-5xl sm:mb-3">
                    {preText &&
                      <p className="pb-6 text-sm tracking-wide text-center text-gray-300 uppercase dark:text-gray-300 sm:text-md">
                        {preText}
                      </p>
                    }
                    {title &&
                    <h2 className="max-w-5xl mb-6 font-sans text-5xl font-bold leading-none tracking-tight text-center text-white dark:text-white md:8xl xs:text-6xl sm:text-7xl sm:mx-auto text-shadow">
                      {title}
                    </h2>
                    }
                    {isQuote && 
                    <div className="w-full font-serif text-4xl leading-none text-center text-white dark:text-white sm:text-5xl">
                    “
                    </div>
                    }
                    {subtitle &&
                    <p className={`font-serif  text-white text-md mobile:text-lg dark:text-white xs:text-2xl ${isQuote ? "text-left xs:text-center" : "text-center"}`} style={{marginTop: isQuote ? "-15px" : "0px"}}>
                      {`${subtitle}${isQuote?"”":""}`}
                    </p>
                    }
                  </div>
                  <div className="flex items-center justify-center w-full cursor-pointer" onClick={(e) => {if (onClickMain) onClickMain(e)}}>
                    {postImageUrl &&
                      <div className="w-4 h-4 overflow-hidden rounded-sm">
                        <img src={postImageUrl} className="w-full h-full"/>
                      </div>
                    }
                    {postText && <span className="pl-2 text-xs italic text-white dark:text-white">{postText}</span>}
                  </div>
                  <div className="mt-4 -ml-5 sm:ml-0">
                    {mainButtonText &&
                    <IonButton fill={mainButtonIcon ? "clear" : "outline"} color="fullwhite" onClick={(e) => {if (onClickMain) onClickMain(e)}}>
                      {mainButtonIcon && <IonIcon icon={mainButtonIcon} color="fullwhite" size="large" />}
                      <span className={`text-white dark:text-white ${mainButtonIcon ? "pl-2" : ""}`}>{mainButtonText}</span>
                    </IonButton>
                    }
                    {subButtonText &&
                    <IonButton fill={subButtonIcon ? "clear" : "outline"} color="fullwhite" onClick={(e) => {if (onClickSub) onClickSub(e)}}>
                      {subButtonIcon && <IonIcon icon={subButtonIcon} color="fullwhite" />}
                      <span className={`text-white dark:text-white ${subButtonIcon ? "pl-2" : ""}`}>{subButtonText}</span>
                    </IonButton>
                    }
                  </div>
                </div>
              </div>
            </div>
        </div>
        {!scrollIsHidden &&
          <div className="flex items-start justify-center w-full h-10 opacity-50 sm:hidden">
            <div className='flex flex-col items-center justify-start'>
              <span className="w-full text-xs uppercase text-dark">Scroll</span>
              <IonIcon icon={chevronDown} color="light" size="small" />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Hero