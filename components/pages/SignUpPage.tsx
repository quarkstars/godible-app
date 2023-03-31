import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import { Theme, UserState } from 'components/AppShell';
import AlertInline from 'components/ui/AlertInline';
import LoggedInAlready from 'components/ui/LoggedInAlready';
import TextDivider from 'components/ui/TextDivider';
import { isValidEmail } from 'hooks/useUser';
// import styles from './Signup.module.scss';

import { arrowBack, eye, eyeOff, logoApple, logoGoogle, personCircleOutline, shapesOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

const SignUpPage: React.FC = () => {
  
	const router = useIonRouter();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    signUp,
    signUpError,
    setSignUpError,
    user,
    isLoading,
    reroutePath,
    setReroutePath,
    logInWithGoogle,
  } = useContext(UserState);

  //Loading When Logging
  const [present, dismiss] = useIonLoading();
  useEffect(() => {
    if (isLoading) present({duration: 9999});
    if (!isLoading) dismiss();
  }, [isLoading])

  //TODO: Programmatically check what platform and then show floating only on android
  

  //When loggedin user is present, reroute
  useEffect(() => {
    if (!user.objectId) return;
    if (reroutePath) {
      let _reroutePath = reroutePath;
      setReroutePath(undefined);
      router.push(_reroutePath);
    }
    else router.push("/profile");
  }, [user.objectId]);
  
	
	return (
		<IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>
          <IonTitle>Start Listening Free</IonTitle>
            <IonButtons slot="end">
              <IonButton 
                slot="end" 
                fill="clear" 
                size="small" 
                color="medium"
                    onClick={()=>{router.push("/signin")}}
                  >
                Or Log In
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
      <div className="flex flex-col items-center justify-center w-full min-h-full p-4 space-y-4 sm:bg-green-800">
        <img src='/logo/godible-logo.png' className='w-40'></img>
        {user.objectId ?
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
              <IonIcon icon={logoGoogle} slot="start" />
              Continue with Google
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
            <TextDivider>or email</TextDivider>
            
              {signUpError &&
                  <AlertInline
                    message={typeof signUpError === "string" ? signUpError : signUpError?.message}
                    type="error"
                    onDismiss={()=>{setSignUpError(undefined)}}
                />
              }
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>First name</IonLabel>
                      <IonInput placeholder="First" onIonChange={(event) => setFirst(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>
                </div>
                <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Last name</IonLabel>
                      <IonInput placeholder="Last" onIonChange={(event) => setLast(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>
                </div>
              </div>
              <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Email Address</IonLabel>
                      <IonInput placeholder="Email" onIonChange={(event) => setEmail(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                    </IonItem>
              </div>
              <div className="mb-6 form-group">
                    <IonItem>
                      <IonLabel position='floating'>Create Password</IonLabel>
                      <IonInput type={showPass ? "text" : "password"} onIonChange={(event) => setPassword(typeof event.target.value === "string" ? event.target.value : "")}></IonInput>
                      <IonButton slot="end" fill='clear' size="large" color="medium" onClick={()=>{setShowPass(!showPass)}}>
                        <div className="p-2 pr-0">
                          <IonIcon icon={!showPass ? eyeOff : eye } />
                        </div>
                      </IonButton>
                    </IonItem>
              </div>
              <IonButton 
              color="primary" 
              expand="block" 
                onClick={() => {
                  //Validate
                  if (user.objectId) return setSignUpError("Already logged in");
                  if (email==="" && password==="") return setSignUpError("Create your credentials");
                  if (!isValidEmail(email)) return setSignUpError("Invalid email");
                  if (password==="") return setSignUpError("Create a password");
                  if (first==="") return setSignUpError("Enter first name");
                  if (last==="") return setSignUpError("Enter last name");

                  //Sign up
                  signUp(email, password, first, last)
                  .then (()=> {
                    //On success clear form
                    if (user) {
                      setPassword("");
                      setEmail("");
                      setFirst("");
                      setLast("");
                    }
                  })
                }}
              >
                Create Account
              </IonButton>
              <div className='flex flex-col items-start justify-center w-full'>
                {/* TODO: Link */}
                <span className="h-0.5 w-full border-t border-gray-400 block border-opacity-10 mt-4"></span>
                <span className='text-xs'>Already have an account?</span>
                <div className='flex-grow' />
                <span 
                  onClick={()=>{router.push("/signin", undefined, "pop")}}
                  className='text-xs border-b-2 cursor-pointer'
                >
                  Sign up
                </span>
              </div>
          </div>
          }
      </div>
      </IonContent>
		</IonPage>
	);
};


export default SignUpPage