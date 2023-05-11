import { IonAvatar, IonBackButton, IonButton, IonButtons, IonIcon, IonLabel, IonMenuButton, IonToolbar, useIonRouter } from '@ionic/react'
import { Player } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import { arrowForward } from 'ionicons/icons';
import React, { useContext, useEffect } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';
import { App } from '@capacitor/app';



const Toolbar = ({children}) => {
    const player = useContext(Player);
    const {
        user,
        isModalOpen,
        setReroutePath,
      } = useContext(UserState);

	const router = useIonRouter();
    useEffect(() => {
        let backButtonListener;
    
        const addListenerAsync = async () => {
            backButtonListener = await App.addListener('backButton', (data) => {
                if (isModalOpen && isModalOpen.current) return;
                if (router.canGoBack()) router.goBack();
            });
        };
    
        addListenerAsync();
    
        return () => {
            // Clean up listener
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, []);
    

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
                                    className='overflow'
                                >
                                    <InitialsAvatar name={`${user.firstName} ${user.lastName}`}  />
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