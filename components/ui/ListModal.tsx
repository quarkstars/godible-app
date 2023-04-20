import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonPopover, IonReorder, IonReorderGroup, IonTitle, IonToolbar, ItemReorderEventDetail, UseIonRouterResult, useIonPopover, useIonRouter } from '@ionic/react'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'
import { IEpisode, IList } from 'data/types';
import useEpisodes from 'hooks/useEpisodes';
import { add, addCircle, addCircleOutline, ban, bookmarkOutline, checkmarkCircle, chevronForward, close, closeCircle, ellipsisVertical, eye, pauseCircle, pencil, playCircle, reorderTwo, swapVertical, sync, syncCircle, trash, trashBin, trashOutline } from 'ionicons/icons';
import React, {useRef, useMemo, useState, useContext, useEffect} from 'react'
import TextDivider from './TextDivider';
import { Player } from 'components/AppShell';
import { UserState } from 'components/UserStateProvider';
import useLists from 'hooks/useLists';
import { list } from 'postcss';
import ListListItem from './ListListItem';

interface IPlayerListModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
  list?: IList,
  //TODO: setList and setIndex should be functions done previously
  setList?: Function,
  setIndex?: Function,
  index?: number,
  isPlaying?: boolean,
  isBookmarks?: boolean,
  isUserList?: boolean,
  isLoading?: boolean,
  router?:  UseIonRouterResult,
  isAddingEpisode?: boolean,
  addEpisodeId?: string,
  isViewOnly?: boolean,
}

const ListModal = (props: IPlayerListModalProps) => {

  const {
    onDismiss,
    list,
    setList,
    setIndex,
    index,
    isBookmarks,
    router,
    isLoading,
    isAddingEpisode,
    addEpisodeId,
    isViewOnly,
  } = props;


  const player = useContext(Player);
  const {
    user,
    setListReloads,
  } = useContext(UserState);

  //User Lists
  const {
    postList,
    getLists,
    lists,
    removeEpisodeFromList,
    isLoading: listsIsLoading,
    addEpisodeToList,
  } = useLists();

  //When adding an episode, show the fetch the user's lists and show the lists
  const [_isAddingEpisode, setIsAddingEpisode] = useState(isAddingEpisode||false);
  const [internalList, setInternalList] = useState<IList|undefined>();
  useEffect(() => {
    if (!_isAddingEpisode) return;
    getLists(undefined, { sort: "+index", limit: 30, userId: user.objectId });
  }, [_isAddingEpisode]);
  

  const _list = (internalList) ? internalList :  list;
  
  const [isReordering, setIsReordering] = useState(false);
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    if (!_list) return;
    if (typeof index === "number") {
      // Sync location of current Index
      if (index === event.detail.from) {
        if (setIndex) setIndex(event.detail.to);
      }
      else if (event.detail.from < index && event.detail.to >= index) {
        if (setIndex) setIndex(prev => prev - 1);
      }
      else if (event.detail.from > index && event.detail.to <= index) {
        if (setIndex) setIndex(prev => prev + 1);
      }
  }
  
    let newEpisodeOrder = event.detail.complete(_list.episodes);

    const newList = {..._list, episodes: newEpisodeOrder};
    if (!setList) return;
    setList(newList);

    // if the list has an id, update the server
    if (user.objectId && _list.objectId) {
      postList(newList);
    }

  }

  async function handleRemoveEpisode(event: CustomEvent<ItemReorderEventDetail>, episodeId: string) {
    if (!_list) return;
    //Remove from list (possibly on the server too)
    player.setIsMutatingList(true);
    const newList = await removeEpisodeFromList(_list, episodeId);

    //Find episode to decide if you want to move index
    let removedIndex:number|undefined = undefined;
    for (let i = 0; i < _list.episodes.length; i++) {
      if (_list.episodes[i].objectId === episodeId) {
        removedIndex = i;
        break;
      }
    }
    //Update list
    if (!newList || !setList || !setIndex) return player.setIsMutatingList(false);
    setList(newList);

    if (newList.episodes?.length === 0) {
      player.setIsMutatingList(false);
      onDismiss(undefined, "emptied list");
      return;
    }

    //Adjust the index if necessary
    let indexAdjust = (typeof index === "number" && removedIndex && removedIndex <= index) ? -1 : 0;
    let newIndex:number|undefined;
    if (typeof index === "number" && index >= newList.episodes?.length) newIndex = newList.episodes.length-1; 
    if (newIndex) newIndex = newIndex + indexAdjust;
    setIndex(newIndex);
    setTimeout(() => player.setIsMutatingList(false), 500);
  }

  const [listName, setListName] = useState<string|undefined>();
  useEffect(() => {
    if (!_list) return;
    if (!_list.name) return;
    setListName(_list.name);
  }, [_list?.name])



  async function handlePlay(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, episodeIndex: number, isDismissing = true) {
    
    if (!_list) return;
    const episodes = _list.episodes;
    if (!episodes) return;
    if (episodes.length < 1) return;
    //Reverse episodes because playlist should be incremental
      event.preventDefault();
      player.setIsMutatingList(true)
      player.setIsAutoPlay(true);
      player.setList(_list);
      player.setIndex(episodeIndex);
      if (!player.isPlaying) player.togglePlayPause(true);
      if (isDismissing) {
        console.log("ROUTER PUSH", episodes[episodeIndex]._path!)
        if (router) router.push(episodes[episodeIndex]._path!);
        setTimeout(() => player.setIsMutatingList(false), 500);
        onDismiss(undefined, "play")
      }
  }


  const [saveListText, setSaveListText] = useState<string>("Save as List");
  async function handleSaveList(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, _name?: string) {
    
    if (!_list) return;
    let name = (_name === "Bookmarks") ? "More Bookmarks" : _name;
    let userLists;
    let index = 1
    if (typeof _list.index !== "number") {
        userLists = await getLists(undefined, { limit:30, userId: user.objectId, exclude:["episodes"] });
        if (userLists && userLists.length >= 30) {
          setSaveListText("Failed! 30 List Max")
          throw "30 list max"
        }
        if (userLists && userLists.length > 0) index = userLists.length;
        if (!userLists || (userLists && userLists.length === 0)) {
          await postList({name: "Bookmarks", index: 0});
        }
    } else {
      index = _list.index;
    }
    if (isBookmarks) index = 0; 
    const updatedList = await postList({..._list, name, index});

    if (setList) setList(updatedList);
    else setInternalList(updatedList);
    setListReloads(prev => prev + 1)
  }

  
  //List saving
  async function handleSaveListToAdd(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, _name?: string) {
    let saveList;
    let name = (_name === "Bookmarks") ? "More Bookmarks" : _name;
    if (lists && lists.length >= 1) saveList = {name, index: lists.length};
    else return setListReloads(prev => prev + 1);
    const updatedList = await postList(saveList);
    setListReloads(prev => prev + 1);
    getLists(undefined, { sort: "+index", limit: 30, userId: user.objectId, exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
  }

  //Focus name input
  const nameListInput = useRef<HTMLIonInputElement>(null);


  const [isNamingList, setIsNamingList] = useState(false);

    const [inspectedEpisode, setInspectedEpisode] = useState<IEpisode|undefined>();
    const [presentDetails, dismissDetails] = useIonPopover(EpisodeDetails, {
        onDismiss: (data: any, role: string) => dismissDetails(data, role),
        episode: inspectedEpisode
    });
    const [presentMenu, dismissMenu] = useIonPopover(EpisodeMenu, {
        onDismiss: (data: any, role: string) => dismissMenu(data, role),
        episode: inspectedEpisode,
        handleRemoveEpisode,
    });


    console.log("SAVE LIST", _list, user)
  let isPlayerList = false;
  if (!_list?.objectId) isPlayerList = true
  else if (_list.objectId === player.list?.objectId) isPlayerList = true;
  console.log('LIST IS MISSING ONE OF THESE', player.index, index)
  if (_isAddingEpisode) {
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton 
              color="dark" 
              onClick={() => {
                onDismiss(null, 'close');
              }}
            >
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Add to List</IonTitle>
          {isLoading ?
            <IonIcon icon={isLoading ? sync : checkmarkCircle}  className="ion-padding"  slot="end" size="small" color="medium" />
          :
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                onDismiss(null, 'close');
              }}
            >
              <IonIcon icon={closeCircle} slot="start" />
              Cancel
              </IonButton>
          </IonButtons>
          }
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>

          {lists && lists.map((list, _index) => {
            return (
              <ListListItem
                list={list}
                key={"userlists-"+list.objectId}
                isAddingEpisode
                disabled={listsIsLoading}
                onClick={async (e) => {
                  let isPrepending = (_index) ? false : true;
                  if (!addEpisodeId) return;
                  let updatedList = await addEpisodeToList(_index, addEpisodeId, isPrepending);
                  setIsAddingEpisode(false);
                  setInternalList(updatedList);
                  setListReloads(prev => prev + 1);
                }}
              />
            )
          })}
          
          {(lists && lists.length >= 30) ?
            <IonItem color="medium" fill="outline" lines="none" className="ion-padding">
                <IonIcon icon={ban} slot="start"/>
                You have reached the 30 list limit. (Delete a list to make a new one)
            </IonItem>
            :
            <>
              
              {isNamingList ?
              <div className="flex w-full">
                <div className="w-full">
              <IonItem>
                <IonInput 
                  placeholder="Name your list..." 
                  ref={nameListInput}
                  onIonChange={(e) => {
                    if (typeof e.detail.value !== "string") return;
                  }}
                >
                </IonInput>
              </IonItem>
              </div>
              <IonButtons slot="end">
                <IonButton onClick={(e) => {
                  const name = typeof nameListInput.current?.value === "string" ? nameListInput.current?.value : undefined
                  handleSaveListToAdd(e, name?.slice(0,250));
                  setIsNamingList(false);
                }}  
                  size="small"
                  color="primary"
                  fill="clear"
                >
                <IonIcon icon={checkmarkCircle} slot="start" />
                  Save
                </IonButton>
                <IonButton onClick={(e) => {
                  setIsNamingList(false);
                }}  
                  size="small"
                  color="medium"
                  fill="clear"
                >
                <IonIcon icon={closeCircle} slot="start" />
                  Cancel
                </IonButton>
              </IonButtons>
              </div>
              :
              <IonButton 
                color="medium" 
                fill="clear" 
                className="ion-padding" 
                disabled={listsIsLoading}
                onClick={(e) => {
                  if (!isNamingList) {
                    setIsReordering(false);
                    setIsNamingList(true);
                    setTimeout(async () => {
                      await nameListInput.current?.setFocus();
                    }, 200);
                  } else setIsNamingList(false);
                }}  
              >
                  <IonIcon icon={listsIsLoading ? sync : add} slot="start"/>
                  {listsIsLoading ? "Loading..." : "Create a List"}
              </IonButton>
              }
            </>
            }
        </IonList>
      </IonContent>
    </IonPage>
    )
  }
  else return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton 
              color="dark" 
              onClick={() => {
                setIsReordering(false);
                onDismiss(null, 'close');
              }}
            >
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
          {isAddingEpisode && <IonTitle>Added!</IonTitle>}
          {isLoading ?
            <IonIcon icon={isLoading ? sync : checkmarkCircle}  className="ion-padding"  slot="end" size="small" color="medium" />
          :
          <IonButtons slot="end">
            {user.objectId && list?.name !== "Bookmarks" &&
              <IonButton onClick={(e) => {
                if (!isNamingList) {
                  setIsReordering(false);
                  setIsNamingList(true);
                  setTimeout(async () => {
                    if (nameListInput.current) nameListInput.current.value = listName;
                    await nameListInput.current?.setFocus();
                  }, 200);
                } else setIsNamingList(false);
              }}  
                size="small"
              >
              <IonIcon icon={isNamingList ? closeCircle : _list ?.userId === user.objectId ? pencil : addCircleOutline} slot="start" />
                {isNamingList ? "Cancel" : _list?.userId === user.objectId ? "" : saveListText }
              </IonButton>
            }

          </IonButtons>
          }
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        <div className="flex items-center justify-between w-full">

          
          {isNamingList ?
          <div className="flex w-full">
            <div className="w-full">
          <IonItem>
            <IonInput 
              placeholder="Name your list..." 
              ref={nameListInput}
              onIonChange={(e) => {
                if (typeof e.detail.value !== "string") return;
                setListName(e.detail.value);
              }}
            >
            </IonInput>
          </IonItem>
          </div>
          <IonButtons slot="end">
            <IonButton onClick={(e) => {
              const name = typeof nameListInput.current?.value === "string" ? nameListInput.current?.value : undefined
              handleSaveList(e, name?.slice(0,250));
              setIsNamingList(false);
            }}  
              size="small"
              color="primary"
              fill="outline"
            >
            <IonIcon icon={checkmarkCircle} slot="start" />
              Save
            </IonButton>
          </IonButtons>
          </div>
          :
            <span className="font-medium text-light dark:text-dark">
              {isLoading ? 
                `Saving...`
              :
            
              <>{listName ? listName : "Listening Now"}</>
              }
            </span>
          }
          {setList && !isNamingList && _list?.episodes && _list?.episodes.length > 1 &&
            <IonButton size="small" fill="clear" color={isReordering ? "primary" : "medium"}
              onClick={()=>{setIsReordering(prev=>!prev)}}
            >
              <IonIcon icon={swapVertical} slot="start" color={isReordering ? "primary" : "medium"} />
              {isReordering ? "Done" : "Reorder"}
            </IonButton>
        }
        </div>
        <IonList>
        {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
        <IonReorderGroup disabled={!isReordering} onIonItemReorder={(e) => handleReorder(e)}>
        {_list?.episodes && _list.episodes.map((episode, _index) => {
          //Will it be highlighted?
          let weight:string|undefined;
          let highlight:string|undefined;
          let isCurrent:boolean|undefined;
          let isPlaying:boolean|undefined;
          //Check if current episode matches the current one in the player
          if (typeof index === "number" && typeof index === "number" && episode.objectId === player.list?.episodes?.[player.index]?.objectId ) {
            weight = (player.index === _index) ? "font-bold" : "font-medium";
            highlight = (typeof index === "number" && player.index === _index) ? "light" : undefined;
            isCurrent = (typeof index === "number" && player.index === _index);
            isPlaying = (isCurrent && player.isPlaying)
          }

          return(
            <IonReorder key={"list-"+episode.objectId} >
              <IonItem 
                // key={"list-"+episode.objectId} 
                color={highlight}
                onClick={(e: any) => {
                    if (isReordering) return;
                    handlePlay(e, _index, true);                
                    onDismiss(episode.slug, "read");
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
                  <IonButton
                      onClick={(e: any) => {
                        e.stopPropagation();
                        if (isReordering) return;
                        if (!isPlaying) handlePlay(e, _index, true);                
                        else player.togglePlayPause();
                        
                    }}
                  >
                    <IonIcon icon={isPlaying ? pauseCircle : playCircle} slot="icon-only" />
                  </IonButton>
                  {!isViewOnly &&
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
                  }
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

const EpisodeMenu = ({episode, handleRemoveEpisode, onDismiss}) => {
  return (    
    <IonContent class="ion-padding">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                <IonButton fill="clear" expand="block" 
                  onClick={(e) => {
                    handleRemoveEpisode(e, episode.objectId)
                    onDismiss();
                  }}
                >
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