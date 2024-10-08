import { IonAvatar, IonBackButton, IonButton, IonButtons, IonIcon, IonLabel, IonMenuButton, IonToolbar, isPlatform, useIonRouter } from '@ionic/react'
import { Player } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import { arrowForward } from 'ionicons/icons';
import React, { useContext, useEffect } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';



const Toolbar = ({children}) => {
    const player = useContext(Player);
    const {
        user,
        isModalOpen,
        setReroutePath,
        router: userRouter
      } = useContext(UserState);

      const router = useIonRouter();

      if (userRouter) userRouter.current = router;

    

    let userName = `${user?.firstName ? user?.firstName:""}${user?.lastName ? " "+user?.lastName:""}`
    if (userName.length === 0) userName = "M E"
    return (
        
        <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
            {/* <div className="hidden px-2 md:block"> */}
            <IonBackButton />
            {/* </div> */}
            </IonButtons>
            {children}
            <IonButtons slot="end">
                {user?.objectId ?
                    <div className="cursor-pointer hover:opacity-80">
                        <IonAvatar
                            onClick={()=>{router.push("/profile/");}}
                        >
                            {user.imageUrl ?
                                <img 
                                    src={user.imageUrl} 
                                    alt="My Profile" 
                                    className='p-2'
                                />
                            :
                                <div
                                    className={!isPlatform("ios") ? "p-2" : ""}
                                >
                                    <InitialsAvatar name={userName}  />
                                </div>
                            }
                        </IonAvatar>
                    </div>
                :
                    <IonButton 
                        fill="clear" 
                        onClick={()=>{
                            setReroutePath(router.routeInfo.pathname)
                            player.togglePlayPause(false);
                            router.push("/signin");
                        }}
                    >
                        <div className="items-center hidden xs:flex"><IonIcon icon={arrowForward} /></div>
                        <span className="px-2">Log in</span>
                    </IonButton>
                }
            </IonButtons>
        </IonToolbar>
    )
}

export default Toolbar