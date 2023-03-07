import { useIonRouter } from '@ionic/react';
import { UserState } from './../components/AppShell';
//Used in AppShell to create a PlayerContext and interact with a consistent player while browsing the app

import { IEpisode, IList } from 'data/types';
import React, { useContext, useEffect, useRef, useState } from 'react'

interface IProgressBar {
    value: number,
    max: number,
}

export interface IPlayer {
        audio?: HTMLAudioElement,
        togglePlayPause: Function,
        list?: IList
        setList: React.Dispatch<React.SetStateAction<IList | undefined>>,
        volume: number,
        setVolume: React.Dispatch<React.SetStateAction<number>>,
        index: number,
        setIndex: React.Dispatch<React.SetStateAction<number>>,
        setCurrentSeconds: React.Dispatch<React.SetStateAction<number>>,
        setTimeTilNext: React.Dispatch<React.SetStateAction<number | undefined>>,
        timeTilNext?: number,
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
        setIsAutoPlay: React.Dispatch<React.SetStateAction<boolean>>,
        switchEpisode: Function,
        rewind: Function,
        next: Function,
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


    const [list, setList] = useState<IList|undefined>();
    const [index, setIndex] = useState<number>(0);
    const _audio = useRef(new Audio()) 
    const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

    const {language,} = useContext(UserState);

    //Update audio element everytime the episode list changes, the index, or the userState (which indicates language)
    useEffect(() => {
        const audio = _audio.current;
        if (!audio) return;
        if (!list?.episodes || typeof index !== "number") return;
        const episode = list?.episodes[index];
        if (!episode) return;

        let audioPath = episode.audioPath?.[language];
        if (!audioPath) audioPath = episode.audioPath?.[episode.audioPath.defaultLanguage];
        if (!audioPath)  {
            setMessage("Become a donor to access this audio");
            togglePlayPause(false);
            audio.removeAttribute('src');
            audio?.load();
            return;
        }
        if (audioPath === audio.src) return;
        //Found Audio, set it
        audio.src = audioPath;
        audio?.load();
        let timer:NodeJS.Timeout;
        if (isPlaying || isAutoPlay) timer = setTimeout(() => {
            setIsPlaying(true);
            audio.play();
        }, 500);
        setIsAutoPlay(false);

        //Remove message and make sure player is visible again
        setMessage(undefined);
        setIsVisible(true);

        return () => {if (timer) clearTimeout(timer);}

    }, [_audio.current, list?.episodes, index, language]);
    //Start Audio when audio loads if autoplay is on


    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [timeTilNext, setTimeTilNext] = useState<number|undefined>();
    const [currentSeconds, setCurrentSeconds] = useState(0);
    
    //Keep duration updated when available
    const [duration, setDuration] = useState<number|undefined>();
    useEffect(() => {
        const audio = _audio.current;
        if (!audio?.duration) return setDuration(undefined);
        if (audio?.duration) setDuration(audio.duration);
    }, [_audio.current?.duration]);
    
    
    //Keep volume updated
    const [volume, setVolume] = useState<number>(.75);
    useEffect(() => {
        const audio = _audio.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume]);


    // grabs the loaded metadata
    useEffect(() => {
        const audio = _audio.current;
        if (!audio) return;
        const seconds = Math.floor(audio.duration);
        setDuration(seconds);
    }, [_audio.current?.onloadedmetadata, _audio.current?.readyState]);

    const [isReady, setIsReady] = useState(false);
    // Check when ready
    useEffect(() => {
        const audio = _audio.current;
        if (!audio?.readyState) {
            if (audio) {
                audio.preload = "metadata";
                audio.load();
            }
            return setIsReady(false);
        }
        if (audio.readyState < 3) {
            if (isReady) setIsReady(false);
            return;
        }
        if (!isReady) setIsReady(true);
    }, [_audio, _audio.current?.readyState, currentSeconds]);

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
            if (index+1 < (list?.episodes?.length||0)) {
                setTimeTilNext(5);
                setIsAutoPlay(true);
            }
            
        }
    }, [currentSeconds, duration]);



    const togglePlayPause = (setIsPlay?: boolean) => {
        const audio = _audio.current;
        if (!audio || !audio.src) return;
        if (setIsPlay) return audio.play();
        if (isPlaying || setIsPlay === false) {
            audio.pause();
            setIsPlaying(false)
        } else {
            audio.play();
            setIsPlaying(true);
        }
    }

    //Update progress bar every 1 second
    const [ticked, setTicked] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    useEffect(() => {
        const audio = _audio.current;
        //Automatically move value only if playing and the user is not seeking
        if (audio && isPlaying && !isSeeking) {
            setCurrentSeconds(audio.currentTime);
        }
        //Handle end of episode
        if (typeof timeTilNext === "number") {
            if (timeTilNext > 0) {
                setMessage(`Continuing (${timeTilNext})`);
                setTimeTilNext(prev => prev! - 1);
            }
            else {
                next();
            }
        }

        //Loop every 1 second
        const timer = setTimeout(() => {
            if (isPlaying || typeof timeTilNext === "number") setTicked((prevTicked) => prevTicked + 1)
        }, 1000);
        return () => clearTimeout(timer);
    }, [ticked, isPlaying]);


    const seekTime = (seconds) => {
        const audio = _audio.current;
        if (!audio) return;
        if (!duration) return;
        audio.currentTime = seconds;
        setCurrentSeconds(seconds);
        if (isPlaying) togglePlayPause(true);
    }

    const jump = (seconds: number) => {
        const audio = _audio.current;
        if (!audio) return;
        if ((duration && !isNaN(duration)) && currentSeconds + seconds >= duration) {
            //Jumping to end?
            return seekTime (duration);
        }
        if ((duration && !isNaN(duration)) && currentSeconds + seconds <= 0) {
            //Jumping to start?
            return seekTime (0);
        }
        seekTime(currentSeconds + seconds);
    }


    const rewind = () => {
        if (currentSeconds < 10 && index > 0) {
            switchEpisode(index-1)
        }
        seekTime(0);
    }

    const next = () => {
        const isEnding = duration && currentSeconds >= duration -10;
        if (isEnding || index+1 < (list?.episodes?.length||0)) {
            setMessage(undefined);
            setTimeTilNext(undefined);
            switchEpisode(index+1);
            return;
        }
        if (duration && !isNaN(duration)) seekTime(duration);
    }

    const switchEpisode = (index: number) => {
        const audio = _audio.current;
        //Check conditions for next audio autoplay
        const isComplete = duration && currentSeconds >= duration;
        const wasPlaying = isPlaying;
        if (wasPlaying || isComplete) {
            setIsAutoPlay(true);
        }
        //Cancel current audio
        audio?.pause();
        //Switch
        setIndex(index);
        setCurrentSeconds(0);
    }


    //Certain paths pause audio
    useEffect(() => {
        if (!location || !location.pathname) return;
        if (location.pathname === "/signup" || location.pathname === "/signin") {
            togglePlayPause(false)
        }
    }, [location.pathname])
    


    return {
        isPlaying,
        duration,
        audio: _audio.current,
        togglePlayPause,
        list,
        setList,
        setIsAutoPlay,
        volume,
        setVolume,
        setTimeTilNext,
        timeTilNext,
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
        rewind,
        next,
    }
}

export default usePlayer