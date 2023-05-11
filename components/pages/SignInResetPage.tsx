import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import { Theme } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import AlertInline from 'components/ui/AlertInline';
import LoggedInAlready from 'components/ui/LoggedInAlready';
import TextDivider from 'components/ui/TextDivider';
import { isValidEmail } from 'hooks/useUser';
// import styles from './Signup.module.scss';

import { arrowBack, eye, eyeOff, logoApple, logoGoogle, shapesOutline } from "ionicons/icons";
import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';

const SignInResetPage: React.FC = () => {
  

	const router = useIonRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string|undefined>();

  const {
    resetError,
    setResetError,
    reset,
    isLoading,
    user,
  } = useContext(UserState);

  //Loading When Logging
  const [present, dismiss] = useIonLoading();
  useEffect(() => {
    if (isLoading) present({duration: 5000});
    if (!isLoading) dismiss();
  }, [isLoading])
  
  //TODO: Programmatically check what platform and then show floating only on android

	
	return (
		<IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>
          <IonTitle>Reset Password</IonTitle>
            <IonButtons slot="end">
              <IonButton 
                slot="end" 
                fill="clear" 
                size="small" 
                color="medium"
                    onClick={()=>{router.push("/signin")}}
                  >
                Log In
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 space-y-4 sm:bg-gray-100 dark:bg-light">
        <img src='/logo/godible-logo.png' className='w-40'></img>
          <div className="block max-w-md p-6 bg-white rounded-lg dark:bg-light">

              {(resetError && !message) &&
              <AlertInline
                message={typeof resetError === "string" ? resetError : resetError?.message}
                type="error"
                onDismiss={()=>{setResetError(undefined);}}
              />
              }
              {message &&
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                <AlertInline
                  message={message}
                  type="success"
                />
                </div>
                <IonButton
                  slot="end" 
                  fill="clear" 
                  size="small" 
                  color="medium"
                  onClick={()=>{router.push("/signin", undefined, "replace")}}
                >
                Log In</IonButton>
              </div>
              }
              <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Enter Email</IonLabel>
                      <IonInput value={user.email} placeholder="Your Account Email" onIonChange={(event) => setEmail(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>
              </div>
              <IonButton 
                color="primary" 
                expand="block"
                disabled={isLoading || typeof message === "string"}
                onClick={() => {
                  //Validations
                  if (!isValidEmail(email)) return setResetError("Invalid Email");
                  //Login
                  reset(email)
                    .then(() => {
                      //Logged in, so clear form
                      setMessage("Reset Sent!")
                      setEmail("");
                    })
                }}
              >
                Send Reset
              </IonButton>
              <div className='flex flex-col items-start justify-center w-full'>
                <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10 mt-4"></span>

                <div className='flex-grow' />
                <span 
                  onClick={()=>{router.push("/signin")}}
                  className='text-xs border-b-2 cursor-pointer'
                >
                  Return to Log in
                </span>
                <span 
                  className='w-64 pt-4 text-xs italic text-medium'
                >
                  Powered by Back4App
                </span>
              </div>
        </div>
      </div>
      </IonContent>
		</IonPage>
	);
};


export default SignInResetPage