import { IonButton, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { UserState } from 'components/UserStateProvider'
import Note from 'components/ui/Note'
import NoteInput from 'components/ui/NoteInput'
import Notes from 'components/ui/Notes'
import { PlayerControls } from 'components/ui/PlayerControls'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { INote } from 'data/types'
import useNotes from 'hooks/useNotes'
import { add, arrowForward, chevronDown, chevronUp } from 'ionicons/icons'
import React, {useEffect, useState, useContext, useRef} from 'react'

const NotesPage:React.FC = () => {

  const {user} = useContext(UserState);

  //Public Notes
    const {
        error: noteError,
        isLoading: isNoteLoading,
        notes,
        setNotes,
        postNoteFeedback,
        getNotes,
        skip,
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

        getNotes(undefined, { sort: "-createdTime", userIdNot: user.objectId, flagDifference: 2,/*heartCount:2,*/    limit: 12 });
        if (!user.objectId)  {
            setUserNotes(undefined);
            return;
        }
        getUserNotes(undefined, { sort: "-createdTime", limit: 12, userId: user.objectId });
    }, [user?.objectId]);

    const [editNoteIndex, setEditNoteIndex] = useState<number|undefined>();
    const [showingUserNotes, setShowingUserNotes] = useState<boolean>(true);
    const [showingNotes, setShowingNotes] = useState<boolean>(true);


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
        getUserNotes(undefined, { sort: "-createdTime", limit: 12, userId: user.objectId });
    }
    
    
  //Fetch more loadingmore
  const [reachedUserMax, setReachedUserMax] = useState<boolean>(false);
  const userNoteCount = useRef(0)
  useEffect(() => {
    userNoteCount.current = (userNotes) ? userNoteCount.current+userNotes.length : 0;
    // if (notes && notes.length <= 12) setReachedMax(true)
  }, [userNotes])
  const fetchMoreUserNotes = async (e) => {
      e.preventDefault();
      if (!notes) return;         
      const newUserNotes = await getUserNotes(undefined, { sort: "-createdTime", limit: 12, userId: user.objectId, skip: (skip||0)+1 }, true);
      const newUserNoteCount = (newUserNotes) ? newUserNotes.length : 0;
      if (userNoteCount.current + 12 >= userNoteCount.current + newUserNoteCount) setReachedUserMax(true);
  }

  //Fetch more loadingmore
  const [reachedMax, setReachedMax] = useState<boolean>(false);
  const noteCount = useRef(0)
  useEffect(() => {
    noteCount.current = (notes) ? noteCount.current+notes.length : 0;
    // if (notes && notes.length <= 12) setReachedMax(true)
  }, [notes])
  const fetchMoreNotes = async (e) => {
      e.preventDefault();
      if (!notes) return;
      const newNotes = await getNotes(undefined, { sort: "-createdTime", userIdNot: user.objectId, flagDifference: 2, /*heartCount:2,*/  limit: 12, skip: (skip||0)+1 }, true);
      const newNoteCount = (newNotes) ? newNotes.length : 0;
      if (noteCount.current + 12 >= noteCount.current + newNoteCount) setReachedMax(true);
  }

  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Notes
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex justify-center w-full">
          <div className='flex flex-col w-full' style={{maxWidth: "768px"}}>
            {userNotes && userNotes.length ?
            <TextDivider>
                <IonChip onClick={() => {
                    if (notes && notes.length) setShowingUserNotes(!showingUserNotes)
                    }}
                >
                    <span>My Notes</span>
                    {notes && notes.length ? <IonIcon icon={!showingUserNotes ? chevronUp : chevronDown} />:<></>}
                </IonChip>
            </TextDivider>
            :<></>}
            {(showingUserNotes && userNotes) &&
            <div className="flex flex-col items-center w-full justify-stretch">
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
                            isShowingEpisode={true}
                        />
                    )
                })
                }
            </div>
            }
            {(!reachedUserMax && showingUserNotes && userNotes && userNotes.length >= 12) &&
            <IonButton
              onClick={(ev) => {
                fetchMoreUserNotes(ev);
              }}
              disabled={isUserNoteLoading}
              color="medium"
              fill="clear"
            >
              {isUserNoteLoading ?
                "Loading..."
              :
                "Load More"
              }
            </IonButton>
            }
            {notes && notes.length ?
            <TextDivider>
                <IonChip onClick={() => setShowingNotes(!showingNotes)}>
                    <span>Public</span>
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
                            isShowingEpisode={true}
                        />
                    )
                })
                }
            </div>
            }
            {(!reachedMax && showingNotes && notes && notes.length >= 12) &&
                <IonButton
                  onClick={(ev) => {
                    fetchMoreNotes(ev);
                  }}
                  disabled={isUserNoteLoading}
                  color="medium"
                  fill="clear"
                >
                  {isNoteLoading ?
                    "Loading..."
                  :
                    "Load More"
                  }
                </IonButton>
                }
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default NotesPage