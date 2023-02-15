import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonSplitPane  } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import NotFoundPage from './pages/NotFoundPage';
import Menu from './ui/Menu';

import Parse from 'parse';
import { pages } from 'data/pageData';

setupIonicReact({});

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell: React.FC = () => {
  
  const PARSE_APPLICATION_ID = 'LmmiwtKIw2qLgkgPnoooMyXbfViwlBC00He9Szp3';
  const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
  const PARSE_JAVASCRIPT_KEY = 'u1xDTMsGODAoEHyUY04ozHPHPrXpWwvfGDHJa80V';
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            {
              pages.map((page) => {
                return (
                  <Route 
                    path={page.path}
                    exact={page.isExact}
                    component={page.component}
                    key={page.label}
                  >
                    {page.isRedirect && <Redirect to={page.path} />}
                  </Route>
                )
              })
            }
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
