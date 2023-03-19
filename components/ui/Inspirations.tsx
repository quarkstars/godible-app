import React from 'react'
import Inspiration from './Inspiration'
import { IonButton, IonChip, IonIcon, IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { arrowForward, calendar, checkmarkCircle, chevronDown, closeCircle, closeCircleOutline, send, trash } from 'ionicons/icons'
import TextDivider from './TextDivider'
import { IEpisode, IInspiration } from 'data/types'

interface IInspirationsProps {
    inspirations: IInspiration[];
    episode?: IEpisode;
    isTitleHidden?: boolean;
    isClickToSave?: boolean;
    isPublicCountHidden?: boolean;
    isShowMore?: boolean;
}

const Inspirations = (props: IInspirationsProps) => {
  return (
    <div className='flex flex-col w-full'>
        <div id="inspirations" className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full space-x-2">
            {!props.isTitleHidden ?
                <h4 className="leading-none">My Inspirations</h4>
            :
                <div></div>
            }
        </div>
        <form className="mb-6">
        <div className="px-4 py-2 bg-white border border-medium rounded-lg shadow-inner rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
            <IonTextarea rows={7} placeholder={`Write an inspiration${props.episode?._title ? ` for ${props.episode?._title}` : ""}...`} autoGrow></IonTextarea>
        </div>
        <div className='w-full items-center flex justify-between'>
            
        <div className='items-center flex justify-start'>
            <IonButton color="primary">
                <IonIcon icon={send} slot="start"/>
                Save
            </IonButton>            
            {/* <IonButton color="medium" fill="clear">
                <IonIcon icon={closeCircleOutline} slot="icon-only"/>
            </IonButton>
            <div className="h-8 w-1 py-2 border-l-1 border-l"></div>
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
                <span>My Inspirations</span>
                {!props.isPublicCountHidden && <span className="px-2 text-medium">1</span>}
                <IonIcon icon={chevronDown} />
            </IonChip>
        </TextDivider>
        <div className="w-full flex flex-col justify-stretch items-center pb-6">

            <Inspiration />
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
            <Inspiration />
        </div>
    </div>
        
  )
}

export default Inspirations