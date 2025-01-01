import { IDateMap, IListening, INote, IUser } from 'data/types';
import { IList } from 'data/types';
import { useEffect, useRef } from 'react';
//Used in AppShell to create a UserContext and interact with the logged in User on the server

import { checkmarkCircle, leaf, rose, starSharp, trendingUpOutline } from 'ionicons/icons';
import Parse, { Error } from 'parse';
import React, { SetStateAction, useState } from "react";
import { isPlatform, useIonRouter, UseIonRouterResult, useIonToast } from '@ionic/react';
// TODO: Remove
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import useParse from './useParse';
import useLists from './useLists';
import { nextSendTime } from 'utils/nextSendTime';

import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { SocialLogin } from '@capgo/capacitor-social-login';

// This is also where a non logged in user will store Language Preference, Volume and logically resolve when logging in 
// where existing user language takes precedemce

export interface INotice {
    message: string,
    icon?: string,
    color?: string,
    position?: "top" | "bottom" | "middle",
    duration?: number,
}

export interface IUserState {
    user: IUser,
    isLoading: boolean,
    reroutePath: string | undefined,
    setReroutePath: React.Dispatch<SetStateAction<string | undefined>>,
    notice?: INotice,
    setNotice: React.Dispatch<SetStateAction<INotice | undefined>>,
    isOnboarding: boolean,
    setIsOnboarding: React.Dispatch<SetStateAction<boolean>>,
    isFirstTimeVisitor: boolean,
    setIsFirstTimeVisitor: React.Dispatch<SetStateAction<boolean>>,

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
    postPoint: Function,
    pointNotice: Function,
    setDateMap: Function,


    listReloads: number,
    setListReloads: Function,

    isModalOpen: React.MutableRefObject<boolean> | null;


    router: React.MutableRefObject<UseIonRouterResult | undefined> | undefined,
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
    const [reroutePath, setReroutePath] = useState<string | undefined>();

    //Setting a notice to the user will create a toast
    const [notice, setNotice] = useState<INotice | undefined>();

    // Enable notices
    const [present, dismiss] = useIonToast();
    const presentToast = (notice: INotice) => {
        present({
            message: notice.message,
            icon: notice.icon,
            duration: notice.duration || 5000,
            position: notice.position || "top",
            color: notice.color || "light",
            mode: "ios",
            buttons: [
                {
                    text: '×',
                    role: 'close',
                    handler: () => {
                        dismiss();
                    },
                },
            ]
        });
    };
    useEffect(() => {
        if (notice && presentToast) presentToast(notice)
        else dismiss();
    }, [notice]);


    //Loading State, waiting for server response
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Onboarding state
    const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
    const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState<boolean>(true);
    const [loginType, setLoginType] = useState<"email"|"google"|"apple"|null>(null);

    const router = useRef<UseIonRouterResult | undefined>();


    //is Modal open, lets the back button
    const isModalOpen = useRef(false)


    //Go back if android back button is pressed
    useEffect(() => {
        let backButtonListener;

        const addListenerAsync = async () => {
            backButtonListener = await App.addListener('backButton', (data) => {
                if (isModalOpen && isModalOpen.current) return;
            });
        };

        addListenerAsync();

        return () => {
            // Clean up listener
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, []);



    //Get Current User
    const getCurrentUser = async function (): Promise<IUser> {
        setIsLoading(true);
        try {
            const currentUser: Parse.User | undefined | null = await Parse.User.current();
            if (currentUser) {
                await currentUser.fetch();
                const currentUserJSON = currentUser.toJSON();
                setUser(currentUserJSON);
                setIsLoading(false);
                setIsFirstTimeVisitor(false);
                // Lazy get streak, updates when user opens next
                getStreak();
                return currentUserJSON;
            }
        } catch (err) {
            // Invalid session token, log out the user
            console.log("CURRENT USER ERROR", err)
            await Parse.User.logOut();
        }
        setIsLoading(false);
        return getResetUser({});
    };

    //Get Current User with Streak
    const getStreak = async function (): Promise<IUser> {
        let currentUser: any;
        try {
            currentUser = await Parse.Cloud.run("getStreak");
        } catch (err) { }
        if (currentUser) {
            const currentUserJSON = currentUser.toJSON();
            setUser(currentUserJSON);
            return currentUserJSON;
        }
        return getResetUser({});
    };


    // Update Points
    const postPoint = async function (action: String): Promise<any> {
        if (!user?.objectId) return;
        let result: any;
        try {
            result = await Parse.Cloud.run("postPoint", { action });
        } catch (err) { }
        if (result && user.isGamificationOn) {
            let message = result.message;
            if (result.amount) message += `. +${result.amount} vitality!`;
            const newLevel = (result.isNewLevel) ? result.levelName : null;
            pointNotice(message, result.icon, newLevel);
        };
        return result;
    };

    /**
     * Send a point notice with follow up new level notice if provided
     */
    const pointNotice = (message: string, icon = leaf, newLevel = null) => {
        setNotice({
            message,
            icon,
        });
        if (newLevel) {
            setTimeout(() => {
                setNotice({
                    message: `You have reached ${newLevel} level!`,
                    icon: rose,
                });
            }, 6000);
        }
    }

    //Get Current User
    useEffect(() => {
        if (!Parse) return;
        if (user?.objectId) return setIsLoading(false);
        getCurrentUser();
        postPoint("Check-in");
    }, [Parse]);

    //set onboarding if created within a minute ago
    useEffect(() => {
        if (!user?.objectId) return;
        const createdAt = user.createdAt;
        const createdTime = Math.floor(new Date(createdAt!).getTime());
        if (!createdTime) return;
        if (Date.now() - 60000 < createdTime) {
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
            const currentUser: Parse.User<Parse.Attributes> | undefined | null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({ message: "Failed to Log In" });
                setIsLoading(false);
                setUser({});
                return;
            }
            else {
                postPoint("Check-in");
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
        let googleUser: any;
        let currentUser: any;
        try {
            await SocialLogin.initialize({
                google: {
                    webClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    // iosClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_IOS, // not sure if this is needed (in cap go shows)
                },

            });
            const response = await SocialLogin.login({
                provider: 'google',
                options: {
                    // scopes: ['email', 'profile'],
                    // grantOfflineAccess: true,
                    // nonce: 'nonce',
                    // state: 12345
                },
            })
            googleUser = response.result;
            console.log("GOOGLE USER", googleUser)
            currentUser = new Parse.User()
        }
        catch (error) {
            setLogInError(error);
            return error;
        }
        if (!googleUser) {
            setLogInError({ message: "Failed to log in with Google" });
            return;
        }

        currentUser.set('username', googleUser.profile.email);
        currentUser.set('email', googleUser.profile.email);
        currentUser.set('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        currentUser.set('sendHour', "8");
        currentUser.set('nextSendTime', nextSendTime(8));
        if (googleUser.profile.givenName) currentUser.set('firstName', googleUser.profile.givenName);
        if (googleUser.profile.familyName) currentUser.set('lastName', googleUser.profile.familyName);
        if (googleUser.profile.imageUrl) currentUser.set('imageUrl', googleUser.profile.imageUrl);



        //  if a user exists already with the same email, it will not allow a new user
        let idToken = googleUser.idToken;

        try {
            setIsLoading(true);
            currentUser = await currentUser.linkWith('google', {
                authData: {
                    id: googleUser.profile.id,
                    id_token: idToken,
                }
            });
        }
        catch (error) {
            setLogInError(error);
            setIsLoading(false);
            // TODO: Check this logic
            SocialLogin.logout({ provider: 'google' });
            return error;

        }

        if (!currentUser) {
            setLogOutError({ message: "Failed to Log In" });
            // TODO: Check this logic
            SocialLogin.logout({ provider: 'google' });
            return;
        }
        // setNotice({
        //     message: "Logged in with Google",
        //     icon: checkmarkCircle,
        //     color: "green",
        // });
        postPoint("Check-in");
        const currentUserJSON = currentUser.toJSON();
        setLogInError(undefined);
        setUser(currentUserJSON);
        setIsLoading(false);

        return currentUserJSON;


    };

    const logInWithApple = async function () {
        let appleUser: any;
        let currentUser: any;
        try {
            await SocialLogin.initialize({
                apple: {
                    clientId: 'com.hsa.godible',
                    redirectUrl: `https://${process.env.APP_DOMAIN}/signin`,
                },
            });
            const response = await SocialLogin.login({
                provider: 'apple',
                options: {
                        scopes: ['email', 'name'],
                    }
                });
                appleUser = response.result;
                console.log("APPLE USER", appleUser)
            currentUser = new Parse.User();
        }
        catch (error) {
            setLogInError(error);
            return error;
        }
        if (!appleUser) {
            setLogInError({ message: "Failed to log in with Apple" });
            return;
        }

        let idToken = appleUser.idToken;
        let user = appleUser.profile.user;

        
        if (appleUser.profile.givenName) currentUser.set('firstName', appleUser.profile.givenName);
        if (appleUser.profile.familyName) currentUser.set('lastName', appleUser.profile.familyName);
        try {
            if (!user) appleUser.profile = await Parse.Cloud.run('decodeAppleJWT', { identityToken: idToken });
            if (!appleUser.profile.user) appleUser.profile.user = appleUser.profile.sub //.split('.')[1];
        } catch (err) {
            console.log("Failed to get response from Apple", err);
            setLogInError({ message: "Failed to log in with Apple" });
        }

        currentUser.set('username', appleUser.profile.email);
        currentUser.set('email', appleUser.profile.email);

        currentUser.set('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        currentUser.set('sendHour', "8");
        currentUser.set('nextSendTime', nextSendTime(8));

        try {
            setIsLoading(true);
            currentUser = await currentUser.linkWith('apple',
                {
                    authData: {
                        clientId: 'com.hsa.godible',
                        id: appleUser.profile.user,
                        token: idToken,
                    }
                }
            );
        }
        catch (error) {
            setLogInError(error);
            setIsLoading(false);
            SocialLogin.logout({ provider: 'apple' });
            return error;

        }

        if (!currentUser) {
            setLogOutError({ message: "Failed to Log In" });
            return;
        }
        postPoint("Check-in");
        const currentUserJSON = currentUser.toJSON();
        setLogInError(undefined);
        setUser(currentUserJSON);
        setIsLoading(false);

        return currentUserJSON;


    };

    const [logOutError, setLogOutError] = useState<any>();
    /**
     * Log out of Socials and Parse
     */
    const logOut = async function (): Promise<IUser | Error> {

        setIsLoading(true);

        //Try to revoke tokens on social logins
        const authData = user.authData;
        if (authData?.google) {
            await SocialLogin.logout({ provider: "google" })
        }
        if (authData?.apple) {
            await SocialLogin.logout({ provider: "apple" })
        }

        // Actual log out from parse user
        try {
            await Parse.User.logOut();
            // To verify that current user is now empty, currentAsync can be used
            const currentUser: Parse.User<Parse.Attributes> | undefined | null = await Parse.User.current();
            if (!currentUser) {
                setLogOutError({ message: "Already Logged out" });
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
            const newUser: Parse.User<Parse.Attributes> | undefined = await Parse.User.signUp(
                email,
                password,
                {
                    email: email,
                    firstName: first,
                    lastName: last,
                    language,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    sendHour: "8",
                    nextSendTime: nextSendTime(8),
                    isGamificationOn: true,
                },
            )
            if (!newUser) {
                setSignUpError({ message: "An issue occured" });
                return getResetUser({});
            }
            else {
                setNotice({
                    message: "Account created!",
                    icon: checkmarkCircle,
                    color: "light",
                });
                setSignUpError(undefined);
                const newUserJSON = newUser.toJSON();
                setIsLoading(false);
                setUser(newUserJSON);
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
        let newUser: IUser = {
            ...prevUser,
            ...updates,
        }
        setUser(newUser);
        //If user is logged in, save updates to the server or reverse them if failed.
        if (!user?.objectId) return newUser;
        try {
            // setIsLoading(true);
            const currentParseUser: Parse.User | undefined | null = await Parse.User.current();
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
    const getMonth = async (month: string, clearMonths = false) => {
        if (!user?.objectId) return;
        if (clearMonths) fetchedMonths.current = []
        if (fetchedMonths.current.includes(month) && !clearMonths) return;
        try {
            //Listenings
            let listenings = await Parse.Cloud.run("getListenings", { options: { month, hasValidSession: true } }) as IListening[];
            // let newHighlightedDates:any[] = [];
            let newDateMap: IDateMap = {};
            listenings.map((listening) => {
                if (!listening.date) return;
                let newPositions;
                if (listening.positions) newPositions = listening.positions.filter((position) => {
                    return position.isValidSession;
                })
                const newListening = { ...listenings, positions: newPositions }
                const pastListenings = dateMap[listening.date]?.listenings || [];
                newDateMap[listening.date] = {
                    ...dateMap[listening.date],
                    listenings: [...pastListenings, newListening]
                }
            });
            //Notes (specify the user's notes only)
            const notes = await Parse.Cloud.run("getNotes", { options: { month, sort: "-createdTime", userId: user?.objectId } });

            let pastNotes: INote[]
            notes.map((note) => {
                if (!note.date) return;
                pastNotes = newDateMap[note.date]?.notes || [];
                newDateMap[note.date] = {
                    ...dateMap[note.date],
                    ...newDateMap[note.date],
                    notes: [note, ...pastNotes]
                }
            });
            // setHighlightedDates(prev => [...prev, newHighlightedDates]);
            setDateMap(prev => { return { ...prev, ...newDateMap } });
            fetchedMonths.current = [...fetchedMonths.current, month]

            // Submit the delete request to the server
        } catch (error) {
            // error can occur in background
            console.error(error);
        }
    }



    // PUSH NOTIFICATIONS
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const [notificationData, setNotificationData] = useState<any>(null);
    useEffect(() => {
        if (!user?.objectId || isPlatform("capacitor") === false || !user?.isPushOn) return;
        const addListeners = async () => {
            await PushNotifications.addListener('registration', token => {
                // Create a new Parse Installation for this device
                const parseInstallation = new Parse.Installation();
                // Use the @capacitor/core to determine the platform
                const deviceType = isPlatform('ios') ? 'ios' : 'android';

                // JavaScript built-in functions to get the locale and timezone
                const localeIdentifier = window.navigator.language;
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Set fields
                let parseUser = Parse.User.current();

                const acl = new Parse.ACL(parseUser); // This will set the ACL to be readable and writable by this user only
                parseInstallation.setACL(acl);
                parseInstallation.set("GCMSenderId", "69348194563");
                parseInstallation.set("deviceToken", token.value);
                parseInstallation.set("localeIdentifier", localeIdentifier);
                parseInstallation.set("appIdentifier", "com.godible.app");
                parseInstallation.set("appName", "Godible");
                parseInstallation.set("deviceType", deviceType);
                parseInstallation.set("pushType", deviceType === 'ios' ? 'apns' : 'gcm');
                parseInstallation.set("timeZone", timeZone);
                parseInstallation.set("userId", user.objectId);
                parseInstallation.set("channels", ["Reminder", "Broadcast"]);


                parseInstallation.save().then(
                    (installation) => {
                        console.log('Installation saved to Parse');
                    },
                    (error) => {
                        console.log('Error saving installation: ', error);
                    }
                );
            });

            await PushNotifications.addListener('registrationError', err => {
                console.error('Registration error: ', err.error);
            });

            await PushNotifications.addListener('pushNotificationReceived', notification => {
                // console.log('Push notification received: ', notification);
            });

            await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                // Check if the notification's data contains a slug
                if (notification.notification.data && notification.notification.data.slug) {
                    const slug = notification.notification.data.slug;
                    // Navigate to the route using the slug
                    setNotificationData(notification.notification.data);

                }
            });
        }

        const checkPermissions = async () => {
            let permStatus = await PushNotifications.checkPermissions();
            setNotificationsEnabled(permStatus.receive === 'granted');
        }


        const enableNotifications = async () => {
            if (notificationsEnabled) return;
            let permStatus = await PushNotifications.requestPermissions();

            if (permStatus.receive === 'granted') {
                setNotificationsEnabled(true);
                await PushNotifications.register();// Create Reminder channel
                await PushNotifications.createChannel({
                    id: 'Reminder',
                    name: 'Reminder Notifications',
                    description: 'Daily Reminder Notifications',
                    importance: 5, // 5 is the highest importance, shows everywhere, makes noise and peeks
                    visibility: 1, // 1 is public (shows everywhere)
                    sound: 'default',
                    lights: true,
                    vibration: true,
                });

                // Create Broadcast channel
                await PushNotifications.createChannel({
                    id: 'Broadcast',
                    name: 'Broadcast Notifications',
                    description: 'Special Broadcast Notifications',
                    importance: 2, // 2 is low importance, shows everywhere but is not intrusive
                    visibility: 1,
                    sound: 'default',
                    lights: true,
                    vibration: false,
                });

            }
        }
        addListeners();

        if (user?.isPushOn) {
            enableNotifications();
        } else {
            checkPermissions();
        }
        return () => {
            // On component unmount, remove all listeners
            PushNotifications.removeAllListeners();
        };
    }, [user?.isPushOn]);

    // Handling the navigation
    useEffect(() => {
        if (router.current && notificationData && notificationData.slug) {
            if (!router.current?.push) return;

            router.current.push(`/episode/${notificationData.slug}`);
            setNotificationData(null); // Clear the notification data
        }
    }, [router.current, notificationData]); // This effect will run whenever either `router` or `notificationData` changes


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
        isFirstTimeVisitor,
        setIsFirstTimeVisitor,

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

        // POINTS
        postPoint,
        pointNotice,

        //MODAL CONTROL BACK BUTTON
        isModalOpen,

        router,

    }
}

export default useUser

