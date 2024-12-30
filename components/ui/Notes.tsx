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
    autoFocus?: boolean;
    isUserNoteLoading?: boolean;
    isPublicNoteLoading?: boolean;
    userNoteError?: string;
    publicNoteError?: string;
    userNotes: INote[];
    publicNotes: INote[];
    onSaveNote: (note: INote, index?: number) => Promise<void>;
    onDeleteNote: (objectId: string) => Promise<void>;
    
}
/**
 * List of notes
 */
const Notes: React.FC<INotesProps> = (props) => {
  const { user } = useContext(UserState);

  const {
    episode,
    isTitleHidden,
    isClickToSave,
    isPublicCountHidden,
    isShowMore,
    userNotes,
    publicNotes,
    onSaveNote,
    onDeleteNote,
    isUserNoteLoading,
    isPublicNoteLoading,
    userNoteError,
    publicNoteError
  } = props;

  const [isCreatingNewNote, setIsCreatingNewNote] = useState<boolean>(true);
  const [editNoteIndex, setEditNoteIndex] = useState<number | undefined>();
  const [showingUserNotes, setShowingUserNotes] = useState<boolean>(true);
  const [showingNotes, setShowingNotes] = useState<boolean>(false);

  useEffect(() => {
    if (userNotes && userNotes.length > 1) setIsCreatingNewNote(false);
  }, [userNotes]);

  async function handleSaveNewNote(note: INote) {
    if (!user?.objectId) return;
    await onSaveNote(note);
    setIsCreatingNewNote(false);
  }

  async function handleSaveNote(note: INote) {
    if (!user?.objectId) return;
    await onSaveNote(note, editNoteIndex);
    setEditNoteIndex(undefined);
  }

  async function handleDeleteNote(objectId: string) {
    await onDeleteNote(objectId);
  }

  let reachedUserNoteMax = userNotes?.length >= 30;

  return (
    <div className='flex flex-col w-full'>
        <div id="Notes" className="flex flex-col w-full">
            {(!isCreatingNewNote && !reachedUserNoteMax && user?.objectId) &&
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
            {(isCreatingNewNote && !reachedUserNoteMax && user?.objectId) && 
                <NoteInput 
                    episode={episode} 
                    isLoading={isUserNoteLoading}
                    onSave={(note: INote) => {handleSaveNewNote(note);}} 
                    onCancel={(e) => setIsCreatingNewNote(false)}
                    autoFocus={props.autoFocus}
                />
            }
        </div>
        {userNotes && userNotes.length ?
        <TextDivider>
            <IonChip onClick={() => {
                if (userNotes && userNotes.length) setShowingUserNotes(!showingUserNotes)
                }}
            >
                <span>My Notes</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">{userNotes.length}</span>}
                {userNotes && userNotes.length ? <IonIcon icon={!showingUserNotes ? chevronUp : chevronDown} />:<></>}
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
        {publicNotes && publicNotes.length ?
        <TextDivider>
            <IonChip onClick={() => setShowingNotes(!showingNotes)}>
                <span>Public</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">{publicNotes.length}</span>}
                <IonIcon icon={!showingNotes ? chevronUp : chevronDown} />
            </IonChip>
        </TextDivider>
        :<></>}
        {showingNotes &&
        <div>
            {publicNotes && publicNotes.map((note, index) => {

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