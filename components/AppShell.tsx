
import React, { createContext } from "react";
import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonSplitPane  } from '@ionic/react';
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

setupIonicReact({});

//Setup Contexts
export const UserState = createContext<IUserState>({
  user: undefined,
  isLoading: false,
  reroutePath: undefined,
  setReroutePath: () => null,
  notice: undefined,
  setNotice: () => null,
  language: "",
  setLanguage: () => null,
  isOnboarding: false,
  setIsOnboarding: () => null,

  //SIGN UP
  signUpError: undefined,
  setSignUpError: () => null,
  signUp: async () => null,
  
  logInError: undefined,
  setLogInError: () => null,
  logIn: async () => null,
  logInWithGoogle: async () => null,

  logOutError: undefined,
  setLogOutError: () => null,
  logOut: async () => null,

  resetError: undefined,
  setResetError: () => null,
  reset: async () => null,
})
export const Theme = createContext<ITheme>({
  isDark: false,
  setIsDark: () => null,
});

export const Player = createContext<IPlayer>({
    isPlaying: false,
    duration: 0,
    audio: undefined,
    togglePlayPause: () => null,
    episodes: undefined,
    setEpisodes:  () => null,
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
})

initializeParse(
  process.env.NEXT_PUBLIC_PARSE_HOST_URL!,
  process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY!
)


const AppShell: React.FC = () => {

  const theme = useTheme();
  const userState = useUser();
  const player = usePlayer();

  return (
    <UserState.Provider value={userState}>
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
    </UserState.Provider>
  );
};

export default AppShell;
