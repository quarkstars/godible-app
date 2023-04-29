import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import { UserState } from 'components/UserStateProvider';
import AlertInline from 'components/ui/AlertInline';
import LoggedInAlready from 'components/ui/LoggedInAlready';
import TextDivider from 'components/ui/TextDivider';
import { isValidEmail } from 'hooks/useUser';
// import styles from './Signup.module.scss';

import { arrowBack, eye, eyeOff, logoApple, logoGoogle, shapesOutline } from "ionicons/icons";
import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';

const SignInPage: React.FC = () => {
  
  
	const router = useIonRouter();

  const [_message, setMessage] = useState<string|undefined>(undefined);
  useEffect(() => {
    //If current episode matches location, get the episode from the server
    if (!router.routeInfo) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const message = urlParams.get("message");
    if (message) setMessage(message)
  }, [router.routeInfo])
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    logIn,
    logInError,
    setLogInError,
    isLoading,
    user,
    logOut,
    logOutError,
    reroutePath,
    logInWithGoogle,
    setReroutePath
  } = useContext(UserState);

  //Loading When Logging
  const [present, dismiss] = useIonLoading();
  useEffect(() => {
    if (isLoading) present({duration: 5000});
    if (!isLoading) dismiss();
  }, [isLoading])
  
  //TODO: Programmatically check what platform and then show floating only on android
  //When user is present, reroute
  useEffect(() => {
    if (!user?.objectId) return;
    if (reroutePath) {
      let _reroutePath = reroutePath;
      setReroutePath(undefined);
      router.push(_reroutePath);
    }
    else router.push("/profile");
  }, [user?.objectId]);


  let message:any = _message;
  if (logInError)  {
    message = typeof logInError === "string" ? logInError : logInError?.message
  }
	
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
            <IonButtons slot="end">
              <IonButton 
                slot="end" 
                fill="clear" 
                size="small" 
                color="medium"
                    onClick={()=>{router.push("/signup", undefined, "replace")}}
                  >
                Or Sign Up
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 space-y-4 sm:bg-gray-100 dark:bg-light">
        <img src='/logo/godible-logo.png' className='w-40'></img>
        {user?.objectId ? 
          <LoggedInAlready />
        :
          <div className="block max-w-md p-6 bg-white rounded-lg dark:bg-light">
            <IonButton 
              color="medium" 
              fill="outline"  
              expand="block"
              disabled={isLoading}
              onClick={()=>{logInWithGoogle()}}
            >
              <img src="/img/g-logo.webp" alt="G" className="w-4 h-4 rounded-full" />
              <span className="px-2">Continue with Google</span>
            </IonButton>
            {/* <IonButton 
              color="medium" 
              fill="outline"  
              expand="block"
                disabled={isLoading}
            >
              <IonIcon icon={logoApple} slot="start" />
              Continue with Apple
            </IonButton> */}
            <TextDivider>or</TextDivider>
              {message &&
              <AlertInline
                message={message}
                type="error"
                onDismiss={()=>{setLogInError(undefined); setMessage(undefined)}}
              />
              }
              <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Email</IonLabel>
                      <IonInput placeholder="Email" onIonChange={(event) => setEmail(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>
              </div>
              <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Password</IonLabel>
                      <IonInput type="password" onIonChange={(event) => setPassword(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>

              </div>
              <IonButton 
                color="primary" 
                expand="block"
                disabled={isLoading}
                onClick={() => {
                  //Validations
                  if (user?.objectId) return setLogInError("Already logged in");
                  if (email==="" && password==="") return setLogInError("Missing Credentials");
                  if (!isValidEmail(email)) return setLogInError("Invalid Email");
                  if (password==="") return setLogInError("Missing Password");
                  //Login
                  logIn(email, password)
                    .then(() => {
                      //Logged in, so clear form
                      if (!user) return;
                      setEmail("");
                      setPassword("");
                    })
                }}
              >
                Log in
              </IonButton>
              <div className='flex flex-col items-start justify-center w-full'>
                <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10 mt-4"></span>
                <button className="py-2"
                  onClick={() =>router.push("/reset")}
                >
                  <span className="text-sm font-medium text-primary-shade hover:underline dark:text-primary-shade">Forgot password?</span>
                </button>
                <span className='text-xs'>Don&apos;t have an account yet?</span>
                <div className='flex-grow' />
                <span 
                  onClick={()=>{router.push("/signup", undefined, "replace")}}
                  className='text-xs border-b-2 cursor-pointer'
                >
                  Sign up free
                </span>
              </div>
        </div>
        }
      </div>
      </IonContent>
		</IonPage>
	);
};


export default SignInPage

