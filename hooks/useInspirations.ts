import { IExactQuery, IInspiration } from './../data/types';
import { UserState } from 'components/AppShell';
import { text, userDefaultLanguage } from 'data/translations';
import { IEpisode } from 'data/types';
import React, {useContext, useState, useRef} from 'react'


//Construct useful strings based on episode data and append them to the episode


const useInspirations = () => {
    const {
      language
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [inspirations, setInspirations] = useState<IInspiration[]|undefined>();

    
    const page = useRef<number|undefined>(1);
    // const [isLoadingMore, setIsLoadingMore] = useState<boolean>();
    const maxPages = useRef <number|undefined>();
    const search = useRef <string|undefined>();
    const query = useRef <IExactQuery|undefined>();
    const sortedBy = useRef <string|undefined>();
    
    //Gets inspirations, 24 at a time
    const getInspirations = (query?: IExactQuery) => {

    }
    
    //Update an inspiration or add a new (if objectId not included)
    const upsertInspiration = (inspiration?: IInspiration) => {

    }

    //Gets episodes up to 24 at a time
    const deleteInspiration = (inspirationId?: string) => {

    }


    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        inspirations,
        getInspirations,
        upsertInspiration,
    }
}

export default useInspirations