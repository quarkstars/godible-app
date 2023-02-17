import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { Theme } from 'components/AppShell';
import TextDivider from 'components/ui/TextDivider';
// import styles from './Signup.module.scss';

import { arrowBack, eye, eyeOff, logoApple, logoGoogle, personCircleOutline, shapesOutline } from "ionicons/icons";
import { useContext, useState } from 'react';
import { useParams } from 'react-router';

const SignUpPage: React.FC = () => {
  

  const [showPass, setShowPass] = useState<boolean>(false)

  //TODO: Programmatically check what platform and then show floating only on android
  //TODO: Check if logged in, and if so go home
	
	return (
		<IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>
          <IonTitle>Start Listening Free</IonTitle>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={personCircleOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 space-y-4 sm:bg-green-800">
        <img src='/logo/godible-logo.png' className='w-40'></img>
        <div className="block max-w-md p-6 bg-white rounded-lg dark:bg-light">
          <IonButton color="medium" fill="outline"  expand="block">
            <IonIcon icon={logoGoogle} slot="start" />
            Sign Up with Google
          </IonButton>
          <IonButton color="medium" fill="outline"  expand="block">
            <IonIcon icon={logoApple} slot="start" />
            Sign Up with Apple
          </IonButton>
          <TextDivider>Or Email</TextDivider>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>First name</IonLabel>
                    <IonInput placeholder="First"></IonInput>
                  </IonItem>
              </div>
              <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Last name</IonLabel>
                    <IonInput placeholder="Last"></IonInput>
                  </IonItem>
              </div>
            </div>
            <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Email Address</IonLabel>
                    <IonInput placeholder="Email"></IonInput>
                  </IonItem>
            </div>
            <div className="mb-6 form-group">
                  <IonItem>
                    <IonLabel position='floating'>Create Password</IonLabel>
                    <IonInput type={showPass ? "text" : "password"}></IonInput>
                    <IonButton slot="end" fill='clear' size="large" color="light" onClick={()=>{setShowPass(!showPass)}}>
                      <IonIcon icon={!showPass ? eyeOff : eye } />
                    </IonButton>
                  </IonItem>
            </div>
            <IonButton color="primary" expand="block">
              Create Account
            </IonButton>
            <div className='flex flex-col items-center justify-center w-full'>
              
              <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10 mt-4"></span>
              <span className='text-xs'>Already have an account?</span>
              <div className='flex-grow' />
              <span className='text-xs'>Login</span>
            </div>
        </div>
      </div>
      </IonContent>
		</IonPage>
	);
};


export default SignUpPage