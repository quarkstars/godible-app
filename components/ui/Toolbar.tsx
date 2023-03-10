import { IonAvatar, IonBackButton, IonButton, IonButtons, IonIcon, IonLabel, IonMenuButton, IonToolbar, useIonRouter } from '@ionic/react'
import { UserState } from 'components/AppShell';
import { arrowForward } from 'ionicons/icons';
import React, { useContext } from 'react'
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';

const Toolbar = ({children}) => {

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
                {user.objectId ?
                    <IonAvatar
                        onClick={()=>{router.push("/profile");}}
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