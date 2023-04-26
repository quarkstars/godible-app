import { UseIonRouterResult, useIonRouter } from '@ionic/react';
//Used in AppShell to create a PlayerContext and interact with a consistent player while browsing the app

import { IEpisode, IList } from 'data/types';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Pointer } from 'parse';
import { UserState, UserStateDefault } from 'components/UserStateProvider';
import { IUserState } from './useUser';
import { toIsoString } from 'utils/toIsoString';
import useEpisodes from './useEpisodes';

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
        userState: React.MutableRefObject<IUserState>|undefined,
        router: React.MutableRefObject<UseIonRouterResult|undefined>|undefined,
        isMutatingList: boolean,  
        setIsMutatingList: React.Dispatch<React.SetStateAction<boolean>>,
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

    //User needed to save position
    const userState = useRef<IUserState>(UserStateDefault);
    const { user } = userState.current;

    //User needed to save position
    const router = useRef<UseIonRouterResult|undefined>();
    
    const invalidPositionEpisodeIds= useRef<string[]>([]);

    //Time to doublecheck
    const doubleCheckCurrentTime= useRef<number|undefined>();
    const doubleCheckTime = (pastTime: number) => {
        console.log("DOUBLE CHECK", doubleCheckCurrentTime.current, pastTime, isPlaying)
        if (typeof doubleCheckCurrentTime.current !== "number") return;
        if (isPlaying && pastTime === doubleCheckCurrentTime.current) {setIsPlaying(false);}
        else if (!isPlaying && pastTime < doubleCheckCurrentTime.current) {setIsPlaying(true);}
    }

    // boolean to protect from episode page fighting against new list update
    const [isMutatingList, setIsMutatingList] = useState(false);
    //Update audio element everytime the episode list changes, the index, or the userState (which indicates language)
    const initializeAudio = () => {
        const audio = _audio.current;
        if (!audio) return;
        if (!list?.episodes || typeof index !== "number") return;
        const episode = list?.episodes[index] as IEpisode;
        if (!episode) return;

        let audioPath = episode._audioPath;
        if (!audioPath)  {
            if (episode?.isForbidden) {
                setMessage("Become a donor to access this audio");
            }
            else {
                setMessage("Failed to load audio");
            }
            togglePlayPause(false);
            audio.removeAttribute('src');
            audio?.load();
            return;
        }
        if (audioPath === audio.src) return;
        //Found Audio, set it
        audio.src = audioPath;
        //Set the audio to play from the last valid saved position if available and the episode is not completed already
        if (episode.position && !invalidPositionEpisodeIds.current.includes(episode.objectId) && !episode.position.isComplete) {
            audio.currentTime = episode.position.seconds || 0;
        }
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

        //Double check current time just in case set to playing and fails to play
        let checkTimer:NodeJS.Timeout;
        doubleCheckCurrentTime.current = audio.currentTime;
        checkTimer = setTimeout(() => {
            doubleCheckTime(audio.currentTime);
        }, 1500);

        

        // return () => {if (timer) clearTimeout(timer);}
    }
    useEffect(() => {
        // console.log("INITIALIZING AUDIO")
        initializeAudio();
    }, [_audio.current, list?.episodes, index]);
    // useEffect(() => {
    //     console.log("INITIALIZING AUDIO CURRENT", _audio.current)
    // }, [_audio.current]);
    // useEffect(() => {
    //     console.log("INITIALIZING AUDIO LIST", list?.episodes)
    // }, [list?.episodes]);
    // useEffect(() => {
    //     console.log("INITIALIZING AUDIO INDEX", index)
    // }, [index]);


    //Start Audio when audio loads if autoplay is on
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [timeTilNext, setTimeTilNext] = useState<number|undefined>();
    const [currentSeconds, setCurrentSeconds] = useState(0);
    
// console.log("DOUBLE CHECK IS PLAYING", isPlaying)
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
    //The seconds last passed to server
    const savedSeconds = useRef<number>(0);
    //The total time from the server history + accumulated locally (can continue in state offline)
    const listenedSeconds = useRef<number>(0);
    const postListening = async (params) => {
        try {
             const listening = await  Parse.Cloud.run("postListening", params);
             console.log("LISTEINING", listening)
            } catch (err) {
                console.error(err)
            }
    }
    useEffect(() => {

        //save Listening and Position every 10 seconds
        if (user.objectId && duration && !isNaN(duration) && currentSeconds > savedSeconds.current + 10) {
            let episode = list?.episodes[index];
            if (!episode) return;
            let episodePointer:Pointer|undefined;
            episodePointer = {objectId: episode.objectId!, __type: "Pointer", className: "Episode"}
            const date = toIsoString(new Date()).split("T")[0]; // get YYYY-MM-DD
            let progress = currentSeconds/duration;
            let isComplete = progress >= .95;
            let isValidSession = (listenedSeconds.current >= 50) ? true : false;
            if (episode.position?.isValidSession) isValidSession = true;
            const updatedTime = Date.now();
            const listening = {
                date: date,
                month: date.slice(0, 7),
            }
            const position = {
                isComplete, 
                isValidSession,
                seconds: currentSeconds,
                listId: list?.objectId,
                index: index,
                updatedTime,
                episode: episodePointer,
                episodeId: episode.objectId,
                progress,
                // duration,
            }
            listenedSeconds.current += 10;
            savedSeconds.current = currentSeconds;
            postListening({listening, position});
            //Invalidate position of episode when first fetched because the user has listened to another position
            if (!invalidPositionEpisodeIds.current.includes(episode.objectId)) {
                invalidPositionEpisodeIds.current = [...invalidPositionEpisodeIds.current, episode.objectId]
            }
            
        }

        // when you get to the end
        if ((duration && !isNaN(duration)) && duration > 1 && currentSeconds >= duration) {
            togglePlayPause(false);
            if (index+1 < (list?.episodes?.length||0)) {
                setTimeTilNext(5);
                setIsAutoPlay(true);
            }
            
        }
    }, [currentSeconds, duration, user]);



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
        setIsMutatingList(true)
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
        if (router.current) router.current.push(`${list?.episodes?.[index]?._path}`)
        setTimeout(() => setIsMutatingList(false), 500);

    }


    //Certain paths pause audio
    useEffect(() => {
        if (!location || !location.pathname) return;
        if (location.pathname === "/signup" || location.pathname === "/signin") {
            togglePlayPause(false)
        }
    }, [location.pathname]);
    
    


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
        userState,
        isMutatingList,
        setIsMutatingList,
        router,
    }
}

export default usePlayer