import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonPopover, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail, useIonPopover } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import useEpisodes from 'hooks/useEpisodes';
import { add, addCircle, addCircleOutline, bookmarkOutline, chevronForward, close, ellipsisVertical, eye, pauseCircle, playCircle, reorderTwo, swapVertical, trash } from 'ionicons/icons';
import React, {useRef, useMemo, useState, useContext} from 'react'
import TextDivider from './TextDivider';
import { Player } from 'components/AppShell';

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list: IList,
  setList: Function,
  setIndex: Function,
  index: number,
  isPlaying?: boolean,
}

const ListModal = (props: IPlayerListModalProps) => {

  const player = useContext(Player);

  //Prep episode data
  const {
    appendEpisodeStrings
  } = useEpisodes();

  let episodes = useMemo(() => {
    if (!props.list?.episodes) return [];
    return props.list?.episodes.map((episode) => {
      return appendEpisodeStrings(episode);
    })
  }, [props.list?.episodes, props.list, props.index])
  
  const [isReordering, setIsReordering] = useState(false);
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // Sync location of current Index
    if (props.index === event.detail.from) {
      props.setIndex(event.detail.to);
    }
    else if (event.detail.from < props.index && event.detail.to >= props.index) {
      props.setIndex(prev => prev - 1);
    }
    else if (event.detail.from > props.index && event.detail.to <= props.index) {
      props.setIndex(prev => prev + 1);
    }

    let newEpisodeOrder = event.detail.complete(props.list.episodes);

    props.setList(prev => {return {...prev, episdoes: newEpisodeOrder}});
    // TODO: if the list has an id, update the server

  }


    const [inspectedEpisode, setInspectedEpisode] = useState<IEpisode|undefined>()
    const [presentDetails, dismissDetails] = useIonPopover(EpisodeDetails, {
        onDismiss: (data: any, role: string) => dismissDetails(data, role),
        episode: inspectedEpisode
    });
    const [presentMenu, dismissMenu] = useIonPopover(EpisodeMenu, {
        onDismiss: (data: any, role: string) => dismissMenu(data, role),
        episode: inspectedEpisode,
    });


  console.log('episodes', props.list?.episodes)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton 
              color="dark" 
              onClick={() => {
                setIsReordering(false);
                props.onDismiss(null, 'close');
              }}
            >
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => props.onDismiss(null, 'save')}  size="small">
            <IonIcon icon={addCircleOutline} slot="start" />
              Save as List
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-light dark:text-dark">Listening Now</span>
          <IonButton size="small" fill="clear" color={isReordering ? "primary" : "medium"}
            onClick={()=>{setIsReordering(prev=>!prev)}}
          >
            <IonIcon icon={swapVertical} slot="start" color={isReordering ? "primary" : "medium"} />
            {isReordering ? "Done" : "Reorder"}
          </IonButton>
        </div>
        <IonList>
        {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
        <IonReorderGroup disabled={!isReordering} onIonItemReorder={handleReorder}>
        {episodes.map((episode, index) => {
          let weight = (index === props.index) ? "font-bold" : "font-medium";
          let highlight = (index === props.index) ? "light" : undefined;
          let isCurrent = (player.index === index);
          let isPlaying = (isCurrent && player.isPlaying)
          return(
            <IonReorder key={"list-"+episode.objectId} >
              <IonItem 
                // key={"list-"+episode.objectId} 
                color={highlight}
                onClick={(e: any) => {
                    if (isReordering) return;
                    props.onDismiss(episode.slug, "read");
                }}
                button={isReordering ? false : true}
              >
                {/* <IonReorder slot="start"></IonReorder> */}
                <div className="w-10 h-10 overflow-hidden rounded-lg cursor-pointer" 
                  onClick={(e: any) => {
                      e.stopPropagation();
                      setInspectedEpisode(episode);
                      presentDetails({
                      event: e,
                      onDidDismiss: (e: CustomEvent) => {setInspectedEpisode(undefined)},
                      side: "right",
                    })
                  }}
                >
                  <img  src={episode._bookImageUrl ? episode._bookImageUrl : episode.imageUrl} alt={episode._bookTitle} />
                </div>
                <div className='flex flex-col'>
                  <span className={`pl-3 truncated ${weight}`}>{`Episode ${episode.number}`}</span>
                  <div className={`hidden xs:flex space-x-1 pl-3 text-medium font-medium text-xs items-center ${weight}`}>
                    <span className="truncated">{episode?._bookTitle}</span>
                    {episode?._chapterName && <IonIcon icon={chevronForward} /> }
                    {episode?._chapterName && <span className="truncated">{episode?._chapterName}</span>}
                    </div>
                </div>
                {isReordering ? 
                  <IonIcon icon={swapVertical} color="primary" slot="end" />
                :
                <IonButtons slot="end">
                  <IonButton>
                    <IonIcon icon={isPlaying ? pauseCircle : playCircle} slot="icon-only" />
                  </IonButton>
                  <IonButton
                    onClick={(e: any) => {
                        e.stopPropagation();
                        setInspectedEpisode(episode);
                        presentMenu({
                        event: e,
                        onDidDismiss: (e: CustomEvent) => {setInspectedEpisode(undefined)},
                        side: "left",
                      })
                    }}
                  >
                    <IonIcon icon={ellipsisVertical} slot="icon-only" />
                  </IonButton>
                </IonButtons>
                }
              </IonItem>
            </IonReorder>
          )
        })
        }
        </IonReorderGroup>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

const EpisodeDetails = ({episode}) => {
  return (    
    <IonContent class="ion-padding">
    {episode?._bookTitle && <span className="pb-2 pr-2 font-bold">{episode?._bookTitle}</span>}
    <br/>
    {episode?._bookTitle && <span>{episode?._metaDataBlocks?.join(" \n ")}</span>}
    <br/>
    {/* <IonButton fill="clear" size="small">
      <IonIcon icon={eye}  color="medium" slot="start" />
      Read
    </IonButton> */}
  </IonContent>  )
}

const EpisodeMenu = ({episode}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                {/* <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={eye}  color="medium" />
                        <IonLabel>Read</IonLabel>
                    </div>
                </IonButton>
                </li> */}
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={bookmarkOutline}  color="medium" />
                        <IonLabel>Save</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={addCircleOutline} color="medium"/>
                        <IonLabel >Other List</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <IonButton fill="clear" expand="block" >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={trash} color="danger" />
                        <IonLabel color="danger">Remove</IonLabel>
                    </div>
                </IonButton>
                </li>
            </ul>
  </IonContent>  
  )
}

export default ListModal