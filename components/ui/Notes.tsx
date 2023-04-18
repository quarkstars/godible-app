import React, {useEffect, useState, useContext, useMemo} from 'react'
import Note from './Note'
import { IonButton, IonChip, IonIcon, IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { add, arrowForward, calendar, checkmarkCircle, chevronDown, chevronUp, closeCircle, closeCircleOutline, send, trash } from 'ionicons/icons'
import TextDivider from './TextDivider'
import { IEpisode, INote } from 'data/types'
import useNotes from 'hooks/useNotes'
import { UserState } from 'components/UserStateProvider'
import NoteInput from './NoteInput'

interface INotesProps {
    episode?: IEpisode;
    isTitleHidden?: boolean;
    isClickToSave?: boolean;
    isPublicCountHidden?: boolean;
    isShowMore?: boolean;
}
const Notes = (props: INotesProps) => {

    const {user} = useContext(UserState);

    const {
        episode, 
        isTitleHidden,
        isClickToSave,
        isPublicCountHidden,
        isShowMore,
    } = props;

  //Public Notes
    const {
        error: noteError,
        isLoading: isNoteLoading,
        notes,
        setNotes,
        postNoteFeedback,
        getNotes,
        skip: noteSkip,
    } = useNotes();
    //Notes
    const {
        error: userNoteError,
        isLoading: isUserNoteLoading,
        notes: userNotes,
        setNotes: setUserNotes,
        postNote: postUserNote,
        deleteNote: deleteUserNote,
        getNotes: getUserNotes,
        skip: noteUserSkip,
    } = useNotes();

    useEffect(() => {
        if (!episode)  {
            setNotes(undefined);
            setUserNotes(undefined);
            return;
        }
        getNotes(undefined, { sort: "+heartCount", userIdNot: user.objectId, episodeId: episode?.objectId, flagDifference: 2,  limit: 30 });
        if (!user.objectId)  {
            setUserNotes(undefined);
            return;
        }
        getUserNotes(undefined, { sort: "-createdTime", episodeId: episode?.objectId, limit: 30, userId: user.objectId });
    }, [user?.objectId, episode]);
    console.log("NOTES PUBLIC", notes)

    const [isCreatingNewNote, setIsCreatingNewNote] = useState<boolean>(true);
    const [editNoteIndex, setEditNoteIndex] = useState<number|undefined>();
    const [showingUserNotes, setShowingUserNotes] = useState<boolean>(true);
    const [showingNotes, setShowingNotes] = useState<boolean>(false);
    useEffect(() => {
      if (!isUserNoteLoading && userNotes && userNotes.length > 1) setIsCreatingNewNote(false);
    }, [isUserNoteLoading, userNotes]);
    
    async function handleSaveNewNote(note: INote) {
        if (!user.objectId) return;
        let newNote = await postUserNote(note);
        console.log("NOTES", newNote);
        if (!newNote) return 
        setUserNotes(prev => {return [newNote!, ...(prev||[])]});
        setIsCreatingNewNote(false);
    }
    //Saving when editing
    async function handleSaveNote(note: INote) {
        if (!user.objectId) return;
        let newNote = await postUserNote(note);
        if (!newNote) return 
        setUserNotes(prev => {
            if (typeof editNoteIndex !== "number" || !newNote) return prev;
            let updatedNotes = prev||[];
            updatedNotes[editNoteIndex] = newNote;
            return updatedNotes;
        });
        setEditNoteIndex(undefined);
    }

    async function handleDeleteNote(objectId: string) {
        await deleteUserNote(objectId);
        getUserNotes(undefined, { sort: "-createdTime", episodeId: episode?.objectId, limit: 30, userId: user.objectId });
    }

    let reachedUserNoteMax = (userNotes && userNotes.length >= 30) ? true : false;

  return (
    <div className='flex flex-col w-full'>
        <div id="Notes" className="flex flex-col w-full">
            {(!isCreatingNewNote && !reachedUserNoteMax) &&
                <IonButton 
                    color="medium" 
                    fill="clear" 
                    className="ion-padding" 
                    disabled={isUserNoteLoading}
                    onClick={(e) => {
                        setIsCreatingNewNote(true);
                    }}  
                >
                    <IonIcon icon={add} slot="start"/>
                    {isUserNoteLoading ? "Loading..." : "New Note"}
                </IonButton>
            }
            <div className="flex items-center justify-between w-full space-x-2">
                {!props.isTitleHidden ?
                    <h4 className="leading-none">My Notes</h4>
                :
                    <div></div>
                }
            </div>
            {/* New Notes */}
            {(isCreatingNewNote && !isUserNoteLoading && !reachedUserNoteMax) && 
                <NoteInput 
                    episode={episode} 
                    isLoading={isUserNoteLoading}
                    onSave={(note: INote) => {handleSaveNewNote(note);}} 
                    onCancel={(e) => setIsCreatingNewNote(false)}
                />
            }
        </div>
        {userNotes && userNotes.length ?
        <TextDivider>
            <IonChip onClick={() => {
                if (notes && notes.length) setShowingUserNotes(!showingUserNotes)
                }}
            >
                <span>My Notes</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">{userNotes.length}</span>}
                {notes && notes.length ? <IonIcon icon={!showingUserNotes ? chevronUp : chevronDown} />:<></>}
            </IonChip>
        </TextDivider>
        :<></>}
        {showingUserNotes && userNotes &&
        <div className="flex flex-col items-center w-full pb-6 justify-stretch">
            {userNotes && userNotes.map((note, index) => {
                if (typeof editNoteIndex === "number" && editNoteIndex===index)
                return (
                    <NoteInput 
                        // episode={note.episode} 
                        note={note}
                        key={"noteinput-"+note.objectId}
                        isLoading={isUserNoteLoading}
                        onSave={(note: INote) => {handleSaveNote(note);}} 
                        onCancel={(e) => setEditNoteIndex(undefined)}
                    />
                )
                else return (
                    <Note 
                        key={"usernote-"+note.objectId}
                        // episode={episode}
                        note={note}
                        isUser={true}
                        onDelete={(e) => {if (note?.objectId) handleDeleteNote(note.objectId)}}
                        onEdit={(e) => {setEditNoteIndex(index)}}
                        // onToggleHeart={(isHearting) => {}}
                        // onToggleFlag={(isFlaggig) => {}}
                    />
                )
            })
            }
            {props.isShowMore && 
            <IonButton fill="clear">
                <IonIcon icon={arrowForward} slot="end" />
                Load More
            </IonButton>
            }
        </div>
        }
        {notes && notes.length ?
        <TextDivider>
            <IonChip onClick={() => setShowingNotes(!showingNotes)}>
                <span>Public</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">{notes.length}</span>}
                <IonIcon icon={!showingNotes ? chevronUp : chevronDown} />
            </IonChip>
        </TextDivider>
        :<></>}
        {showingNotes &&
        <div>
            {notes && notes.map((note, index) => {

                return (
                    <Note 
                        key={"usernote-"+note.objectId}
                        // episode={episode}
                        note={note}
                        onDelete={(e) => {if (note?.objectId) handleDeleteNote(note.objectId)}}
                        onEdit={(e) => {setEditNoteIndex(index)}}
                        onPost={(e) => {}}
                        // onToggleHeart={(isHearting) => {}}
                        // onToggleFlag={(isFlaggig) => {}}
                    />
                )
            })
            }
        </div>
        }
    </div>
        
  )
}

export default Notes