import { UserState } from 'components/UserStateProvider';
import { IExactQuery, ILangString } from './../data/types';
import { text, userDefaultLanguage } from 'data/translations';
import { IEpisode } from 'data/types';
import React, {useContext, useState, useRef, useEffect} from 'react'
import { resolveLangString } from 'utils/resolveLangString';
import { Player } from 'components/AppShell';


//Construct useful strings based on episode data and append them to the episode


const useEpisodes = () => {
    const {
        user,
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [episodes, setEpisodes] = useState<IEpisode[]|undefined>();

    
  const player = useContext(Player);

    interface IGetEpisodeOptions {
        episodeId?: string,
        limit?: number,
        skip?: number
        sort?: string, //Must be preceeded by either - or + (descending or ascending)
        bookIds?: string[],
        topicIds?: string[],
        hasSubscription?: boolean,
        search?: string,
        include?: string[],
        exclude?: string[],
        slug?: string,
        number?: number,
        token?:string,
    }

    const [episodeOptions, setEpisodeOptions] = useState <IGetEpisodeOptions|undefined>();
    useEffect(() => {
      if(episodeOptions) console.log("FETCH WHAT")
      if (!episodeOptions) console.log("FETCH THE FUCK?")
    }, [episodeOptions])
    


    const getEpisodes = async (episodeIds?: string[], _options?: IGetEpisodeOptions, isAppending = false, max = -1) => {
        setIsLoading(true);
        try {
            let options = _options || episodeOptions ;
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const displayCount = limit + (skip*limit);
            if (max > 0 && displayCount >= max) return setIsLoading(false);
            console.log("FETCH with fetch more NOW: ", options?.skip, options?.limit)
            const results = await Parse.Cloud.run("getEpisodes", {episodeIds, options});

            let newEpisodes = results.map((episode: any) => {
                    // const jsonEpisode = episode.toJSON();
                    return appendEpisodeStrings(episode);
                });
            if (isAppending && episodes) {        

                setEpisodes(prevEpisodes => [...prevEpisodes!, ...newEpisodes]);
                setEpisodeOptions(prev => {return { ...(prev || {}), ...(options||{})}});
            } else {
                setEpisodes(newEpisodes);
                setEpisodeOptions(options);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    
    

    
    const appendEpisodeStrings = (episode: IEpisode): IEpisode => {
        const _lang = (user?.language) ? user?.language : userDefaultLanguage;
        const _bookImageUrl = episode?.book?.thumbUrl;
        const _authorImageUrl = episode?.book?.authorImageUrl;
        const _bookPath = (episode?.book?.slug) ? "/book/" + episode?.book?.slug : undefined;
        const metaData = resolveLangString(episode?.metaData, _lang);
        const _metaDataBlocks:string[]|undefined = (metaData) ? metaData.split("\\n") : undefined;
        // const episodePath = "/episode/" + episode?.slug;
        const number =  episode?.number;
        let _bookTitle = resolveLangString(episode?.book?.title, _lang)
        //If bookTitle exists but not in user's language, use book's default language
        if (!_bookTitle && episode?.book?.title) _bookTitle = episode?.book.title[episode?.book.title.defaultLanguage];
        let _title = `${text["Episode"][_lang]} ${number}`;
        if (episode?.customTitle?.[_lang] && episode?.customTitle?.[_lang].length > 0) _title = episode?.customTitle[_lang];
        let _fullTitle = (_bookTitle) ? `${_bookTitle} ${_title}` : _title;
        if (!_title) _title = text["Episode"][_lang]+ " " + episode?.number;
        const _path = "/episode/" + episode?.slug;

        //Chapter Name
        let _hasChapter = (typeof episode?.chapterNumber === "number")
        let _chapterName = "";
        // let _chapterName = (_hasChapter) ? `${text["Chapter"][_lang]} ${episode?.chapterNumber}` : undefined;
        // if (_chapterName && episode?.chapterName) _chapterName = _chapterName + ": " + episode?.chapterName;
        // else if (episode?.chapterName) _chapterName = episode?.chapterName[_lang];
        
        if (!_hasChapter && typeof episode?.chapterNumber === "string") {
            _hasChapter = true;
            _chapterName = episode?.chapterNumber
        }
        //TODO: Find a way to group chapters because chapter number is often too numerous...eh or maybe who cares?
        // let _chapterGroup = episode?.chapterNumber;
        // if (episode?.chapterName?.english && episode?.chapterName?.english?.length > 0) _chapterGroup = resolveLangString(episode?.chapterName, _lang)
        let _chapterPath = (_hasChapter) ? _bookPath+"?chapter="+episode?.chapterNumber : _bookPath;

        //Text
        const textInLanguage = resolveLangString(episode?.text, _lang); 
        const _textBlocks:string[] = (textInLanguage) ? textInLanguage.split("\\n") : [];
        // console.log("EPISODE BLOCKS ", textInLanguage, textInLanguage.split("\\n"), "TEST\nTEST".split(/\r?\n/))
        const _quote = resolveLangString(episode?.quote, _lang); 
        const _audioPath = resolveLangString(episode?.audioPath, _lang);
        //console.log('getEpisodes', getEpisodes())

        

        return {
            ...episode,
            _lang,
            _bookImageUrl,
            _bookPath,
            _bookTitle,
            _path,
            _title,
            _fullTitle,
            _hasChapter,
            _chapterName,
            _chapterPath,
            _textBlocks,
            _authorImageUrl,
            _metaDataBlocks,
            _quote,
            _audioPath,
        };
    }
    
    //When the user changes their language, if episodes exists, redo the episode setrings
    useEffect(() => {
        if (!user.language) return;
        if (episodes) {
            setEpisodes((prevEpisodes) => {
                return prevEpisodes?.map((episode: any) => {
                    return appendEpisodeStrings(episode);
                })
            });
        }
        //Update the list already loaded in the player
        if (!player.list) return
        // player.setList((prevList) => {
        //     let newEpisodes = prevList!.episodes.map((episode: any) => {
        //         return appendEpisodeStrings(episode);
        //     })
        //     return {...prevList, episodes: newEpisodes}
        // });
      }, [user.language]);


    

    return {
        appendEpisodeStrings,
        error,
        setError,
        isLoading,
        setIsLoading,
        episodes,
        getEpisodes,
        setEpisodes,
        skip: episodeOptions?.skip
    }
}

export default useEpisodes