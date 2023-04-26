import { IonButton, useIonRouter } from '@ionic/react';
import { UserState } from 'components/UserStateProvider';
import React, { useContext } from 'react'


const LoggedInAlready = () => {
	const router = useIonRouter();
    const {
        user,
        logOut,
      } = useContext(UserState);

      if (!user.objectId) return <></>
    return (
        <div className="flex flex-col justify-center max-w-md p-6 py-8 bg-white rounded-lg dark:bg-light">
            {/* <span className="w-full font-bold text-center">{`${user.firstName} ${user.lastName}`}</span>
            <span className="w-full pb-4 font-medium text-center">{`You are logged in as ${user.email}`}</span> */}
            <IonButton 
                color="primary" 
                expand="block"
                onClick={() => {
                router.push("/profile")
                }}
            >
                Go to Profile
            </IonButton>
            <IonButton 
                color="primary" 
                expand="block"
                fill="clear"
                onClick={() => {
                if (!user.objectId) return
                logOut()
                }}
            >
                Log out
            </IonButton>
        </div>
    )
}

export default LoggedInAlready