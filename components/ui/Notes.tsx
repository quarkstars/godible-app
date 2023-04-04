import React from 'react'
import Note from './Note'
import { IonButton, IonChip, IonIcon, IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { arrowForward, calendar, checkmarkCircle, chevronDown, closeCircle, closeCircleOutline, send, trash } from 'ionicons/icons'
import TextDivider from './TextDivider'
import { IEpisode, INote } from 'data/types'

interface INotesProps {
    notes: INote[];
    episode?: IEpisode;
    isTitleHidden?: boolean;
    isClickToSave?: boolean;
    isPublicCountHidden?: boolean;
    isShowMore?: boolean;
}

const Notes = (props: INotesProps) => {
  return (
    <div className='flex flex-col w-full'>
        <div id="Notes" className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full space-x-2">
            {!props.isTitleHidden ?
                <h4 className="leading-none">My Notes</h4>
            :
                <div></div>
            }
        </div>
        <form className="mb-6">
        <div className="px-4 py-2 bg-white border rounded-lg rounded-t-lg shadow-inner border-medium dark:bg-gray-800 dark:border-gray-700">
            <IonTextarea rows={7} placeholder={`Write an note${props.episode?._title ? ` for ${props.episode?._title}` : ""}...`} autoGrow></IonTextarea>
        </div>
        <div className='flex items-center justify-between w-full'>
            
        <div className='flex items-center justify-start'>
            <IonButton color="primary">
                <IonIcon icon={send} slot="start"/>
                Save
            </IonButton>            
            {/* <IonButton color="medium" fill="clear">
                <IonIcon icon={closeCircleOutline} slot="icon-only"/>
            </IonButton>
            <div className="w-1 h-8 py-2 border-l border-l-1"></div>
            <IonButton color="danger" fill="clear">
                <IonIcon icon={trash} slot="icon-only"/>
            </IonButton> */}
        </div>
            <IonList>
                <IonItem>
                    <IonSelect interface="popover" value="private">
                    <IonSelectOption value="private" >Private</IonSelectOption>
                    <IonSelectOption value="public">Public</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
        </div>
        </form>
        </div>
        <TextDivider>
            <IonChip>
                <span>My Notes</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">1</span>}
                <IonIcon icon={chevronDown} />
            </IonChip>
        </TextDivider>
        <div className="flex flex-col items-center w-full pb-6 justify-stretch">

            <Note />
            {props.isShowMore && 
            <IonButton fill="clear">
                <IonIcon icon={arrowForward} slot="end" />
                See in my calendar
            </IonButton>
            }
        </div>
        <TextDivider>
            <IonChip>
                <span>Public</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">1</span>}
                <IonIcon icon={chevronDown} />
            </IonChip>
        </TextDivider>
        <div>
            <Note />
        </div>
    </div>
        
  )
}

export default Notes