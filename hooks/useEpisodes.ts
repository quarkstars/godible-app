import { IExactQuery } from './../data/types';
import { UserState } from 'components/AppShell';
import { text, userDefaultLanguage } from 'data/translations';
import { IEpisode } from 'data/types';
import React, {useContext, useState, useRef} from 'react'


//Construct useful strings based on episode data and append them to the episode


const useEpisodes = () => {
    const {
      language
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [episodes, setEpisodes] = useState<IEpisode[]|undefined>();
    const [episode, setEpisode] = useState<IEpisode[]|undefined>();

    
    const page = useRef<number|undefined>(1);
    // const [isLoadingMore, setIsLoadingMore] = useState<boolean>();
    const maxPages = useRef <number|undefined>();
    const search = useRef <string|undefined>();
    const query = useRef <IExactQuery|undefined>();
    const sortedBy = useRef <string|undefined>();
    
    const appendEpisodeStrings = (episode: IEpisode): IEpisode => {
        const _lang = (language) ? language : userDefaultLanguage;
        const _bookImageUrl = episode?.book?.imageUrl;
        const _authorImageUrl = episode?.book?.authorImageUrl;
        const _bookPath = (episode?.book?.slug) ? "/book/" + episode?.book?.slug : undefined;
        const metaData = episode?.metaData?.[_lang];
        const _metaDataBlocks:string[] = (metaData) ? metaData.split(/\r?\n/) : undefined;
        // const episodePath = "/episode/" + episode?.slug;
        const number =  episode?.number;
        let _bookTitle = episode?.book?.title?.[_lang];
        //If bookTitle exists but not in user's language, use book's default language
        if (!_bookTitle && episode?.book?.title) _bookTitle = episode?.book.title[episode?.book.title.defaultLanguage];
        let _title = `${text["Episode"][_lang]} ${number}`;
        if (episode?.customTitle) _title = episode?.customTitle[_lang];
        let _fullTitle = (_bookTitle) ? _bookTitle + " " + _title : _title;
        if (!_title) _title = text["Episode"][_lang]+ " " + episode?.number;
        const _path = "/episode/" + episode?.slug;

        //Chapter Name
        let _hasChapter = (typeof episode?.chapter === "number")
        let _chapterName = (_hasChapter) ? `${text["Chapter"][_lang]} ${episode?.chapter}` : undefined;
        if (_chapterName && episode?.chapterName) _chapterName = _chapterName + ": " + episode?.chapterName;
        else if (episode?.chapterName) _chapterName = episode?.chapterName[_lang];
        
        if (!_hasChapter && typeof episode?.chapter === "string") {
            _hasChapter = true;
            _chapterName = episode?.chapter
        }

        let _chapterPath = (_hasChapter) ? _bookPath+"?chapter="+episode?.chapter : _bookPath;

        //Text
        const textInLanguage = episode?.text?.[_lang]; 
        const _textBlocks:string[] = (textInLanguage) ? textInLanguage.split(/\r?\n/) : undefined;
        const _quote = episode?.quote?.[_lang]; 
        console.log("QUOTE", episode?.quote)

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
        };
    }
    

    //Gets episodes up to 24 at a time
    const getEpisodes = (search?: string, query?: IExactQuery, sortedBy?: string) => {

    }


    const getTopics = () => {

    }

    const getMoreEpisodes = () => {

    }
    
    
    //get a single episode
    const getEpisode = (episodeId?: string) => {

    }


    return {
        appendEpisodeStrings,
        error,
        setError,
        isLoading,
        setIsLoading,
        episodes,
        getEpisodes,
        episode,
        getEpisode,
    }
}

export default useEpisodes