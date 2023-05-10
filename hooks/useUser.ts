import { IDateMap, IListening, INote, IUser } from 'data/types';
import { IList } from 'data/types';
import { useEffect, useRef } from 'react';
//Used in AppShell to create a UserContext and interact with the logged in User on the server

import { checkmarkCircle } from 'ionicons/icons';
import Parse, { Error } from 'parse';
import React, { SetStateAction, useState } from "react";
import { isPlatform } from '@ionic/react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import useParse from './useParse';
import useLists from './useLists';
import { nextSendTime } from 'utils/nextSendTime';

import {
    SignInWithApple,
    SignInWithAppleResponse,
    SignInWithAppleOptions,
  } from '@capacitor-community/apple-sign-in';

// This is also where a non logged in user will store Language Preference, Volume and logically resolve when logging in 
// where existing user language takes precedemce

interface INotice {
    message: string,
    icon: string,
    color: string,
}

export interface IUserState {
    user: IUser,
    isLoading: boolean,
    reroutePath: string|undefined,
    setReroutePath: React.Dispatch<SetStateAction<string | undefined>>,
    notice?: INotice,
    setNotice: React.Dispatch<SetStateAction<INotice | undefined>>,
    isOnboarding: boolean,
    setIsOnboarding: React.Dispatch<SetStateAction<boolean>>,

    //UPDATE
    updateUser: (update: IUser) => Promise<IUser>,
    setUpdateError: React.Dispatch<any>,
    updateError: any,
    getCurrentUser: Function,


    //SIGN UP
    signUpError: any,
    setSignUpError: React.Dispatch<any>,
    signUp: Function,

    //SIGN IN
    logInError: any,
    setLogInError: React.Dispatch<any>,
    logIn: Function,
    logInWithGoogle: Function,
    logInWithApple: Function,

    //LOG OUT
    logOutError: any,
    setLogOutError: React.Dispatch<any>,
    logOut: Function,

    //RESET
    resetError: any,
    setResetError: React.Dispatch<any>,
    reset: Function,

    getMonth: Function,
    // highlightedDates: any[],
    dateMap: IDateMap,
    getStreak: Function,
    setDateMap: Function,

    
    listReloads: number,
    setListReloads: Function,

    isModalOpen: React.MutableRefObject<boolean>|null;
}


export const isValidEmail = (email: string) => {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const useUser = () => {

    const {
        addParseObjectProperties,
    } = useParse();

    //Logged in user
    const [user, setUser] = useState<IUser>({}); 
    
    
    //language preference. Should be lowercase
    const [language, setLanguage] = useState<string>("english");


    //List Reloads. State that will reload the lists across the site
    const [listReloads, setListReloads] = useState<number>(0);


    //When logging in, reroute to a specific path
    const [reroutePath, setReroutePath] = useState<string|undefined>();

    //Setting a notice to the user will create a toast
    const [notice, setNotice] = useState<INotice|undefined>();

    //Loading State, waiting for server response
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    //Loading State, waiting for server response
    const [isOnboarding, setIsOnboarding] = useState<any>();

    
    //is Modal open, lets the back button
    const isModalOpen = useRef(false)

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
    


    //Get Current User
    const getCurrentUser = async function (): Promise<IUser> {
        setIsLoading(true);
        const currentUser: Parse.User|undefined|null = await Parse.User.current();
        if (currentUser) {
            await currentUser.fetch();
            const currentUserJSON = currentUser.toJSON();
            setUser(currentUserJSON);
            setIsLoading(false);
            return currentUserJSON;
        }
        setIsLoading(false);
        return getResetUser({});
    };

    //Get Current User with Streak
    const getStreak = async function (): Promise<IUser> {
        let currentUser:any;
        try {
            currentUser = await Parse.Cloud.run("getStreak");
        } catch (err) {}
        if (currentUser) {
            const currentUserJSON = currentUser.toJSON();
            setUser(currentUserJSON);
            return currentUserJSON;
        }
        return getResetUser({});
    };

    //Get Current User
    useEffect(() => {
        if (!Parse) return;
        if (user?.objectId) return;
        getCurrentUser();
    }, [Parse]);

    //set onboarding if created within a minute ago
    useEffect(() => {
        if (!user?.objectId) return;
        const createdAt = user.createdAt;
        const createdTime = Math.floor(new Date(createdAt!).getTime());
        if (!createdTime) return;
        if (Date.now()-60000 < createdTime) {
            setIsOnboarding(true);
        }
    }, [user?.objectId]);
    
    

    //Login Function
    const [logInError, setLogInError] = useState<any>();
    const logIn = async function (email: string, password: string): Promise<IUser | Error | undefined> {
        // Note that these values come from state variables that we've declared before
        try {
            setIsLoading(true);
            const loggedInUser: Parse.User = await Parse.User.logIn(email, password);
            // To verify that this is in fact the current user, `current` can be used
            const currentUser: Parse.User<Parse.Attributes>|undefined|null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({message: "Failed to Log In"});
                setIsLoading(false);
                setUser({});
                return;
            }
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setLogInError(undefined);
                // Update state variable holding current user
                const currentUserJSON = currentUser.toJSON();
                setUser(currentUserJSON);
                setIsLoading(false);
                return currentUserJSON;
            }

        } catch (error: any) {
            // Error can be caused by wrong parameters or lack of Internet connection
            setLogInError(error);
            setIsLoading(false);
            return error;
        }
      };
            
      // Function to log into Google
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

            let currentUser = new Parse.User();
            currentUser.set('username', googleUser.email);
            currentUser.set('email', googleUser.email);
            currentUser.set('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            currentUser.set('sendHour', "8");
            currentUser.set('nextSendTime', nextSendTime(8));
            if (googleUser.givenName) currentUser.set('firstName', googleUser.givenName);
            if (googleUser.familyName) currentUser.set('lastName', googleUser.familyName);
            if (googleUser.imageUrl) currentUser.set('imageUrl', googleUser.imageUrl);
            


            //  if a user exists already with the same email, it will not allow a new user
            let idToken = googleUser.authentication.idToken;
            // if (idToken.split(".").length > 1) idToken = idToken.split(".")[0];

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
            const currentUserJSON = currentUser.toJSON();
            setLogInError(undefined);
            setUser(currentUserJSON);
            setIsLoading(false);

            return currentUserJSON;
            

      }; 
    
      // Function to log into Apple sign
      let options: SignInWithAppleOptions = { 
        clientId: 'com.hsa.godible', 
        redirectURI: 'https://app.godible.org/signin', 
        scopes: 'email name',
        state: '12345',
        nonce: 'nonce',
      };
      const logInWithApple = async function () {
        let appleUser:any;
        try {
            appleUser = await SignInWithApple.authorize(options);
            appleUser = appleUser.response;
            console.log("GOT APPLE", appleUser)
        }
        catch (error) {
            setLogInError(error);    
            return error;
        }
        if (!appleUser) {
            setLogInError({message:"Failed to log in with Apple"});      
            return;
        }

        console.log("APPLE USER BEFORE JWT", appleUser)
        let idToken = appleUser.identityToken
        ;
        let user = appleUser.user;
        try {
            if (!user) appleUser = await Parse.Cloud.run('decodeAppleJWT', { identityToken: idToken })
        } catch (err) {
            console.log("Failed to get response from Apple", err);
            setLogInError({message:"Failed to log in with Apple"});  
        }
        console.log("APPLE USER AFTER JWT", appleUser)

        let currentUser = new Parse.User();
        currentUser.set('username', appleUser.email);
        currentUser.set('email', appleUser.email);
        currentUser.set('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        currentUser.set('sendHour', "8");
        currentUser.set('nextSendTime', nextSendTime(8));
        if (appleUser.givenName) currentUser.set('firstName', appleUser.givenName);
        if (appleUser.familyName) currentUser.set('lastName', appleUser.familyName);
        


        //  if a user exists already with the same email, it will not allow a new user

        // if (idToken.split(".").length > 1) idToken = idToken.split(".")[0];

        try {
            setIsLoading(true);
            console.log("APPLE LOGIN WITH", appleUser)
            currentUser = await currentUser.linkWith('apple',
                {authData: {
                    id: appleUser.userId,
                    id_token: idToken,
                }}
            );
        }
        catch (error) {
            setLogInError(error); 
            setIsLoading(false);   
            GoogleAuth.signOut().catch();
            return error;

        }

        if (!currentUser) {
            setLogOutError({message: "Failed to Log In"});
            return;
        }
        setNotice({
            message: "Logged in with Apple",
            icon: checkmarkCircle,
            color: "green",
        });
        const currentUserJSON = currentUser.toJSON();
        setLogInError(undefined);
        setUser(currentUserJSON);
        setIsLoading(false);

        return currentUserJSON;
        

  };

      const [logOutError, setLogOutError] = useState<any>();
      //Log out Function
      const logOut = async function (): Promise<IUser | Error > {
        
        setIsLoading(true);
        //Try to sign out gooogle user if exists
        if (GoogleAuth.signOut) GoogleAuth.signOut().catch();

        // if (SignInWithApple.authorize) GoogleAuth.signOut().catch();

        try {
            await Parse.User.logOut();
            // To verify that current user is now empty, currentAsync can be used
            const currentUser: Parse.User<Parse.Attributes>|undefined|null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({message: "Already Logged out"});
                setIsLoading(false);
                setUser(getResetUser({}));
                return getResetUser({});
            }
            else {
                setNotice({
                    message: "Logged out!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setLogOutError(undefined);
                const currentUserJSON = currentUser.toJSON();
                // Update state variable holding current user
                setUser(prev => getResetUser(prev));
                setIsLoading(false);
                return currentUserJSON;
            }
        } catch (error: any) {
            setIsLoading(false);
            setLogOutError(error);
            return error;
        }
      };
    
    //Get resetSettings
    const getResetUser = (currentUser: IUser): IUser => {
        return {
            language: currentUser.language || "english",
            fontSize: currentUser.fontSize || "normal",
            fontContrast: currentUser.fontContrast || "normal",
            fontStyle: currentUser.language || "sanserif",
        }
    }

    
    const [signUpError, setSignUpError] = useState<any>();
    // Email Sign up Function - Returns User or Error
    const signUp = async function (email: string, password: string, first: string, last: string): Promise<IUser | Error | undefined> {

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
                    language,
                    timeZone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
                    sendHour: "8",
                    nextSendTime: nextSendTime(8),
                },
            )
            if (!newUser) {
                setSignUpError({message: "An issue occured"});
                return getResetUser({});
            } 
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "green",
                });
                setSignUpError(undefined);
                const newUserJSON = newUser.toJSON();
                setIsLoading(false);
                setUser (newUserJSON);
                return newUserJSON;
            }
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

    //Update User
    const [updateError, setUpdateError] = useState<any>();
    const updateUser = async function (updates: IUser): Promise<IUser> {
        let prevUser = user;
        let newUser:IUser = {
            ...prevUser,
            ...updates,
        }
        setUser(newUser);
        //If user is logged in, save updates to the server or reverse them if failed.
        if (!user?.objectId) return newUser;
        try {
            // setIsLoading(true);
            const currentParseUser: Parse.User|undefined|null = await Parse.User.current();
            if (!currentParseUser) throw "No User"
            const updatedParseUser = addParseObjectProperties(currentParseUser, updates);
            await updatedParseUser.save()
            // setIsLoading(false);
            setUpdateError(undefined);
            return newUser;
        } catch (error: any) {
            // setIsLoading(false);
            setUpdateError(error);
            setUser(prevUser);
            return prevUser;
        }
    };


    //Calendar, get month
    const fetchedMonths = useRef<string[]>([]);
    // const [highlightedDates, setHighlightedDates] = useState<any[]>([]);
    const [dateMap, setDateMap] = useState<IDateMap>({});
    const getMonth = async (month: string, clearMonths=false) => {
        if (!user?.objectId) return;
        if (clearMonths) fetchedMonths.current = []
        if (fetchedMonths.current.includes(month) && !clearMonths) return;
        try {
            //Listenings
            let listenings = await Parse.Cloud.run("getListenings", {options: {month, hasValidSession: true}}) as IListening[];     
            // let newHighlightedDates:any[] = [];
            let newDateMap:IDateMap = {};
            listenings.map((listening) => {
                if (!listening.date) return;
                let newPositions;
                if (listening.positions) newPositions = listening.positions.filter((position) => {
                    return position.isValidSession;
                })
                const newListening = {...listenings, positions: newPositions}
                const pastListenings = dateMap[listening.date]?.listenings || [];
                newDateMap[listening.date] = {
                    ...dateMap[listening.date],
                    listenings: [...pastListenings, newListening]
                }
            });
            //Notes (specify the user's notes only)
            const notes = await Parse.Cloud.run("getNotes", {options: {month, sort: "-createdTime", userId: user?.objectId}});     
            
            let pastNotes: INote[]
            notes.map((note) => {   
                if (!note.date) return;
                pastNotes = newDateMap[note.date]?.notes || [];
                newDateMap[note.date] = {
                    ...dateMap[note.date],
                    ...newDateMap[note.date],
                    notes: [note,...pastNotes]
                }
            });
            // setHighlightedDates(prev => [...prev, newHighlightedDates]);
            setDateMap(prev => {return {...prev, ...newDateMap}});
            fetchedMonths.current = [...fetchedMonths.current, month]
            
            // Submit the delete request to the server
        } catch (error) {
            // error can occur in background
            console.error(error);
        } 
    }




    return {
        user,
        isLoading,
        reroutePath,
        setReroutePath,
        notice,
        setNotice,

        //Preferences
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
        logInWithApple,

        //LOG OUT
        logOutError,
        setLogOutError,
        logOut,

        //RESET
        reset,
        setResetError,
        resetError,

        //UPDATE
        updateUser,
        updateError,
        setUpdateError,

        //List
        setListReloads,
        listReloads,

        //CALENDAR
        getMonth,
        dateMap,
        getStreak,
        setDateMap,

        //MODAL CONTROL BACK BUTTON
        isModalOpen,

    }
}

export default useUser

