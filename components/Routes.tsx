import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Redirect, Route } from 'react-router'

import NotFoundPage from "components/pages/NotFoundPage";
import { book, bookOutline, bulb, bulbOutline, cafe, cafeOutline, library, mic, micOutline, radio, radioOutline, search, searchOutline, square, } from "ionicons/icons";
import { FC } from "react";
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import EpisodePage from './pages/EpisodePage';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import SpeechesPage from './pages/SpeechesPage';
import SearchPage from './pages/SearchPage';
import InspirationsPage from './pages/InspirationsPage';
import ProfilePage from './pages/ProfilePage';
import PlaylistPage from './pages/PlaylistPage';
import BookPage from './pages/BookPage';
import SignInResetPage from './pages/SignInResetPage';

interface ILocalLizedLabels {
  japanese?: string,
}

interface IPage {
    label: string,
    path: string,
    component: FC,
    variable?: string,
    icon?: string,
    iosIcon?: string,
    isNav?: boolean,
    isExact?: boolean,
    isRedirect?: boolean,
    localizedLabels?: ILocalLizedLabels,
}


export const pages:IPage[] = [
    {
        label: "Not Found",
        path: "*", 
        component: NotFoundPage, 
        isNav: false,
        isExact: false,
        isRedirect: false,
    },
    {
        label: "Home",
        path: "/",
        component: HomePage, //HomePage
        icon: cafe,
        iosIcon: cafeOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    },
    {
        label: "Books",
        path: "/books",
        component: BooksPage, //BooksPage
        icon: book,
        iosIcon: bookOutline,
        isNav: true,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Speeches",
        path: "/speeches",
        component: SpeechesPage, //SpeechesPage
        icon: mic,
        iosIcon: micOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {   //TODO: Page Path goes to literally search/:term learn to do this right
        label: "Search",
        path: "/search", 
        variable: "query", //query should be 4 letters or more
        component: SearchPage, //SearchPage
        icon: search,
        iosIcon: searchOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Inspirations",
        path: "/inspirations", //InspirationsPage
        component: InspirationsPage,
        icon: bulb,
        iosIcon: bulbOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Profile",
        path: "/profile", //ProfilePage
        variable: "username", //unique alphanumeric username - lowercase!
        component: ProfilePage,
        icon: square,
        isNav: false,
        isExact: true,
        isRedirect: false,
    }, 
    //TODO: Add Transactions (Billing History)
    //TODO: Add Payments
    //TODO: Add Subscription
    //TODO: Add Notifications
    {
        label: "Playlist",
        path: "/playlist",
        variable: "id", 
        component: PlaylistPage, //PlaylistsPage
        icon: square,
        isNav: false,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Book",
        path: "/book",
        variable: "slug", 
        component: BookPage, //BookPage
        icon: square,
        isNav: false,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Episode",
        path: "/episode",
        variable: "slug",  //Book name slug plus episode number
        component: EpisodePage, //EpisodePage
        icon: square,
        isNav: false,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "SignUp",
        path: "/signup",
        component: SignUpPage, 
        isNav: false,
        isExact: true,
        isRedirect: false,
    },
    {
        label: "SignIn",
        path: "/signin",
        component: SignInPage, 
        isNav: false,
        isExact: true,
        isRedirect: false,
    },
    {
        label: "SignInReset",
        path: "/reset",
        component: SignInResetPage, 
        isNav: false,
        isExact: true,
        isRedirect: false,
    },

]

const Routes = () => {
  return (
    <IonRouterOutlet id="main">
        {
            pages.map((page, index) => {
                return (
                    <Route 
                        path={page.path}
                        exact={page.isExact}
                        component={page.isRedirect ? undefined :  page.component}
                        key={index+page.label}
                    >
                        {page.isRedirect && <Redirect to={page.path} />}
                    </Route>
                )
            })
        }    
        {
            pages.map((page, index) => {

                if (page.variable) return (
                    <Route 
                        path={page.path+"/:"+page.variable}
                        // exact={page.isExact}
                        component={page.component}
                        key={index+page.path+"/:"+page.variable}
                    >
                    </Route>
                )
                return <div key={index}></div>
            })
        }    
    </IonRouterOutlet>

  )
}

export default Routes