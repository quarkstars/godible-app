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

  console.log(47)
  const player = useContext(Player);
  const {
    user,
    setListReloads,
  } = useContext(UserState);

  console.log(52)
  //User Lists
  const {
    postList,
    getLists,
    lists,
    removeEpisodeFromList,
    isLoading: listsIsLoading,
    addEpisodeToList,
  } = useLists();

  console.log(65)
  //When adding an episode, show the fetch the user's lists and show the lists
  const [_isAddingEpisode, setIsAddingEpisode] = useState(isAddingEpisode||false);
  const [internalList, setInternalList] = useState<IList|undefined>();
  useEffect(() => {
    if (!_isAddingEpisode) return;
    console.log("GET LIST", user)
    getLists(undefined, { sort: "+index", limit: 30, userId: user?.objectId });
  }, [_isAddingEpisode]);
  

  console.log(75)
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
  
  console.log(93)
    let newEpisodeOrder = event.detail.complete(_list?.episodes);

    const newList = {..._list, episodes: newEpisodeOrder};
    if (setList) setList(newList);

    // if the list has an id, update the server
    if (user?.objectId && _list?.objectId) {
      postList(newList);
    }

  }

  console.log(107)
  async function handleRemoveEpisode(event: CustomEvent<ItemReorderEventDetail>, episodeId: string) {
    if (!_list) return;
    //Remove from list (possibly on the server too)
    player.setIsMutatingList(true);
    const newList = await removeEpisodeFromList(_list, episodeId);

    console.log(114)
    //Find episode to decide if you want to move index
    let removedIndex:number|undefined = undefined;
    for (let i = 0; i < _list?.episodes.length; i++) {
      if (_list?.episodes[i]?.objectId === episodeId) {
        removedIndex = i;
        break;
      }
    }
    //Update list
    if (!newList || !setList || !setIndex) return player.setIsMutatingList(false);
    setList(newList);

    console.log(127)
    if (newList.episodes?.length === 0) {
      player.setIsMutatingList(false);
      onDismiss(undefined, "emptied list");
      return;
    }

    console.log(134)
    //Adjust the index if necessary
    let indexAdjust = (typeof index === "number" && removedIndex && removedIndex <= index) ? -1 : 0;
    let newIndex:number|undefined;
    if (typeof index === "number" && index >= newList.episodes?.length) newIndex = newList.episodes.length-1; 
    if (newIndex) newIndex = newIndex + indexAdjust;
    setIndex(newIndex);
    setTimeout(() => player.setIsMutatingList(false), 500);
  }

  console.log(144, _list?.name)
  const [listName, setListName] = useState<string|undefined>();
  useEffect(() => {
    console.log(147)
    if (!_list) return;
    if (!_list?.name) return;
    setListName(_list?.name);
  }, [_list?.name])



  console.log(154)
  async function handlePlay(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, episodeIndex: number, isDismissing = true) {
    
    if (!_list) return;
    const episodes = _list?.episodes;
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
        if (router) router.push(episodes[episodeIndex]._path!);
        setTimeout(() => player.setIsMutatingList(false), 500);
        onDismiss(undefined, "play")
      }
  }


  const [saveListText, setSaveListText] = useState<string>("Save as List");
  async function handleSaveList(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, _name?: string) {
    
  console.log(180)
    if (!_list) return;
    let name = (_name === "Bookmarks") ? "More Bookmarks" : _name;
    let userLists;
    let index = 1
    if (typeof _list?.index !== "number") {
        userLists = await getLists(undefined, { limit:30, userId: user?.objectId, exclude:["episodes"] });
        if (userLists && userLists.length >= 30) {
          setSaveListText("Failed! 30 List Max")
          throw "30 list max"
        }
        if (userLists && userLists.length > 0) index = userLists.length;
        if (!userLists || (userLists && userLists.length === 0)) {
          await postList({name: "Bookmarks", index: 0});
        }
    } else {
      index = _list?.index;
    }
    if (isBookmarks) index = 0; 
    const updatedList = await postList({..._list, name, index});

    if (setList) setList(updatedList);
    else setInternalList(updatedList);
    setListReloads(prev => prev + 1)
  }

  
  console.log(207)
  //List saving
  async function handleSaveListToAdd(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, _name?: string) {
    console.log(210)
    let saveList;
    let name = (_name === "Bookmarks") ? "More Bookmarks" : _name;
    if (lists && lists.length >= 1) saveList = {name, index: lists.length};
    else return setListReloads(prev => prev + 1);
    const updatedList = await postList(saveList);
    setListReloads(prev => prev + 1);
    getLists(undefined, { sort: "+index", limit: 30, userId: user?.objectId, exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
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
  const reorderable = (setList || (_list?.userId && _list?.userId === user?.objectId))

  console.log(238, user, internalList, lists, _list)

  let isPlayerList = false;
  if (!_list?.objectId) isPlayerList = true
  else if (_list?.objectId === player.list?.objectId) isPlayerList = true;
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

      </IonContent>
    </IonPage>
    )
  }
  else return (
    <IonPage>
      <IonHeader>
        <IonToolbar>

        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
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