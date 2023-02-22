
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

setupIonicReact({});

//Setup Contexts
export const UserState = createContext<IUserState>({
  user: undefined,
  isLoading: false,
  reroutePath: "",
  setReroutePath: () => null,
  notice: undefined,
  setNotice: () => null,

  //SIGN UP
  signUpError: () => null,
  signUp: async () => null,
  language: "",
  setLanguage: () => null,
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
})


const AppShell: React.FC = () => {
  
  //Initialize Parse
  //TODO: move to .env
  const PARSE_APPLICATION_ID = 'LmmiwtKIw2qLgkgPnoooMyXbfViwlBC00He9Szp3';
  const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
  const PARSE_JAVASCRIPT_KEY = 'u1xDTMsGODAoEHyUY04ozHPHPrXpWwvfGDHJa80V';
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

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
