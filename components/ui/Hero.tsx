import { IonButton, IonIcon } from '@ionic/react'
import { add, addCircle, play, playCircle } from 'ionicons/icons'
import React from 'react'

const Hero = () => {
  return (
    <div 
      style={{
        
        background: 'url("https://lh3.googleusercontent.com/wMsuM8j3PhZyzC92wko5nc5vDNU57_RShjyLOUBaNNkr5QK5qfzucS7kIMkxPYshDIGBSPqNlE37_lWl3VZSioE=w1519") no-repeat center center',
        backgroundSize: "cover"
      }}
    >
      <div className="w-full h-full bg-green-900 bg-opacity-30">
        <div className="flex flex-col justify-center w-full h-full min-h-screen px-8 py-12 mx-auto sm:max-w-3xl sm:min-h-0 sm:px-24 lg:px-8 lg:py-16">


          <div className="max-w-3xl sm:mx-auto lg:max-w-5xl">
            <div className="flex flex-col mb-16 sm:text-center sm:mb-0 ">
              <a href="/" className="mb-6 sm:mx-auto">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-accent-400">
                  <svg
                    className="w-10 h-10 text-deep-purple-900"
                    stroke="currentColor"
                    viewBox="0 0 52 52"
                  >
                    <polygon
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      points="29 13 14 29 25 29 23 39 38 23 27 23"
                    />
                  </svg>
                </div>
              </a>
              <div className="max-w-5xl mb-4 sm:mx-auto sm:text-center lg:max-w-5xl sm:mb-12">
                <h2 className="max-w-5xl mb-6 font-sans text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl sm:mx-auto drop-shadow-lg">
                  Let God&apos;s Word be Heard
                </h2>
                <p className="font-serif text-2xl text-white sm:text-2xl">
                  Grumpy Wizards make toxic brew 片仮名
                </p>
              </div>
              <div>
                <IonButton color="light">
                  <IonIcon icon={play} color="dark" />
                  <span className="pl-2 text-light">Episode</span>
                  {/* Sign Up */}
                </IonButton>
                <IonButton fill="clear" color="light">
                  <IonIcon icon={addCircle} color="light" />
                  <span className="pl-2 text-white">To List</span>
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero