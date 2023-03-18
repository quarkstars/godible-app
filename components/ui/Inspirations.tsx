import React from 'react'
import Inspiration from './Inspiration'
import { IonButton, IonChip, IonIcon, IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { checkmarkCircle, send } from 'ionicons/icons'
import TextDivider from './TextDivider'
import { IEpisode, IInspiration } from 'data/types'

interface IInspirationsProps {
    inspirations: IInspiration[];
    episode?: IEpisode;
    isTitleHidden?: boolean;
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
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
            <IonTextarea rows={7} placeholder={`Write an inspiration${props.episode?._title ? ` for ${props.episode?._title}` : ""}...`} autoGrow></IonTextarea>
        </div>
        <div className='w-full items-center flex justify-between'>
            <div className="font-bold  space-x-2 flex items-center text-primary ">
            <IonIcon icon={checkmarkCircle} />
            <span className="italic font-medium">Saved to Device</span>
            </div>
            <div className="flex justify-end items-center space-x-2">
            {/* <span className="text-medium italic">Private</span>
            <IonButton color="medium" fill="clear">
                <IonIcon icon={send} slot="end"/>
                Publish
            </IonButton> */}
                <IonList>
                    <IonItem>
                        <IonSelect interface="popover" value="private">
                        <IonSelectOption value="private" >Private</IonSelectOption>
                        <IonSelectOption value="public">Make Public</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
            </div>
        </div>
        </form>
        </div>
        <Inspiration />
        <TextDivider>
            <h4 className="leading-none">Shared</h4>
            <IonChip>0</IonChip>
        </TextDivider>
        <Inspiration />
    </div>
        
  )
}

export default Inspirations