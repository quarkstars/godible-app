import { useEffect } from 'react';
//Used in AppShell to create a UserContext and interact with the logged in User on the server

import { checkmarkCircle } from 'ionicons/icons';
import Parse, { Error } from 'parse';
import React, { SetStateAction, useState } from "react";
import { isPlatform } from '@ionic/react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// This is also where a non logged in user will store Language Preference, Volume and logically resolve when logging in 
// where existing user language takes precedemce

interface INotice {
    message: string,
    icon: string,
    color: string,
}

export interface IUserState {
    user?: Parse.Object|null,
    isLoading: boolean,
    reroutePath: string|undefined,
    setReroutePath: React.Dispatch<SetStateAction<string | undefined>>,
    notice?: INotice,
    setNotice: React.Dispatch<SetStateAction<INotice | undefined>>,
    language: string,
    setLanguage: React.Dispatch<SetStateAction<string>>,
    isOnboarding: boolean,
    setIsOnboarding: React.Dispatch<SetStateAction<boolean>>,

    //SIGN UP
    signUpError: any,
    setSignUpError: React.Dispatch<any>,
    signUp: Function,

    //SIGN IN
    logInError: any,
    setLogInError: React.Dispatch<any>,
    logIn: Function,
    logInWithGoogle: Function,

    //LOG OUT
    logOutError: any,
    setLogOutError: React.Dispatch<any>,
    logOut: Function,

    //RESET
    resetError: any,
    setResetError: React.Dispatch<any>,
    reset: Function,
}


export const isValidEmail = (email: string) => {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const useUser = () => {

    //Logged in user
    const [user, setUser] = useState<Parse.Object|null|undefined>(); 

    //language preference. Should be lowercase
    const [language, setLanguage] = useState<string>("english");

    //When logging in, reroute to a specific path
    const [reroutePath, setReroutePath] = useState<string|undefined>();

    //Setting a notice to the user will create a toast
    const [notice, setNotice] = useState<INotice|undefined>();

    //Loading State, waiting for server response
    const [isLoading, setIsLoading] = useState<any>();
    
    //Loading State, waiting for server response
    const [isOnboarding, setIsOnboarding] = useState<any>();

    useEffect(() => {
        if (isPlatform('capacitor')) return;
        try {
                GoogleAuth.initialize({
                    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    scopes: ['profile', 'email'],
                    grantOfflineAccess: true,
                })
        }
        catch (err) { console.error(err) }
    }, [isPlatform]);
    


    //set Current User
    const getCurrentUser = async function (): Promise<Parse.Object|null|undefined> {
        const currentUser: Parse.User|undefined|null = await Parse.User.current();
        if (currentUser) setUser(currentUser);
        return currentUser;
    };
    useEffect(() => {
        if (!Parse) return;
        if (user) return;
        getCurrentUser();
    }, [Parse]);

    //set onboarding if created within a minute ago
    useEffect(() => {
        if (!user) return;
        const createdAt = user.get("createdAt");
        const createdTime = Math.floor(new Date(createdAt).getTime());
        if (!createdTime) return;
        if (Date.now()-60000 < createdTime) {
            setIsOnboarding(true);
        }
    }, [user]);
    

    //Login Function
    const [logInError, setLogInError] = useState<any>();
    const logIn = async function (email: string, password: string): Promise<Parse.Object | Error | undefined> {
        // Note that these values come from state variables that we've declared before
        try {
            setIsLoading(true);
            const loggedInUser: Parse.User = await Parse.User.logIn(email, password);
            // To verify that this is in fact the current user, `current` can be used
            const currentUser: Parse.User<Parse.Attributes>|undefined|null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({message: "Failed to Log In"});
            }
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setLogInError(undefined);
            }

            // Update state variable holding current user
            setUser(currentUser);
            setIsLoading(false);
            return currentUser;
        } catch (error: any) {
            // Error can be caused by wrong parameters or lack of Internet connection
            setLogInError(error);
            setIsLoading(false);
            return error;
        }
      };
            
      // Function to log into Google
      // Gets a Google User and then links with Parse User which is the actual user the app uses
      // Google User will be signed in but will be unused
      //https://www.youtube.com/watch?v=GwtpoWZ_78E TODO: Add Reverse Client Id to App 15:00
      //TODO: When putting on store for auto login you need keyprint or something 17:50
      const logInWithGoogle = async function () {
            let googleUser:any;
            try {
                googleUser = await GoogleAuth.signIn();
            }
            catch (error) {
                setLogInError(error);    
                return error;
            }
            if (!googleUser) {
                setLogInError({message:"Failed to log in with Google"});      
                return;
            }
            console.log("GOOGLE USER", googleUser)

            let currentUser = new Parse.User();
            currentUser.set('username', googleUser.email);
            currentUser.set('email', googleUser.email);
            if (googleUser.givenName) currentUser.set('firstName', googleUser.givenName);
            if (googleUser.familyName) currentUser.set('lastName', googleUser.familyName);
            if (googleUser.imageUrl) currentUser.set('imageUrl', googleUser.imageUrl);


        console.log("CURRENT USER", currentUser, {
            id: googleUser.id,
            id_token: googleUser.authentication.idToken,
        })

            //Currently if a user exists already with the same email, it will not allow a new user
            //
            let idToken = googleUser.authentication.idToken;
            // if (idToken.split(".").length > 1) idToken = idToken.split(".")[0];
            // console.log('idToken', idToken, googleUser.authentication.idToken.split("."))

            try {
                setIsLoading(true);
                currentUser = await currentUser.linkWith('google', {
                authData: {
                    id: googleUser.id,
                    id_token: idToken,
                }
                });
            }
            catch (error) {
                setLogInError(error); 
                setIsLoading(false);   
                GoogleAuth.signOut().catch();
                return error;

            }
 
            if (!currentUser) {
                setLogOutError({message: "Failed to Log In"});
                GoogleAuth.signOut().catch();
                return;
            }
            setNotice({
                message: "Logged in with Google",
                icon: checkmarkCircle,
                color: "green",
            });
            setLogInError(undefined);
            setUser(currentUser);
            setIsLoading(false);

            return currentUser;
            

      };
    
      const [logOutError, setLogOutError] = useState<any>();
      //Log out Function
      const logOut = async function (): Promise<Parse.Object | Error | undefined> {
        
        setIsLoading(true);
        //Try to sign out gooogle user if exists
        GoogleAuth.signOut().catch();

        try {
            await Parse.User.logOut();
            // To verify that current user is now empty, currentAsync can be used
            const currentUser: Parse.User<Parse.Attributes>|undefined|null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({message: "Already Logged out"});
            }
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setLogOutError(undefined);
            }
            // Update state variable holding current user
            setUser(currentUser);
            setIsLoading(false);
            return currentUser;
        } catch (error: any) {
            setIsLoading(false);
            setLogOutError(error);
            return error;
        }
      };
    
    

    
    const [signUpError, setSignUpError] = useState<any>();
    // Email Sign up Function - Returns User or Error
    const signUp = async function (email: string, password: string, first: string, last: string): Promise<Parse.Object | Error | undefined> {
        //TODO: Do not do this is user is already defined...
        // Note that these values come from state variables that we've declared before
        try {
            setIsLoading(true);
            // Since the signUp method returns a Promise, we need to call it using await
            const newUser: Parse.User<Parse.Attributes>|undefined = await Parse.User.signUp(
                email, 
                password,
                {
                    email: email,
                    firstName: first,
                    lastName: last,
                    langauge: language,
                }
            )
            if (!newUser) {
                setSignUpError({message: "An issue occured"});
            } 
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setSignUpError(undefined);
            }
            setIsLoading(false);
            setUser (newUser)
            return newUser;
        } catch (error: any) {
            // signUp can fail if any parameter is blank or failed an uniqueness check on the server
            setSignUpError(error);
            setIsLoading(false);
            return error;
        };
    };

    const [resetError, setResetError] = useState<any>();
    //Reset Password Request
    const reset = async function (email: string): Promise<boolean> {
      try {
          setIsLoading(true);
          await Parse.User.requestPasswordReset(email);
          setIsLoading(false);
          return true;
      } catch (error: any) {
          setIsLoading(false);
          setLogOutError(error);
          return false;
      }
    };


    return {
        user,
        isLoading,
        reroutePath,
        setReroutePath,
        notice,
        setNotice,
        language,
        setLanguage,
        getCurrentUser,
        isOnboarding,
        setIsOnboarding,

        //SIGN UP
        signUpError,
        setSignUpError,
        signUp,

        //LOG IN
        logInError,
        setLogInError,
        logIn,
        logInWithGoogle,

        //LOG OUT
        logOutError,
        setLogOutError,
        logOut,

        //RESET
        reset,
        setResetError,
        resetError,
    }
}

export default useUser

