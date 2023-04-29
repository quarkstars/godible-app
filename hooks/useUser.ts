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
            console.log("GOT CURRENT USER NEW", currentUserJSON)
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
        //TODO: Test again
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

            let currentUser = new Parse.User();
            currentUser.set('username', googleUser.email);
            currentUser.set('email', googleUser.email);
            currentUser.set('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            currentUser.set('nextSendTime', nextSendTime(5));
            if (googleUser.givenName) currentUser.set('firstName', googleUser.givenName);
            if (googleUser.familyName) currentUser.set('lastName', googleUser.familyName);
            if (googleUser.imageUrl) currentUser.set('imageUrl', googleUser.imageUrl);
            


            // ;;.;8'urrently if a user exists already with the same email, it will not allow a new user
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
        GoogleAuth.signOut().catch();

        try {
            console.log('start log out)')
            await Parse.User.logOut();
            console.log('end log out)')
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
    
    //TODO: Get resetSettings
    const getResetUser = (currentUser: IUser): IUser => {
        return {
            language: currentUser.language || "english",
            fontSize: currentUser.fontSize || "normal",
            fontContrast: currentUser.fontContrast || "normal",
            fontStyle: currentUser.language || "serif",
        }
    }

    
    const [signUpError, setSignUpError] = useState<any>();
    // Email Sign up Function - Returns User or Error
    const signUp = async function (email: string, password: string, first: string, last: string): Promise<IUser | Error | undefined> {
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
                    language,
                    timeZone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
                    nextSendTime: nextSendTime(5),
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
            const updatedParseUser = addParseObjectProperties(currentParseUser, updates)
            updatedParseUser.save()
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
        console.log("LOCATION GET MONTH", month, clearMonths, user?.objectId, fetchedMonths.current.includes(month) && !clearMonths)
        if (!user?.objectId) return;
        if (clearMonths) fetchedMonths.current = []
        if (fetchedMonths.current.includes(month) && !clearMonths) return;
        try {
            console.log("LOCATION", clearMonths)
            //Listenings
            let listenings = await Parse.Cloud.run("getListenings", {options: {month, hasValidSession: true}}) as IListening[];     
            // let newHighlightedDates:any[] = [];
            console.log("LOCATION listenings", listenings)
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

    //update streak if logging in


    //TODO: Get next episode based on criteria
    //lastEpisode?: IEpisode, //For link and episode number
    //lastListId?: string, //Check what's next on the list and load the whole list or just check the next on in the book exists if not, just start that one over.
    //lastEpisodePercent?: number, //If episode is 92% complete
    //lastEpisodeSeconds?: number, 


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
    }
}

export default useUser

