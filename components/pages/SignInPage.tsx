import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { Theme } from 'components/AppShell';
import { Player } from 'components/ui/Player';
import TextDivider from 'components/ui/TextDivider';
// import styles from './Signup.module.scss';

import { arrowBack, eye, eyeOff, logoApple, logoGoogle, shapesOutline } from "ionicons/icons";
import { useContext, useState } from 'react';
import { useParams } from 'react-router';

const SignInPage: React.FC = () => {
  


  //TODO: Programmatically check what platform and then show floating only on android
  //TODO: Check if logged in, and if so go to previous place
	
	return (
		<IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <div className='flex justify-start sm:w-28'>
                <IonBackButton defaultHref="/"></IonBackButton>
              </div>
            </IonButtons>
          <IonTitle>Log in to Continue</IonTitle>
          <IonButton slot="end" fill="clear" size="small" color="medium">
            Or Sign Up
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 space-y-4 sm:bg-gray-100 dark:bg-light">
        <img src='/logo/godible-logo.png' className='w-40'></img>
        <div className="block max-w-md p-6 bg-white rounded-lg dark:bg-light">
          <IonButton color="medium" fill="outline"  expand="block">
            <IonIcon icon={logoGoogle} slot="start" />
            Continue with Google
          </IonButton>
          <IonButton color="medium" fill="outline"  expand="block">
            <IonIcon icon={logoApple} slot="start" />
            Continue with Apple
          </IonButton>
          <TextDivider>Or</TextDivider>
            <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Email</IonLabel>
                    <IonInput placeholder="Email"></IonInput>
                  </IonItem>
            </div>
            <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Password</IonLabel>
                    <IonInput type="password"></IonInput>
                  </IonItem>
            </div>
            <IonButton color="primary" expand="block">
              Log in
            </IonButton>
            <div className='flex flex-col items-center justify-center w-full'>
              
              <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10 mt-4"></span>
              <span className='text-xs'>Don&apos;t have an account yet??</span>
              <div className='flex-grow' />
              <span className='text-xs'>Sign up</span>
            </div>
        </div>
      </div>
      </IonContent>
      <IonFooter>
        <Player />
      </IonFooter>
		</IonPage>
	);
};


export default SignInPage