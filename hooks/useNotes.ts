import { UserState } from 'components/UserStateProvider';
import { IExactQuery, IGetObjectOptions, INoteFeedback } from '../data/types';
import { INote } from 'data/types'
import React, {useRef, useState, useContext} from 'react'
import { toIsoString } from 'utils/toIsoString';
import useEpisodes from './useEpisodes';

const useNotes = () => {

    const {user} = useContext(UserState);
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [notes, setNotes] = useState<INote[]|undefined>();

    //Gets all notes by default will be user's notes, otherwise query public notes based on key: value
    //Here is where you can get a note of speeches
    interface IGetNoteOptions extends IGetObjectOptions {
        episodeId?: string,
        userIdNot?: string,
        flagDifference?: number,
        heartCount?: number,
    }
    const getNotesOptions = useRef<IGetNoteOptions|undefined>();

    
    const {
        appendEpisodeStrings, 
    } = useEpisodes();

    //TODO: When getting your note, remember to check if the first note is named, Bookmark, if not then create Bookmark at index 0
    const getNotes = async (noteIds?: string[], _options?: IGetNoteOptions, isAppending=false) => {
        setIsLoading(true);
        let newNotes:INote[]|undefined;
        try {
            let options = _options || getNotesOptions.current;
            getNotesOptions.current = { ...getNotesOptions.current, ...options};
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const params = {
              noteIds,
              options,
              limit,
              skip,
            }
            const results:INote[] = await Parse.Cloud.run("getNotes", params);

            newNotes = results.map((note: any) => {
                note.episode = appendEpisodeStrings(note.episode);
                return note;
            });
            if (isAppending && newNotes) {
                setNotes((prev) =>{ return [...prev!, ...newNotes!]});
            } else {
                setNotes(newNotes);
            }
            console.log("LIST ALL", results)
            setError(undefined);
        } catch (error) {
            setError(error);
        }
        finally {
            setIsLoading(false);
        }
        return newNotes;
    };


    //Creat or update a note
    const postNote = async (note: INote) => {
        setIsLoading(true);
        if (!user.objectId) return undefined;
        let newNote:INote|undefined;
        let userPointer = (note.user) ? {
            __type: 'Pointer',
            className: '_User',
            objectId: note.user.objectId,
            } : undefined;
        let episodePointer = (note.episode || note.episodeId) ? {
            __type: 'Pointer',
            className: 'Episode',
            objectId: note.episode?.objectId || note.episodeId,
            } : undefined;
        try {
            if (!note) return;    
            
            const date = toIsoString(new Date()).split("T")[0]; // get YYYY-MM-DD
            
            const month = date.slice(0, 7);  

            newNote = await Parse.Cloud.run("postNote", {...note, date, month, user:userPointer, episode:episodePointer});

            setError(undefined);
        } catch (error) { 
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
        return newNote;
    }
    //Creat or update a note
    const postNoteFeedback = async (noteFeedback?: INoteFeedback) => {
        setIsLoading(true);
        if (!user.objectId) return;
        try {
            if (!noteFeedback) return;        

            await Parse.Cloud.run("postNoteFeedback", noteFeedback);

            setError(undefined);
        } catch (error) { 
            // Set error state
            setError(error);
        } finally {
            // Set loading state
            setIsLoading(false);
        }
    }
    

    //Will delete a note
    const deleteNote = async (objectId: string) => {    
        if (!user.objectId) return;
        try {
            setIsLoading(true);
            //TODO: Notify user on specific note information that has been deleted
            let deletedNote = await Parse.Cloud.run("deleteObject", {className: "Note", objectId});       
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
        notes,
        setNotes,
        postNote,
        deleteNote,
        postNoteFeedback,

        //Multipurpose
        getNotes,
        skip: getNotesOptions.current?.skip,

    }
}

export default useNotes