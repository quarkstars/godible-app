//Used in AppShell to create a ThemeContext and set light and dark mode throughout the app

import { StatusBar, Style } from '@capacitor/status-bar';
import { useState, useEffect } from 'react';


export interface ITheme {
    isDark: boolean,
    setIsDark:  (input: boolean) => void,
}


const useTheme = () => {

    const [isDark, _setIsDark] = useState(false);

    const setIsDark = (input: boolean): void => {
      console.log('IS DARK', input)
      if(input) {
        document.body.classList.add("dark");
      }
      else {
        document.body.classList.remove("dark");
      }
      _setIsDark(input);
      setStatusBar(input);
    };

    //Attempt to set device theme
    const setStatusBar = async (input: boolean) : Promise<boolean> => {
        let style = (input) ? Style.Dark : Style.Light;
        try {
            await StatusBar.setStyle({
                style
            });
        } catch {}
        return input;
    }

    //Check media prefers-color-scheme updates from the user on their device
    useEffect(() => {
        if (!window) return;
        window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
            setStatusBar(status.matches);
          });
    }, [window])
    

    return {
        isDark,
        setIsDark,
    }

}

export default useTheme