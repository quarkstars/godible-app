import { IonAvatar, IonBackButton, IonButton, IonButtons, IonIcon, IonLabel, IonMenuButton, IonToolbar, useIonRouter } from '@ionic/react'
import { Player } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import { arrowForward } from 'ionicons/icons';
import React, { useContext } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';

const Toolbar = ({children}) => {

    const player = useContext(Player);
    const {
        user
      } = useContext(UserState);

    console.log("user", user)
	const router = useIonRouter();
    return (
        
        <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
                <div className="hidden px-2 md:block">
                    <IonBackButton />
                </div>
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
                                    className='p-2'
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
                            player.togglePlayPause(false);
                            router.push("/signin");
                        }}
                    >
                        <IonIcon icon={arrowForward} />
                        <span className="px-2">Log in</span>
                    </IonButton>
                }
            </IonButtons>
        </IonToolbar>
    )
}

export default Toolbar