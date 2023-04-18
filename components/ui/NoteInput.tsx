import { IonButton, IonIcon, IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { IEpisode, INote } from 'data/types';
import { closeCircle, send } from 'ionicons/icons'
import React, {useRef, useEffect} from 'react'

interface INotesProps {
    episode?: IEpisode;
    note?: INote;
    onSave?: (note: INote) => void,
    onCancel?: (e) => void,
    isLoading?: boolean,
}

const NoteInput = (props: INotesProps) => {
    const {
        episode, 
        note,
        onSave,
        isLoading,
        onCancel,
    } = props;

    const inputEl = useRef<HTMLIonTextareaElement>(null);
    useEffect(() => {
        if (!inputEl.current) return;
        if (note) inputEl.current.value = note.text;
        setTimeout(async () => {await inputEl.current?.setFocus()}, 200);
    }, [note, inputEl.current])
    
    const selectEl = useRef<HTMLIonSelectElement>(null);
    useEffect(() => {
        if (!note || !selectEl.current) return;
        if (note.isPublic) selectEl.current.value = "public";
        else selectEl.current.value = "private";
    }, [note, selectEl.current]);

    function handleSave() {
        if (!selectEl.current || !inputEl.current || !onSave) return;
        if (!inputEl.current.value) return;
        if (inputEl.current.value.length === 0) return;
        let isPublic = (selectEl.current.value === "public") ? true : false
        let text = inputEl.current.value;
        let episodeId = episode?.objectId
        let saveNote:INote = {...(note||{}), isPublic, text, episodeId};
        onSave(saveNote);
    }

    return (
        <form className="w-full mb-6">
            <div className="px-4 py-2 bg-white border rounded-lg rounded-t-lg shadow-inner border-medium dark:bg-gray-800 dark:border-gray-700">
                <IonTextarea disabled={isLoading} ref={inputEl} rows={5} placeholder={`Write a note${episode?._title ? ` for ${episode?._title}` : ""}...`} autoGrow></IonTextarea>
            </div>
            <div className='flex items-center justify-between w-full'>
                
            <div className='flex items-center justify-start'>    
                {onSave &&
                    <IonButton color="primary" onClick={handleSave} disabled={isLoading}>
                        <IonIcon icon={send} slot="start"/>
                        Save
                    </IonButton> 
                }      
                {onCancel &&
                    <IonButton color="medium" fill="clear" onClick={(e) => {if (onCancel) onCancel(e)}} disabled={isLoading}>
                        <IonIcon icon={closeCircle} slot="start"/>
                        Cancel
                    </IonButton> 
                }
            </div>
                <IonList>
                    <IonItem>
                        <IonSelect interface="popover" value="private" ref={selectEl}>
                        <IonSelectOption value="private" >Private</IonSelectOption>
                        <IonSelectOption value="public">Public</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
            </div>
        </form>
    )
}

export default NoteInput