import { IExactQuery, INote } from './../data/types';
import { UserState } from 'components/AppShell';
import { text, userDefaultLanguage } from 'data/translations';
import { IEpisode } from 'data/types';
import React, {useContext, useState, useRef} from 'react'


//Construct useful strings based on episode data and append them to the episode


const useNotes = () => {
    const {
      language
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [Notes, setNotes] = useState<INote[]|undefined>();

    
    const page = useRef<number|undefined>(1);
    // const [isLoadingMore, setIsLoadingMore] = useState<boolean>();
    const maxPages = useRef <number|undefined>();
    const search = useRef <string|undefined>();
    const query = useRef <IExactQuery|undefined>();
    const sortedBy = useRef <string|undefined>();
    
    //Gets Notes, 24 at a time
    const getNotes = (query?: IExactQuery) => {

    }
    
    //Update an note or add a new (if objectId not included)
    const upsertNote = (note?: INote) => {

    }

    //Gets episodes up to 24 at a time
    const deleteNote = (noteId?: string) => {

    }

    //returns true if episode is saved by user
    const appendNoteHearts = (Notes?: INote[]) => {

    }



    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        Notes,
        getNotes,
        upsertNote,
    }
}

export default useNotes