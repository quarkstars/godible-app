import { UserState } from './../components/AppShell';
//Used in AppShell to create a PlayerContext and interact with a consistent player while browsing the app

import { IEpisode } from 'data/types';
import React, { useContext, useEffect, useRef, useState } from 'react'

interface IProgressBar {
    value: number,
    max: number,
}

export interface IPlayer {
        audio?: HTMLAudioElement,
        togglePlayPause: Function,
        episodes?: IEpisode[]
        setEpisodes: React.Dispatch<React.SetStateAction<IEpisode[] | undefined>>,
        volume: number,
        setVolume: React.Dispatch<React.SetStateAction<number>>,
        index: number,
        setIndex: React.Dispatch<React.SetStateAction<number>>,
        setCurrentSeconds: React.Dispatch<React.SetStateAction<number>>,
        currentSeconds: number,
        seekTime: Function,
        isSeeking: boolean,
        setIsSeeking: React.Dispatch<React.SetStateAction<boolean>>,
        jump: Function,
        duration?: number,
        setDuration: React.Dispatch<React.SetStateAction<number | undefined>>,
        isPlaying: boolean,
        isVisible: boolean,
        isReady: boolean,  
        setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
        message?: string,
        setMessage: React.Dispatch<React.SetStateAction<string | undefined>>,
        switchEpisode: Function,
}

export const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
}


const usePlayer = ():IPlayer => {
    
    //communicate errors and message ending
    const [message, setMessage] = useState<string|undefined>();

    //Toggle Visibility
    const [isVisible, setIsVisible] = useState<boolean>(true);

    
    const [episodes, setEpisodes] = useState<IEpisode[]|undefined>();
    const [index, setIndex] = useState<number>(0);
    const [audio, setAudio] = useState<HTMLAudioElement|undefined>();  

    const {language,} = useContext(UserState);

    //Update audio element everytime the episode list changes, the index, or the userState (which indicates language)
    useEffect(() => {
        if (!episodes || typeof index !== "number") return setAudio(undefined);
        const episode = episodes[index];

        let audioPath = episode.audioPath?.[language];
        if (!audioPath) audioPath = episode.audioPath?.[episode.audioPath.defaultLanguage];
        if (!audioPath) return setMessage("No audio")

        //Found Audio, set it
        setAudio(new Audio(audioPath));

        //Remove message and make sure player is visible again
        setMessage(undefined);
        setIsVisible(true);

    }, [episodes, index, language]);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    
    //Keep duration updated when available
    const [duration, setDuration] = useState<number|undefined>();
    useEffect(() => {
        if (!audio?.duration) return setDuration(undefined);
        if (audio?.duration) setDuration(audio.duration);
    }, [audio?.duration])
    
    
    //Keep volume updated
    //TODO: Add volume to player controls
    const [volume, setVolume] = useState<number>(.75);
    useEffect(() => {
        if (!audio) return;
        audio.volume = volume;
    }, [volume, audio]);


    // grabs the loaded metadata
    useEffect(() => {
        if (!audio) return;
        const seconds = Math.floor(audio.duration);
        setDuration(seconds);
    }, [audio?.onloadedmetadata, audio?.readyState]);

    const [isReady, setIsReady] = useState(false);
    // Check when ready
    useEffect(() => {
        if (!audio?.readyState) return setIsReady(false);
        setIsReady(true);
    }, [audio?.readyState]);


    //Check every time updating
    //The duration last passed to server
    const savedDuration = useRef<number|undefined>();
    //The total time from the server history + accumulated locally (can continue in state offline)
    const listenedSeconds = useRef<number|undefined>();
    useEffect(() => {

        //TODO: if saved duration is 10 seconds older than current duration, save to server (on server check how many seconds from end and less than 10, consider it complete)

        // when you get to the end
        if ((duration && !isNaN(duration)) && duration > 1 && currentSeconds >= duration) {
            togglePlayPause(false);
            //TODO: Check next episode is available
            //TODO: Trigger message counter
        }
    }, [currentSeconds, duration]);


    const togglePlayPause = (setIsPlay?: boolean) => {
        if (!audio) return;
        if (setIsPlay) return  audio.play();
        if (!isPlaying || setIsPlay === false) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false)
        }
    }


    //Update progress bar every 1 second
    const [ticked, setTicked] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    useEffect(() => {
        //Automatically move value only if playing and the user is not seeking
        if (audio && isPlaying && !isSeeking) {
            setCurrentSeconds(audio.currentTime);
        }
        //Loop every 1 second
        const timer = setTimeout(() => setTicked((prevTicked) => prevTicked + 1), 1000);
        return () => clearTimeout(timer);
    }, [ticked, isPlaying]);


    const seekTime = (seconds) => {
        if (!audio) return;
        if (!duration) return;
        audio.currentTime = seconds;
        // setCurrentSeconds(seconds);
        if (isPlaying) togglePlayPause(true);
    }
    console.log(audio?.currentTime, isPlaying, isSeeking)

    const jump = (seconds: number) => {
        if (!audio) return;
        if ((duration && !isNaN(duration)) && currentSeconds + seconds >= duration) {
            //Jumping to end?
            return seekTime (duration);
        }
        if ((duration && !isNaN(duration))  && currentSeconds + seconds <= 0) {
            //Jumping to start?
            return seekTime (0);
        }
        seekTime(currentSeconds + seconds);
    }


    const switchEpisode = (index: number) => {
        
    }


    //TODO: Next Previous

    return {
        isPlaying,
        duration,
        audio,
        togglePlayPause,
        episodes,
        setEpisodes,
        volume,
        setVolume,
        index,
        setIndex,
        setCurrentSeconds,
        currentSeconds,
        jump,
        seekTime,
        isSeeking,
        setIsSeeking,
        setDuration,
        isVisible, 
        setIsVisible,
        message,
        setMessage,
        switchEpisode,
        isReady,
    }
}

export default usePlayer