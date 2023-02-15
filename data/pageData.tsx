import NotFoundPage from "components/pages/NotFoundPage";
import { book, bookOutline, mic, micOutline, radio, radioOutline, search, searchOutline, square, sunny, sunnyOutline, triangle } from "ionicons/icons";
import { FC } from "react";

interface IPage {
    label: string,
    path: string,
    component: FC,
    icon?: string,
    iosIcon?: string,
    isNav?: boolean,
    isExact?: boolean,
    isRedirect?: boolean,
}


export const pages:IPage[] = [
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
        component: NotFoundPage, //BooksPage
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
        path: "/search/:term", //terms should be 4 letters or more
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
        icon: sunny,
        iosIcon: sunnyOutline,
        isNav: true,
        isExact: true,
        isRedirect: false,
    }, 
    {
        label: "Profile",
        path: "/profile/:id", //ProfilePage
        component: NotFoundPage,
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Playlists",
        path: "/playlists/:id",
        component: NotFoundPage, //PlaylistsPage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Book",
        path: "/book/:slug",
        component: NotFoundPage, //BookPage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Episode",
        path: "/episode/:number",
        component: NotFoundPage, //EpisodePage
        icon: square,
        isNav: false,
        isExact: false,
        isRedirect: false,
    }, 
    {
        label: "Not Found",
        path: "/*",
        component: NotFoundPage, 
        isNav: false,
        isExact: false,
        isRedirect: false,
    },

]