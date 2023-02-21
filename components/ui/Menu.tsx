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
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, list, mailOutline, mailSharp, moonOutline, paperPlaneOutline, paperPlaneSharp, sunnyOutline, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { Theme } from 'components/AppShell';
import { pages } from 'components/Routes';
  
  interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }

  const titles = ['Saved', 'Saved','Saved', ];
  
  const Menu: React.FC = () => {
    const location = useLocation();

    let hideClass:string|undefined;
    if (location.pathname === "/signup" || location.pathname === "/signin") {
      hideClass = "hide"
    }
    console.log(location.pathname, hideClass)

    const theme = useContext(Theme);
  
    return (
        <IonMenu contentId="main" type="overlay" className={hideClass}>
          <IonContent>
            <div className="flex flex-col items-start justify-start w-full h-full max-h-screen overflow-y-scroll border-r-2 border-gray-400 border-opacity-10" id="menu">
              <div className="items-center justify-center w-full">
                <IonList id="inbox-list" >
                  <IonListHeader>
                    <img src='/logo/godible-logo.png' className='w-32 mb-4'/>
                  </IonListHeader>
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
              {/* TODO: MIN HEIGHT DOESN"T WORK */}
              <div className="items-start justify-start flex-grow w-full overflow-y-scroll min-h-[100px]">
                <IonList id="labels-list">
                  {titles.map((listTitle, index) => (
                    <IonItem lines="none" key={index} >
                      <IonIcon slot="start" icon={listTitle==="Saved" ? bookmarkOutline : list} />
                      <IonLabel>{listTitle}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
              <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10"></span>
              <div className="items-center justify-center w-full">
                <IonItem>
                  <IonToggle
                    slot="start"
                    name="darkMode"
                    checked={theme.isDark}
                    onClick={() => {theme.setIsDark(!theme.isDark)}}
                  />
                <IonIcon slot={'start'} icon={theme.isDark ?  moonOutline : sunnyOutline} />
                <IonButton color={"primary"} slot="end">English</IonButton>
                </IonItem>
              </div>
            </div>
          </IonContent>
        </IonMenu>
    );
  };
  
  export default Menu;
  