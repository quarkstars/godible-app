//Used in AppShell to create a UserContext and interact with the logged in User on the server

import { checkmarkCircle } from 'ionicons/icons';
import Parse, { Error } from 'parse';
import React, { SetStateAction, useState } from "react";

// This is also where a non logged in user will store Language Preference, Volume and logically resolve when logging in 
// where existing user language takes precedemce

interface INotice {
    message: string,
    icon: string,
    color: string,
}

export interface IUserState {
    user?: Parse.User,
    isLoading: boolean,
    reroutePath: string,
    setReroutePath: React.Dispatch<SetStateAction<string>>,
    notice?: INotice,
    setNotice: React.Dispatch<SetStateAction<INotice | undefined>>,
    language: string,
    setLanguage: React.Dispatch<SetStateAction<string>>,

    //SIGN UP
    signUpError: any,
    signUp: Function,
}


const useUser = () => {

    //Logged in user
    const [user, setUser] = useState<Parse.User|undefined>();
    console.log(user)

    //lnagueage preference. Should be lowercase
    const [language, setLanguage] = useState<string>("english");

    //When logging in, reroute to a specific path
    const [reroutePath, setReroutePath] = useState<string>('/profile');

    //Setting a notice to the user will create a toast
    const [notice, setNotice] = useState<INotice|undefined>();

    //Loading State, waiting for server response
    const [isLoading, setIsLoading] = useState<any>();

    
    const [signUpError, setSignUpError] = useState<any>();
    // Sign up Function - Returns User or Error
    const signUp = async function (email: string, password: string, first: string, last: string): Promise<any> {
        //TODO: Do not do this is user is already defined...
        // Note that these values come from state variables that we've declared before
        try {
            setIsLoading(true);
            // Since the signUp method returns a Promise, we need to call it using await
            const newUser: Parse.User = await Parse.User.signUp(
                email, 
                password,
                {
                    email: email,
                    firstName: first,
                    lastName: last,
                    langauge: language,
                }
            );
            alert(
                `Success! User ${newUser.getUsername()} was successfully created!`,
            );
            setNotice({
                message: "Account created!",
                icon: checkmarkCircle,
                color: "green",
            });
            setSignUpError(undefined);
            setIsLoading(false);
            setUser (newUser)
            return newUser;
        } catch (error: any) {
            // signUp can fail if any parameter is blank or failed an uniqueness check on the server
            alert(`Error! ${error}`);
            setSignUpError(error);
            setIsLoading(false);
            return error;
        };
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

        //SIGN UP
        signUpError,
        signUp,
    }
}

export default useUser