import { IExactQuery } from './../data/types';
import { IList } from 'data/types'
import React, {useState} from 'react'

const useLists = () => {

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [userLists, setUserLists] = useState<IList[]|undefined>();
    const [list, setList] = useState<IList|undefined>();

    //Gets all lists by default will be user's lists, otherwise query public lists based on key: value
    //Here is where you can get a list of speeches
    const getLists = (query?: IExactQuery, includeEpisodes?: boolean) => {

    }

    //Expand the episodes in the list from pointers to full episodes
    //returns the list with episodes
    const getListEpisodes = (listId?: string) => {

    }
    
    //Reorders list from one index to another
    const reorderLists = (from: number, to: number) => {
        
    }

    //Will set a single list for operations like:
    //reordering episodes, creating new list (if objectId is not given) limit of 100, adding episode limit 100
    const upsertList = (list?: IList) => {
        
    }

    //Will delete a list
    const deleteList = (listId?: string) => {
        //Re order the rest of the lists
        
    }

    //returns true if episode is saved by user
    const checkEpisodeSaved = (objectId?: string) => {

    }


    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        userLists,



        //For individual pulling
        list,
        setList,
        reorderLists,
        upsertList,
        deleteList,
        checkEpisodeSaved,

        //Multipurpose
        getLists,
        getListEpisodes,

    }
}

export default useLists