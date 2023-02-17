import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Redirect, Route } from 'react-router'

import NotFoundPage from "components/pages/NotFoundPage";
import { book, bookOutline, bulb, bulbOutline, mic, micOutline, radio, radioOutline, search, searchOutline, square, } from "ionicons/icons";
import { FC } from "react";
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

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
        label: "Home",
        path: "/",
        component: NotFoundPage, //HomePage
        icon: radio,
        iosIcon: radioOutline,
        isNav: true,
        isExact: true,
        isRedirect: true,
    },
    {
        label: "Books",
        path: "/books",
        variable: "slug", //slug
        component: SignUpPage, //BooksPage
        icon: book,
        iosIcon: bookOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Speeches",
        path: "/speeches",
        component: NotFoundPage, //SpeechesPage
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
        component: NotFoundPage, //SearchPage
        icon: search,
        iosIcon: searchOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Inspirations",
        path: "/inspirations", //InspirationsPage
        component: NotFoundPage,
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
        component: NotFoundPage,
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    //TODO: Add Transactions (Billing History)
    //TODO: Add Payments
    //TODO: Add Subscription
    //TODO: Add Notifications
    {
        label: "Playlists",
        path: "/playlists",
        variable: "id", 
        component: NotFoundPage, //PlaylistsPage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Book",
        path: "/book",
        variable: "slug", 
        component: NotFoundPage, //BookPage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Episode",
        path: "/episode",
        variable: "slug",  //Book name slug plus episode number
        component: NotFoundPage, //EpisodePage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    // {
    //     label: "Not Found",
    //     path: "/*", //TODO: Does this work?
    //     component: NotFoundPage, 
    //     isNav: false,
    //     isExact: false,
    //     isRedirect: false,
    // },

]

const Routes = () => {
  return (
    <IonRouterOutlet id="main">
        {
            pages.map((page) => {
            return (
                <Route 
                path={page.variable? page.path+"/:"+page.variable : page.path}
                exact={page.isExact}
                component={page.component}
                key={page.label}
                >
                {page.isRedirect && <Redirect to={page.path} />}
                </Route>
            )
            })
        }    
    </IonRouterOutlet>

  )
}

export default Routes