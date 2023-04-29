import { UserState } from 'components/UserStateProvider';
import { IExactQuery, IGetObjectOptions } from './../data/types';
import { IList } from 'data/types'
import React, {useRef, useState, useContext} from 'react'
import useEpisodes from './useEpisodes';

const useLists = () => {

    const {user} = useContext(UserState);
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [lists, setLists] = useState<IList[]|undefined>();

    
    const {
        appendEpisodeStrings, 
    } = useEpisodes();

    //Gets all lists by default will be user's lists, otherwise query public lists based on key: value
    //Here is where you can get a list of speeches
    interface IGetListOptions extends IGetObjectOptions {
        isSpeech?: boolean,
        search?: string,
        bookId?: string,
        topicId?: string,
    }
    const getListsOptions = useRef<IGetListOptions|undefined>();
    const [listOptions, setListOptions] = useState <IGetListOptions|undefined>();

  
    //TODO: When getting your list, remember to check if the first list is named, Bookmark, if not then create Bookmark at index 0
    const getLists = async (listIds?: string[], _options?: IGetListOptions, isAppending=false) => {
        setIsLoading(true);
        let updatedLists;
        try {
            let options = _options || getListsOptions.current;
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const params = {
              listIds,
              options,
              limit,
              skip,
            }
            const results:IList[] = await Parse.Cloud.run("getLists", params);

            //Process all episodes on the list to append episode strings
            updatedLists = results.map((list) => {
                const updatedEpisodes = list?.episodes && list?.episodes.map((episode) => {
                    return appendEpisodeStrings(episode);
                });
                list.episodes = updatedEpisodes;
                return list;
            });
              
            if (isAppending && lists) {
                setLists((prev) =>{ return [...prev!, ...updatedLists]});
                setListOptions(prev => {return { ...(prev || {}), ...(options||{})}});
            } else {
                setLists(updatedLists);
                setListOptions(options);
            }
            setError(undefined);
        } catch (error) {
            setError(error);
            return undefined;
        }
        finally {
            setIsLoading(false);
        }
        return updatedLists;
    };




    //Reorders list from one index to another
    const reorderEpisodes = async (from: number, to: number, listIndex = 0) => {
        if (!user?.objectId) return;
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
        if (!user?.objectId) return;
        //Cannot reorder to or from 0 (This is reserved for Bookmark)
        // if (!from || !to) return;
        // if (!lists || !lists?.[0] || lists.length < to) return;
        if (!lists) return;
        // Rearrange the array of lists
        const newList = [...lists].slice(1, lists.length)
        const [removed] = newList.splice(from, 1);
        newList.splice(to, 0, removed);
    
        // Submit each list with new index to the server
        const startIndex = Math.min(from, to);
        const endIndex = Math.max(from, to);
        for (let i = startIndex; i <= endIndex; i++) {
            const list = newList[i];
            if (!list) return;
            const index = i; // Indexes are 0-based
            await postList({ ...list, index });
        }
    
    };

    //Will set a single list for operations like:
    //reordering episodes, creating new list (if objectId is not given) limit of 100, adding episode limit 100
    type IPostListParams = Partial<IList> 

    const postList = async (list: IPostListParams) => {
        setIsLoading(true);
        if (!user?.objectId) return undefined;
        let result;
        try {
            if (!list) return;        
            // Convert episodes to Parse pointers
            let episodes = [] as any[];
            if (list.episodes) {
                episodes = list.episodes.map((episode) => {
                    return {
                    __type: 'Pointer',
                    className: 'Episode',
                    objectId: episode?.objectId,
                    };
                });
            }
            result = await Parse.Cloud.run("postList", {...list, episodes});
            const updatedEpisodes = result?.episodes.map((episode) => {
                return appendEpisodeStrings(episode);
            });
            result.episodes = updatedEpisodes;
            setError(undefined);
        } catch (error) { 
            // Set error state
            setError(error);
            return undefined; 
        } finally {
            // Set loading state
            setIsLoading(false);
        }
        return result;
    }

    //Will Add episode to a list
    const addEpisodeToList = async (listIndex = 0, episodeId: string, isPrepending = false) => {
        if (!user?.objectId) return undefined;
        let listToUpdate = lists?.[listIndex] as any;
        // if (!listToUpdate && listIndex === 0) {
        //     listToUpdate = {
        //         slug: `${user?.objectId}-0-bookmarks}`,
        //         episodes: [],
        //         name: "Bookmarks"
        //     }
        // } 
        if (!listToUpdate) return;
        let isAlreadyOnList = false;
        listToUpdate.episodes.map((episode, index) => {
            if (episode.objectId === episodeId) isAlreadyOnList = true;
        });
        if (isAlreadyOnList) return listToUpdate;
        if (isPrepending) {
            listToUpdate.episodes = [{objectId: episodeId, __type: "Pointer", className: "Episode"}, ...listToUpdate.episodes];
        }
        else {
            listToUpdate.episodes.push({objectId: episodeId, __type: "Pointer", className: "Episode"});
        }
        setIsLoading(true);
        let updatedList: IList|undefined;
        try {
            updatedList = await postList(listToUpdate);
            // await getLists(undefined, getListsOptions.current);
            setError(undefined);
        } catch (error) {
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
        console.log("UPDATED LIST", updatedList)
        return updatedList;
    }

    //Delete episode from list
    const removeEpisodeFromList = async (_listToUpdate: IList, episodeId: string) => {
        if (!user?.objectId) return;
        let listToUpdate = _listToUpdate;
        
        let episodeIndex = -1;
        
        for (let i = 0; i < listToUpdate.episodes.length; i++) {
          if (listToUpdate.episodes[i].objectId === episodeId) {
            episodeIndex = i;
            break;
          }
        }
            
        if (episodeIndex === -1) return;
        listToUpdate.episodes.splice(episodeIndex, 1);
        setIsLoading(true);
        
        try {
        //If the list is the user's update the list on the server
            let result;
            if (listToUpdate.objectId && listToUpdate.userId === user?.objectId) result = await postList(listToUpdate);
            if (result){ 
                if (result.episodes) result.episodes = result.episodes.map((episode) => {
                    return appendEpisodeStrings(episode);
                });
                listToUpdate = result;
            }
            setError(undefined);
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
        return listToUpdate;
      };

    //Will delete a list
    const deleteList = async (listId: string) => {   
        console.log("delete 243") 
        //Cannot delete 0 Bookmarks    
        if (!user?.objectId) return;
        if (!lists) return;

        let listToDelete;
        let deleteIndex = -1;
        
        for (let i = 0; i < lists.length; i++) {
          if (lists[i].objectId === listId) {
            deleteIndex = i;
            break;
          }
        }
        if (deleteIndex < 0) return;
        //Re order the rest of the lists  // Save the array to a variable and remove the list to delete
        const updatedLists = [...lists];
        listToDelete = updatedLists.splice(deleteIndex, 1)[0];
        let deletedList:IList|undefined;
        setIsLoading(true);
        try {
            //TODO: Notify user on specific list information that has been deleted
            deletedList = await Parse.Cloud.run("deleteObject", {className: "List", objectId: listToDelete?.objectId});       
             // Update the index of the remaining lists
            for (let i = deleteIndex; i < updatedLists.length; i++) {
                const index = i;
                await postList({...updatedLists[i], index});
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
        return deletedList;
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
        skip: listOptions?.skip,

    }
}

export default useLists