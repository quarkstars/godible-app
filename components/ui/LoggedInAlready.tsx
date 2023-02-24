import { IonButton, useIonRouter } from '@ionic/react';
import { UserState } from 'components/AppShell';
import React, { useContext } from 'react'


const LoggedInAlready = () => {
	const router = useIonRouter();
    const {
        user,
        logOut,
      } = useContext(UserState);

      if (!user) return <></>
    return (
        <div className="flex flex-col max-w-md p-6 bg-white rounded-lg dark:bg-light py-8 justify-center">
            <span className="w-full text-center font-bold">{`${user.get("firstName")} ${user.get("lastName")}`}</span>
            <span className="w-full text-center font-medium pb-4">{`You are logged in as ${user.get("email")}`}</span>
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
                if (!user) return
                logOut()
                }}
            >
                Log out
            </IonButton>
        </div>
    )
}

export default LoggedInAlready