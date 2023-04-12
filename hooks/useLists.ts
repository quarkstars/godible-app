import { UserState } from 'components/UserStateProvider';
import { IExactQuery, IGetObjectOptions } from './../data/types';
import { IList } from 'data/types'
import React, {useRef, useState, useContext} from 'react'

const useLists = () => {

    const {user} = useContext(UserState);
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [lists, setLists] = useState<IList[]|undefined>();

    //Gets all lists by default will be user's lists, otherwise query public lists based on key: value
    //Here is where you can get a list of speeches
    interface IGetListOptions extends IGetObjectOptions {
        isSpeech?: boolean,
    }
    const getListsOptions = useRef<IGetListOptions|undefined>();

    //TODO: When getting your list, remember to check if the first list is named, Bookmark, if not then create Bookmark at index 0
    const getLists = async (listIds?: string[], _options?: IGetListOptions, isAppending=false) => {
        setIsLoading(true);
        try {
            let options = _options || getListsOptions.current;
            console.log("LIST OPTIONS", _options)
            getListsOptions.current = { ...getListsOptions.current, ...options};
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const params = {
              listIds,
              options,
              limit,
              skip,
            }
            const results:IList[] = await Parse.Cloud.run("getLists", params);

            if (isAppending && lists) {
                setLists((prev) =>{ return [...prev!, ...results]});
            } else {
                setLists(results);
            }
            console.log("LIST ALL", results)
            setError(undefined);
        } catch (error) {
            setError(error);
        }
        finally {
            setIsLoading(false);
        }
    };



    //Reorders list from one index to another
    const reorderEpisodes = async (from: number, to: number, listIndex = 0) => {
        if (!user.objectId) return;
        let list = lists?.[listIndex];
        if (!list) return;
        if (list.episodes.length < 2) return;
      
        const reorderedEpisodes = [...list.episodes];
        const [removedEpisode] = reorderedEpisodes.splice(from, 1);
        reorderedEpisodes.splice(to, 0, removedEpisode);
      
        // Update the index property of each episode
        const newList = {...list, episodes: reorderedEpisodes}

        //TODO: Check if you even need to do this...
        setLists((prev) => {
            let newLists = prev!;
            newLists[listIndex] = newList;
            return newLists;
        })
      
        newList.episodes = reorderedEpisodes;
        await postList(newList);
    };

    // Reorders list from one index to another
    const reorderLists = async (from: number, to: number) => {
        if (!user.objectId) return;
        //Cannot reorder to or from 0 (This is reserved for Bookmark)
        if (!from || !to) return;
        if (!lists || !lists?.[0] || lists.length < to) return;
        console.log("LIST ALL ADDING 1")
    
        // Rearrange the array of lists
        const newList = [...lists];
        const [removed] = newList.splice(from, 1);
        newList.splice(to, 0, removed);
    
        // Submit each list with new index to the server
        const startIndex = Math.min(from, to);
        const endIndex = Math.max(from, to);
        console.log("LIST ALL ADDING 2", startIndex, endIndex)
        for (let i = startIndex; i <= endIndex; i++) {
            const list = newList[i];
            if (!list) return;
            const index = i; // Indexes are 0-based
            console.log("LIST ALL ADDING",  {id: list.objectId, index, name: list.name })
            await postList({ id: list.objectId, index, name: list.name });
        }
    
        // TODO: Update the local state of the lists (unless it is done already)
        // setLists(newList);
    };

    //Will set a single list for operations like:
    //reordering episodes, creating new list (if objectId is not given) limit of 100, adding episode limit 100
    type IPostListParams = Partial<IList> 

    const postList = async (list?: IPostListParams) => {
        setIsLoading(true);
        if (!user.objectId) return;
        try {
            if (!list) return;        
            // Convert episodes to Parse pointers
            let episodes = [] as any[];
            if (list.episodes) {
                episodes = list.episodes.map((episode) => {
                    return {
                    __type: 'Pointer',
                    className: 'Episode',
                    objectId: episode.objectId,
                    };
                });
            }
            await Parse.Cloud.run("postList", {...list, episodes});

            setError(undefined);
        } catch (error) { 
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
    }

    //Will Add episode to a list
    const addEpisodeToList = async (listIndex = 0, episodeId: string) => {
        if (!user.objectId) return;
        let listToUpdate = lists?.[listIndex] as any;
        if (!listToUpdate && listIndex === 0) {
            listToUpdate = {
                slug: `${user.objectId}-0-bookmarks}`,
                episodes: [],
                name: "Bookmarks"
            }
        } 
        if (!listToUpdate) return;
        let isAlreadyOnList = false;
        listToUpdate.episodes.map((episode, index) => {
            if (episode.id === episodeId) isAlreadyOnList = true;
        });
        if (isAlreadyOnList) return;
        listToUpdate.episodes.push({objectId: episodeId, __type: "Pointer", className: "Episode"});
        setIsLoading(true);
        try {
            await postList(listToUpdate);
            await getLists(undefined, getListsOptions.current);
            setError(undefined);
        } catch (error) {
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
    }

    //Delete episode from list
    const removeEpisodeFromList = async (listIndex = 0, episodeId: string) => {
        if (!user.objectId) return;
        
        let listToUpdate = lists?.[listIndex] as any;
        console.log("LIST TO REMOVE EP", lists, listIndex, listToUpdate)
        if (!listToUpdate) return;
        
        let episodeIndex = -1;
        
        for (let i = 0; i < listToUpdate.episodes.length; i++) {
          if (listToUpdate.episodes[i].objectId === episodeId) {
            episodeIndex = i;
            break;
          }
        }
        
        console.log("LIST TO REMOVE EP index", episodeIndex)
        
        if (episodeIndex === -1) return;
        listToUpdate.episodes.splice(episodeIndex, 1);
        setIsLoading(true);
        
        try {
          await postList(listToUpdate);
          await getLists(undefined, getListsOptions.current);
          setError(undefined);
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };

    //Will delete a list
    const deleteList = async (deleteIndex: number) => {    
        //Cannot delete 0 Bookmarks    
        if (!deleteIndex) return;
        if (!user.objectId) return;
        if (!lists || !lists?.[deleteIndex]) return;
        //Re order the rest of the lists  // Save the array to a variable and remove the list to delete
        const updatedLists = [...lists];
        const listToDelete = updatedLists.splice(deleteIndex, 1)[0];

        try {
            //TODO: Notify user on specific list information that has been deleted
            let deletedList = await Parse.Cloud.run("deleteObject", {className: "List", objectId: listToDelete.objectId});       
             // Update the index of the remaining lists
            for (let i = deleteIndex; i < updatedLists.length; i++) {
                const index = i;
                await postList({ id: updatedLists[i].objectId, index, name: updatedLists[i].name });
            }
            // Submit the delete request to the server
            setError(undefined);
        } catch (error) {
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
    }



    return {
        error,
        setError,
        isLoading,
        setIsLoading,

        //For individual pulling
        lists,
        setLists,
        reorderLists,
        reorderEpisodes,
        postList,
        deleteList,
        addEpisodeToList,
        removeEpisodeFromList,

        //Multipurpose
        getLists,
        skip: getListsOptions.current?.skip,

    }
}

export default useLists