import { IonButton, IonButtons, IonContent, IonIcon, IonLabel, IonPopover, IonThumbnail, useIonPopover, useIonRouter } from '@ionic/react'
import { UserState } from 'components/UserStateProvider';
import { IEpisode, INote } from 'data/types';
import useNotes from 'hooks/useNotes';
import { chevronForward, ellipsisVertical, flag, flagOutline, heart, heartOutline, pencil, trash } from 'ionicons/icons'
import React, {useState, useMemo, useEffect, useContext} from 'react'
import InitialsAvatar from 'react-initials-avatar';
import { formatShortDate } from 'utils/formatShortDate';


interface INoteProps {
    // episode?: IEpisode,
    note?: INote,
    isUser?: boolean,
    onDelete?: Function,
    onPost?: Function,
    onEdit?: Function,
    isShowingEpisode?: boolean,
}

const Note = (props: INoteProps) => {
    
	const router = useIonRouter();
    
    const {
        user
    } = useContext(UserState);

    const {
        // episode,
        note,
        isUser,
        onDelete,
        isShowingEpisode,
        onEdit,
    } = props;


    //Note Ellipsis Menu
    const [present, dismiss] = useIonPopover(NoteMenu, {
        onDismiss: (data: any, role: string) => dismiss(data, role),
        onDelete,
    });

    //Hearts and Flags
    const {
        postNoteFeedback
    } = useNotes()
    const [isHearted, setIsHearted] = useState<boolean|null|undefined>(null);
    const [isFlagged, setIsFlagged] = useState<boolean|null|undefined>(null);
    const [heartCount, setHeartCount] = useState<number|undefined>();
    useEffect(() => {
        if (!note) return;
        setIsHearted(note?.isHearted);
        setIsFlagged(note?.isFlagged);
        setHeartCount(note?.heartCount);
    }, [note])
    


    const handleFlag = () => {
        if (!note) return;
        if (isFlagged) {
            setIsFlagged(null);
            postNoteFeedback({userId: user?.objectId, noteId: note.objectId, isFlagged: null});
        } else {
            setIsFlagged(true);
            postNoteFeedback({userId: user?.objectId, noteId: note.objectId, isFlagged: true});
        }
    }

    const handleHeart = () => {
        if (!note) return;
        if (isHearted) {
            setIsHearted(null);
            postNoteFeedback({userId: user?.objectId, noteId: note.objectId, isHearted: null});
            if (heartCount) setHeartCount(prev => prev! - 1);
        } else {
            setIsHearted(true);
            postNoteFeedback({userId: user?.objectId, noteId: note.objectId, isHearted: true});
            setHeartCount(prev => {
                return (prev) ? prev + 1 : 1;
            });
        }
    }



    const userName = `${note?.user?.firstName ? note?.user?.firstName:""}${note?.user?.lastName ? " "+note?.user?.lastName:""}`
    const avatar = (note?.user?.imageUrl) ? 
        <div className="w-4 h-4 mr-2 overflow-hidden rounded-full">
            <img src={note?.user.imageUrl} className="w-full h-full"/>
        </div>
    :
        <div className='p-2 px-4' style={{zoom: .38}}><InitialsAvatar name={userName} /></div>



    const date = (note?.createdTime) ? formatShortDate(note?.createdTime) : ""
    const text = useMemo(() => {
        const _textBlocks:string[] = (note?.text) ? note?.text.split("\n") : [];
        if (!note?.text) return <></>;
        return _textBlocks.map((line, index) => {
            return (
                <p className="pb-2 pl-2 text-gray-600 dark:text-gray-300" key={`${note?.objectId}-${index}`}>
                    {line}
                </p>
            )
        })
      }, [note?.text])

    return (
        <div className="w-full p-6 mb-6 text-base rounded-tl-sm bg-dark rounded-3xl dark:bg-light" id="TODO:put-id">
        <footer className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                 {avatar}

                <div className="flex items-center mr-2 space-x-1 text-sm font-medium text-gray-900 line-clamp-1 sm:mr-3 dark:text-white">
                    {isUser ? "Me" : userName}
                </div>
                <p className={`hidden text-sm italic mobile:inline line-clamp-1 ${isUser && note?.isPublic ? "font-medium text-primary" : " text-medium "}`}>
                    {`${isUser ? note?.isPublic ? "Public · " : "Private · " : ""}${date}`}
                </p>
            </div>     
            {isUser && 
                <div className="flex">
                    <IonButtons>
                        <IonButton
                            onClick={(e: any) =>{
                                if (onEdit) onEdit();
                            }}
                        >
                            <IonIcon size="small" icon={pencil} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <IonButtons>
                        <IonButton
                            onClick={(e: any) =>
                            present({
                                event: e,
                                onDidDismiss: (e: CustomEvent) => {},
                                alignment: "start",
                                side: "left",
                                reference: "trigger",
                            })
                            }
                        >
                            <IonIcon size="small" icon={trash} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </div> 
            }
            
            {!isUser && 
                <IonButtons>
                    <IonButton size="small" 
                        onClick={handleFlag}>
                        <IonIcon slot="start" icon={isFlagged ? flag : flagOutline} />
                        {isFlagged && <IonLabel color="danger">Reported</IonLabel>}
                    </IonButton>
                </IonButtons>
            }
            {/* <!-- Dropdown menu --> */}
            <IonPopover trigger="click-trigger" triggerAction="click">

            </IonPopover>
        </footer>
        {text}
        <div className="flex items-center mt-1 space-x-4">
            {/* TODO: Click to scroll to other Notes */}
            {!isUser && 
                <IonButtons>
                    <IonButton size="small"
                        onClick={handleHeart}
                    >
                        <IonIcon slot="start" color="primary" icon={isHearted ? heart : heartOutline} />
                        <IonLabel>{heartCount}</IonLabel>
                    </IonButton>
                </IonButtons>
            }
            {(isUser && note?.heartCount) ?
                <div className="flex items-center pl-1 space-x-2 text-light dark:text-dark">
                    <IonIcon slot="start" color="primary" icon={heart} />
                    <IonLabel><div className="text-sm">{note?.heartCount}</div></IonLabel>
                </div>
                :
                <></>
            }
            {(isShowingEpisode && note?.episode) ?
                <IonButton fill="clear" size="small" onClick={() => {router.push(`/episode/${note?.episode?.slug}`)}}>
                   {note.episode.book?.thumbUrl &&
                    <div className="w-4 h-4 mr-2 overflow-hidden rounded-sm">
                        <img src={note.episode.book?.thumbUrl} className="w-full h-full"/>
                    </div>
                    }
                    <IonLabel><div className="text-sm font-medium text-medium">{note?.episode.number ? note?.episode.number : ""}</div></IonLabel>
                    <IonIcon slot="end" size="small" color="medium" icon={chevronForward} />
                </IonButton>
                :
                <></>
            }
        </div>
    </div>
  )
}

const NoteMenu = ({onDelete, onDismiss}) => {
  return (    
    <IonContent className="ion-padding">
            <ul className="py-1 text-sm">
                <li>
                <IonButton fill="clear" expand="block" onClick={() => {if (onDelete) onDelete(); onDismiss()}}>
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="danger"/>
                        <IonLabel color="danger">Delete</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
    </IonContent>
  )
}


export default Note