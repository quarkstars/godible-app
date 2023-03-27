import { IonButton, IonButtons, IonContent, IonIcon, IonLabel, IonPopover, useIonPopover } from '@ionic/react'
import { ellipsisVertical, flag, flagOutline, heartOutline, pencil, trash } from 'ionicons/icons'
import React, {useState} from 'react'



const Inspiration = () => {

    //Inspiration Ellipsis Menu
    const [present, dismiss] = useIonPopover(InspirationMenu, {
        onDismiss: (data: any, role: string) => dismiss(data, role),
    });

    // const [present, dismiss] = useIonPopover(Popover, {
    //     onDismiss: (data: any, role: string) => dismiss(data, role),
    //   });
    //   const [roleMsg, setRoleMsg] = useState('');


    return (
        <div className="p-6 mb-6 text-base rounded-tl-sm bg-dark rounded-3xl dark:bg-light" id="TODO:put-id">
        <footer className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <p className="inline-flex items-center mr-2 text-sm text-gray-900 sm:mr-3 dark:text-white"><img
                        className="w-6 h-6 mr-2 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        alt="Michael Gough" />Me</p>
                <p className="text-sm italic text-medium">
                    Public · Feb 8, 22
                {/* <time pubdate datetime="2022-02-08" title="February 8th, 2022">Feb. 8, 2022</time> */}
                </p>
            </div>      
            <IonButtons>
                <IonButton
                    onClick={(e: any) =>
                    present({
                        event: e,
                        onDidDismiss: (e: CustomEvent) => {},
                    })
                    }
                >
                    <IonIcon icon={ellipsisVertical} slot="icon-only" />
                </IonButton>
            </IonButtons>
            {/* <!-- Dropdown menu --> */}
            <IonPopover trigger="click-trigger" triggerAction="click">

            </IonPopover>
        </footer>
        <p className="text-gray-600 dark:text-gray-300">Example: I am so motivated to learn about church history from this Godible. This is an area I haven&apos;t spent enough time and is so important to pass to the next generation.
            </p>
        <div className="flex items-center mt-4 space-x-4">
            {/* TODO: Click to scroll to other inspirations */}
            <IonButtons>
                <IonButton size="small">
                    <IonIcon slot="start" icon={flagOutline} />
                    {/* <IonLabel>Reported</IonLabel> */}
                </IonButton>
            </IonButtons>
            <IonButtons>
                <IonButton size="small">
                    <IonIcon slot="start" icon={heartOutline} />
                    <IonLabel>0</IonLabel>
                </IonButton>
            </IonButtons>
            <IonButtons>
                <IonButton size="small">
                    <IonIcon slot="icon-only" size="small" icon={pencil} />
                </IonButton>
            </IonButtons>
        </div>
    </div>
  )
}

const InspirationMenu = () => {
  return (    
    <IonContent className="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={pencil}  color="medium" />
                        <IonLabel>Edit</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="medium"/>
                        <IonLabel >Delete</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={flag} color="medium" />
                        <IonLabel>Flag Report</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
    </IonContent>
  )
}


export default Inspiration