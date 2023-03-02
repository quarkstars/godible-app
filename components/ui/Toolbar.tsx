import { IonAvatar, IonButton, IonButtons, IonIcon, IonLabel, IonMenuButton, IonToolbar, useIonRouter } from '@ionic/react'
import { UserState } from 'components/AppShell';
import { arrowForward } from 'ionicons/icons';
import React, { useContext } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';

const Toolbar = ({children}) => {

    const {
        user
      } = useContext(UserState);

    
	const router = useIonRouter();
    return (
        
        <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
                <span className="hidden w-20 px-2 md:block"></span>
            </IonButtons>
            {children}
            <IonButtons slot="end">
                {user ?
                    <IonAvatar
                        onClick={()=>{router.push("/profile");}}
                    >
                        {user.get("imageUrl") ?
                            <img 
                                src={user.get("imageUrl")} 
                                alt="My Profile" 
                                className='p-2'
                            />
                        :
                            <div
                                className='p-2'
                            >
                                <InitialsAvatar name={`${user.get("firstName")} ${user.get("lastName")}`}  />
                            </div>
                        }
                    </IonAvatar>
                :
                    <IonButton 
                        fill="clear" 
                        onClick={()=>{router.push("/signin");}}
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