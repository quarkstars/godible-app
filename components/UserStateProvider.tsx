import React, { createContext } from 'react'
import useUser, { IUserState } from 'hooks/useUser';
import { IUser } from 'data/types';

//Setup Contexts
export const UserStateDefault = {
  user: {},
  isLoading: false,
  reroutePath: undefined,
  setReroutePath: () => null,
  notice: undefined,
  setNotice: () => null,
  getCurrentUser: () => null,
  isOnboarding: false,
  setIsOnboarding: () => null,

  //SIGN UP 
  signUpError: undefined,
  setSignUpError: () => null,
  signUp: async () => null,
  
  logInError: undefined,
  setLogInError: () => null,
  logIn: async () => null,
  logInWithGoogle: async () => null,
  logInWithApple: async () => null,

  logOutError: undefined,
  setLogOutError: () => null,
  logOut: async () => null,

  resetError: undefined,
  setResetError: () => null,
  reset: async () => null,

  updateUser: async (update: IUser) => { return update},
  getStreak: async () => null,
  updateError: undefined,
  setUpdateError: () => null,

  getMonth: () => null,
  // highlightedDates: [],
  dateMap: {},
  setDateMap: async () => null,

  listReloads: 0,
  setListReloads: () => null,

  isModalOpen: null,

  router: undefined,
}
export const UserState = createContext<IUserState>(UserStateDefault);

const UserStateProvider = ({children}) => {
    const userState = useUser();

    return (
        <UserState.Provider value={userState}>
            {children}
        </UserState.Provider>
  )
}

export default UserStateProvider