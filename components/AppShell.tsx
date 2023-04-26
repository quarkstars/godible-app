
import React, { createContext } from "react";
import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonSplitPane, IonFooter, IonToolbar  } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import NotFoundPage from './pages/NotFoundPage';
import Menu from './ui/Menu';

import Parse from 'parse';
import { IUser } from "data/types";
import useTheme, { ITheme } from "hooks/useTheme";
import usePlayer, { IPlayer } from "hooks/usePlayer";
import Routes from "./Routes";
import useUser, { IUserState } from "hooks/useUser";
import { initializeParse } from "@parse/react";
import { PlayerControls } from "./ui/PlayerControls";
import UserStateProvider from "./UserStateProvider";
 
import {Elements} from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js';


const publicKey = (process.env.NEXT_PUBLIC_STRIPE_LIVE_ENABLED==="true") ? 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE : 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;
const stripePromise = loadStripe(publicKey!);


setupIonicReact({});

export const Theme = createContext<ITheme>({
  isDark: false,
  setIsDark: () => null,
});

export const Player = createContext<IPlayer>({
    isPlaying: false,
    duration: 0,
    audio: undefined,
    togglePlayPause: () => null,
    list: undefined,
    setList:  () => null,
    volume: .75,
    setVolume: () => null,
    setTimeTilNext: () => null,
    timeTilNext: undefined,
    index: 0,
    setIndex:  () => null,
    currentSeconds: 0,
    setCurrentSeconds: () => null,
    seekTime: () => null,
    isSeeking: false,
    setIsSeeking:  () => null,
    setDuration: () => null,
    jump: () => null,
    switchEpisode: () => null,
    isVisible: true, 
    setIsVisible: () => null,
    message: undefined,
    setMessage: () => null,
    isReady: false,
    rewind: () => null,
    next: () => null,
    setIsAutoPlay: () => null,
    userState: undefined,
    isMutatingList: true, 
    setIsMutatingList: () => null,
    router: undefined,
})

initializeParse(
  'https://parseapi.back4app.com/',
  'LmmiwtKIw2qLgkgPnoooMyXbfViwlBC00He9Szp3',
  'u1xDTMsGODAoEHyUY04ozHPHPrXpWwvfGDHJa80V'
)


const AppShell: React.FC = () => {

  const theme = useTheme();
  const player = usePlayer();

  return (
    <Elements stripe={stripePromise}>
      <UserStateProvider>
        <Theme.Provider value={theme}>
          <Player.Provider value={player}>
            <IonApp>
              <IonReactRouter>
                <IonSplitPane contentId="main">
                  <Menu />
                  <Routes />
                </IonSplitPane>
              </IonReactRouter>
            </IonApp>
          </Player.Provider>
        </Theme.Provider>
      </UserStateProvider>
    </Elements>
  );
};

export default AppShell;
