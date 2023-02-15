import {
  IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonToggle,
  } from '@ionic/react';
  import { useContext } from 'react';
  import { useLocation } from 'react-router-dom';
  import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, list, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
  import { pages } from 'data/pageData';
  import { Theme } from 'components/AppShell';
  
  interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }

  const titles = ['Saved',  ];
  
  const Menu: React.FC = () => {
    const location = useLocation();

    const theme = useContext(Theme);
    console.log(theme)
  
    return (
      <IonMenu contentId="main" type="overlay" >
        <IonContent>
          <div className="h-full w-full max-h-screen flex flex-col overflow-y-scroll items-start justify-start border-r-2 border-gray-400 border-opacity-10" id="menu">
            <div className="w-full items-center justify-center">
              <IonList id="inbox-list" >
                <IonListHeader>Godible</IonListHeader>
                {pages.map((page, index) => {
                  if (!page.isNav) return;
                  return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem 
                        className={location.pathname === page.path ? 'selected' : ''} 
                        //Search Query is empty to start
                        routerLink={page.path} 
                        routerDirection="none" 
                        lines="none" 
                        detail={false}
                        ion-padding={false}
                      >
                        <IonIcon slot="start" ios={page.iosIcon} md={page.icon} />
                        <IonLabel>{page.label}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                  );
                })}
              </IonList>
            </div>
            <div className="w-full flex-grow overflow-y-scroll items-start justify-start">
              <IonList id="labels-list">
                {titles.map((listTitle, index) => (
                  <IonItem lines="none" key={index} >
                    <IonIcon slot="start" icon={listTitle==="Saved" ? bookmarkOutline : list} />
                    <IonLabel>{listTitle}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
            <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-30"></span>
            <div className="w-full items-center justify-center">
              <IonItem>
                <IonToggle
                  slot="start"
                  name="darkMode"
                  onIonChange={() => {theme.setIsDark(!theme.isDark)}}
                />
              <IonLabel>{theme.isDark ? 'Dark' : 'Light'}</IonLabel>
              <IonButton color={"primary"} slot="end">English</IonButton>
              </IonItem>
            </div>
          </div>
        </IonContent>
      </IonMenu>
    );
  };
  
  export default Menu;
  