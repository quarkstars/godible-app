import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItemDivider, IonPage, IonSelect, IonSelectOption, IonSkeletonText, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react'
import { Player } from 'components/AppShell'
import { UserState } from 'components/UserStateProvider'
import { BookCard } from 'components/ui/BookCard'
import Copyright from 'components/ui/Copyright'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import { PlayerControls } from 'components/ui/PlayerControls'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks, sampleEpisodes } from 'data/sampleEpisodes'
import { userDefaultLanguage } from 'data/translations'
import useBooks from 'hooks/useBooks'
import useEpisodes from 'hooks/useEpisodes'
import { search } from 'ionicons/icons'
import React, {useContext, useEffect, useState, useMemo} from 'react'
import { resolveLangString } from 'utils/resolveLangString'

const BookPage:React.FC = () => {      
  
  const {
    getBooks, 
    books,
    isLoading,
    error,
    setBooks,
  } = useBooks();

  const {
    user
  } = useContext(UserState);
  const lang = (user.language) ? user.language : userDefaultLanguage;


  const {
    appendEpisodeStrings, 
    getEpisodes, 
    isLoading: episodesIsLoading,
    error: episodesError,
    episodes,
    skip,
    setEpisodes,
  } = useEpisodes();

  const [reachedMax, setReachedMax] = useState(false);
  useIonViewDidEnter(() => {
    if (!location.pathname) return;
      setEpisodes(undefined);
      //If current episode matches location, get the episode from the server
      const currentSlug = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
      //set a preliminary episode lite only once from player if it matches
      getBooks(undefined, {limit: 12, slug: currentSlug});
      setReachedMax(false);
      setGotoEpisodes(undefined);
  }, [location.pathname]);
  useIonViewDidLeave(() => {
    setBooks(undefined);
    setEpisodes(undefined);
  });
  
  const book = (books) ? books[0] : undefined;


  useEffect(() => {
    //TODO: set to 24
    if (!books) return;
    let bookIds = (book) ? [book?.objectId] : undefined;
    getEpisodes(undefined, {limit: 24, bookIds, sort: "-publishedAt", exclude: ["text"]});
  }, [books]);

	const router = useIonRouter();
  const player = useContext(Player);
  const {
    getEpisodes: getGotoEpisodes, 
    episodes: gotoEpisodes,
    setEpisodes: setGotoEpisodes,
  } = useEpisodes();
  const [goto, setGoto] = useState<string>("1")
  const handleGoto = async (e, index: number) => {
    e.preventDefault();
    setGoto(e.detail.value)
    if (!episodes || !book) return;
    let episode = episodes.find((ep) => {
      return ep.number.toString() === e.detail.value;
    })
    if (episode) {
      router.push(episode._path!);
      return;
    }
    let bookIds = (book) ? [book?.objectId] : undefined;
    await getGotoEpisodes(undefined, {limit: 1, bookIds, number: Number(e.detail.value)});
}

  // Handle Click
  const handleListenClick = (e, index: number) => {
    e.preventDefault();
    if (!episodes) return;
    if (episodes.length < 1) return;
      //Reverse episodes because playlist should be incremental
      let reversedEpisodes = [...episodes].reverse();
      const reversedIndex = Math.abs(episodes.length - 1 - index);
      //Get 3 before and 3 after in the list
      const startIndex = (typeof reversedIndex === "number" && reversedIndex - 3 >= 0) ? reversedIndex -3 : 0;
      const endIndex = (typeof reversedIndex === "number" && reversedIndex + 4 <= reversedEpisodes.length-1) ? reversedIndex +4 : reversedEpisodes.length-1;
      const newEpisodes = [...reversedEpisodes].slice(startIndex, endIndex);
      let newIndex = newEpisodes.findIndex((ep) => ep.objectId === episodes[index].objectId);
      if (newIndex < 0) newIndex = 0;
      player.setIsAutoPlay(true);
      player.setList({episodes: newEpisodes});
      player.setIndex(newIndex);
      router.push(episodes[index]._path!);
  }

  useEffect(() => {
    if (!gotoEpisodes) return;
    if (gotoEpisodes.length < 1) return;
    router.push(gotoEpisodes[0]._path!);
  }, [gotoEpisodes]);

  useEffect(() => {
    if (!episodes) return;
    let max = book?.episodeCount || 0;
    if (episodes.length >= max) {
      return setReachedMax(true);
    };
  }, [episodes]);


  const fetchMoreEpisodes = async (e) => {
    e.preventDefault();
    let bookIds = (book) ? [book?.objectId] : undefined;
    await getEpisodes(undefined,{limit: 24, bookIds, sort: "-publishedAt", exclude: ["text"], skip: (skip||0)+1}, true);
    e.target.complete()
  }

  //Render components
  const episodeListItems = useMemo(() => {
    if (!episodes) return;

    return episodes.map((episode, index) => (
      <EpisodeListItem
        episode={episode}
        key={"epresult-" + episode.objectId}
        onPlay={(e) => {
          handleListenClick(e, index);
        }}
      />
    ));
  }, [episodes, handleListenClick]);
  //Select options
  const episodeSelectOptions = useMemo(() => {
    const episodeCount = book?.episodeCount || 0;
    return new Array(episodeCount).fill(undefined).map((item, index) => (
      <IonSelectOption value={(index + 1).toString()} key={"select-" + index}>
        {`Episode ${index + 1}`}
      </IonSelectOption>
    ));
  }, [book]);
  


  return (
    <IonPage>
      <IonHeader>
        <Toolbar>
          <IonTitle>
            {resolveLangString(book?.title, lang) || ""}
          </IonTitle>
        </Toolbar>
      </IonHeader>
      <IonContent>
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full p-4 pt-4 sm:p-10 sm:pt-6" style={{maxWidth:"1200px"}}>
                  
            {(!book && isLoading) &&  <IonSkeletonText style={{width:"100%", height:"386px"}} /> }
            {book &&
              <BookCard 
                book={book} 
                isFullWidth
                showTagline
                showDescription
                showAuthor
                showMetaData
                showBuyLink
                showReaders
                breakpoint='sm'
              />
            }
            
            <div className='flex justify-center w-full'>
              <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
                  <TextDivider>{`${book?.episodeCount ? book?.episodeCount +" ": ""}Episodes`}</TextDivider>
                  <div className="flex justify-between w-full">
                    <div className="flex items-center w-full space-x-2">
                    <span className="pl-4 font-medium uppercase">Go to</span>
                    <IonSelect 
                      value={goto} 
                      interface="action-sheet" 
                      onIonChange={(e)=>{
                        if (typeof e.detail.value !== "string") return;
                          handleGoto(e, Number(e.detail.value)-1);
                      }}
                    >
                      {episodeSelectOptions}
                    </IonSelect>
                    </div>
                  <IonButton fill="clear"  onClick={() => router.push(`/search?book=${book?.slug}`)}>
                    <IonIcon icon={search} slot="start" />
                    Search Book
                  </IonButton>
                  </div>
                  {episodeListItems}

                  
                {(!episodes && episodesIsLoading) && Array(12).fill(undefined).map((skel, index) => {
                    return (
                      <IonSkeletonText key={"episodeskel-"+index} style={{width:"100%", height:"48px"}} />
                    )
                  })
                }
                <IonInfiniteScroll
                  onIonInfinite={(ev) => {
                    fetchMoreEpisodes(ev);
                  }}
                  disabled={reachedMax}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </div>
            </div>
            <Copyright />
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default BookPage