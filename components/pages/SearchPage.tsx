import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonSearchbar, IonButton, useIonViewDidEnter, IonIcon, IonChip, IonLabel, useIonPopover, IonFooter, useIonRouter, IonSelect, IonSelectOption, IonSpinner, useIonModal, IonSkeletonText, useIonViewWillEnter, useIonViewDidLeave, IonBackButton } from '@ionic/react'
import { Player } from 'components/AppShell'
import { UserState } from 'components/UserStateProvider'
import { BookCard } from 'components/ui/BookCard'
import CardList from 'components/ui/CardList'
import Copyright from 'components/ui/Copyright'
import { EpisodeCard } from 'components/ui/EpisodeCard'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import Hero from 'components/ui/Hero'
import ListModal from 'components/ui/ListModal'
import { PlayerControls } from 'components/ui/PlayerControls'
import SlideList from 'components/ui/SlideList'
import SpeechListItem from 'components/ui/SpeechListItem'
import TextDivider from 'components/ui/TextDivider'
import Thumbnail from 'components/ui/Thumbnail'
import Toolbar from 'components/ui/Toolbar'
import { TopicCard } from 'components/ui/TopicCard'
import { sampleBooks, sampleEpisodes, sampleTopics } from 'data/sampleEpisodes'
import { userDefaultLanguage } from 'data/translations'
import { IBook, IEpisode, IList, ISpeech, ITopic } from 'data/types'
import { resolve } from 'dns'
import useBooks from 'hooks/useBooks'
import useEpisodes from 'hooks/useEpisodes'
import useLists from 'hooks/useLists'
import useTopics from 'hooks/useTopics'
import { addCircleOutline, bulb, card, chevronDown, closeCircle, filter, grid, list, playCircle } from 'ionicons/icons'
import React, {useRef, useState, useContext, useEffect, useMemo} from 'react'
import { SwiperSlide } from 'swiper/react'
import { resolveLangString } from 'utils/resolveLangString'

interface ISearchPageProps {
  defaultMode?: string, 
  defaultDisplay?: string, 
  defaultTopicId?: string,
  defaultBookId?: string,
  defaultQuery?: string,
  isNotInitSearch?:boolean,
}


const SearchPage = (props: ISearchPageProps) => {

	const router = useIonRouter();
  
  const player = useContext(Player);

  const {
    user,
    isModalOpen,
  } = useContext(UserState);
  const lang = (user.language) ? user.language : userDefaultLanguage;


  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [topicWidth, setTopicWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);
  const [display, setDisplay] = useState<string|undefined>(props.defaultDisplay);
  let displayIcon = list;
  if (display === "card") displayIcon = grid;
  if (display === "quote") displayIcon = bulb;
  const [mode, setMode] = useState<string|undefined>(props.defaultMode);

  //Get topics
  const {getTopics, topics, isLoading: topicsIsLoading, setTopics} = useTopics();
  useIonViewWillEnter(() => {
    if (topics) return;
    getTopics(undefined, {sort: "+index"});
  });

  //Selected Topic
  const [topicFilter, setTopicFilter] = useState<ITopic|undefined>();
  //Get the topics on the first load
  useEffect(() => {  
    if (!topics || !router.routeInfo.search) return;
    if (topics.length < 1) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const topicSlug = urlParams.get("topic");
    let currentTopic = topics.find((top) => {
      return topicSlug === top.slug;
    });
    setTopicFilter(currentTopic);
  }, [topics, router.routeInfo.search]);
  
  //Set topic to the url param (keeping book param if it exists)
  const topicClickHandler = (e, topic:ITopic) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const bookSlug = urlParams.get("book");
    let bookParam = (bookSlug) ? `&book=${bookSlug}` : "";
    router.push(`${router.routeInfo.pathname}?topic=${topic.slug}${bookParam}`);
    setTopicFilter(topic);
  }
    //Set topic to the url param (keeping book param if it exists)
    const removeTopicHandler = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(router.routeInfo.search)
      const bookSlug = urlParams.get("book");
      let bookParam = (bookSlug) ? `&book=${bookSlug}` : "";
      router.push(`${router.routeInfo.pathname}?${bookParam}`);
      setTopicFilter(undefined);
    }


  //Get books
  const {getBooks, books, setBooks} = useBooks();
  useIonViewWillEnter(() => {
    if (books) return;
    getBooks(undefined, {sort: "+index"});
  }, []);

  //Selected Book
  const [bookFilter, setBookFilter] = useState<IBook|undefined>();
  //Get the books on the first load
  useEffect(() => {  
    if (!books || !router.routeInfo.search) return;
    if (books.length < 1) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const bookSlug = urlParams.get("book");
    let currentBook = books.find((top) => {
      return bookSlug === top.slug;
    });
    setBookFilter(currentBook);
  }, [books, router.routeInfo.search]);
  
  //Set book to the url param (keeping book param if it exists)
  const bookClickHandler = (e, book:IBook) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const topicSlug = urlParams.get("topic");
    let topicParam = (topicSlug) ? `&topic=${topicSlug}` : "";
    router.push(`${router.routeInfo.pathname}?book="${book.slug}${topicParam}`);
    setBookFilter(book);
  }
    //Set book to the url param (keeping book param if it exists)
    const removeBookHandler = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(router.routeInfo.search)
      const topicSlug = urlParams.get("topic");
      let topicParam = (topicSlug) ? `&topic=${topicSlug}` : "";
      router.push(`${router.routeInfo.pathname}?${topicParam}`);
      setBookFilter(undefined);
    }


  //Focus search bar when entering the page
  const searchBar = useRef<HTMLIonSearchbarElement>(null)
  useIonViewDidEnter(async () => {
    if (!searchBar.current) return;
    
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const init = urlParams.get("init");
    if (init == "0" || props.isNotInitSearch) return;
    //Try without initing search on start, because it seems to impact performance
    // setTimeout(async () => {await searchBar.current!.setFocus()}, 200);
  }, [searchBar.current]);

  //Search bar query
  const [search, setSearch] = useState<string|undefined>();
  const searchChangeHandler = (e) => {
    const query = e.target.value as string|undefined;
    if (!query || query.length < 3) return setSearch(undefined);
    setSearch(query);
  }

  const [max, setMax] = useState<number|undefined>();
  const [reachedMax, setReachedMax] = useState<boolean>(false);
  const [listMax, setListMax] = useState<number|undefined>();
  const [reachedListMax, setReachedListMax] = useState<boolean>(false);

  // Set Mode
  useEffect(() => {      
    if (!router.routeInfo.search) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const modeParam = urlParams.get("mode");
    if (modeParam === "episodes") setMode("episodes");
    if (modeParam === "speeches") setMode("speeches");
  }, [router.routeInfo.search]);


  const {
    getEpisodes, 
    setEpisodes,
    isLoading: episodesIsLoading,
    error: episodesError,
    episodes,
    skip,
  } = useEpisodes();
  
  const {
    getLists, 
    setLists,
    isLoading: listsIsLoading,
    error: listError,
    lists,
    skip: listSkip,
  } = useLists();
  let speeches = lists as ISpeech[]|undefined;
  //Update episode list everytime parameters change


  const initializeResults = () => {

    if (mode !== "speeches") {
      let sort = (!search) ? "-publishedAt" : undefined;
        const bookIds = bookFilter ? [bookFilter.objectId] : undefined;
        const topicIds = topicFilter ? [topicFilter.objectId!] : undefined;
        setMax(undefined);
        setReachedMax(false);
        setEpisodes(undefined);
        getEpisodes(undefined, {search, bookIds, topicIds, limit: 24, sort,  exclude: ["text"] });
      }
      if (mode !== "episodes") {
        let sort = (!search) ? "-createdTime" : undefined;
        const bookId = bookFilter ? bookFilter.objectId: undefined;
        const topicId = topicFilter ? topicFilter.objectId! : undefined;
        setListMax(undefined);
        setReachedListMax(false);
        setLists(undefined);
        getLists(undefined, {search, bookId, topicId, limit: 24, isSpeech: true,sort, exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] });
      }
  }


  useEffect(() => {
    //Only load episodes if defined search
    if (!search && !bookFilter && !topicFilter && mode !== "speeches" && mode !== "episodes") return;
    initializeResults()
    
  }, [search, bookFilter, topicFilter, mode]);

  useIonViewDidEnter(() => {
    if (!search && !bookFilter && !topicFilter && mode !== "speeches" && mode !== "episodes") return;
    if (typeof episodes === "undefined" || typeof speeches === "undefined") initializeResults();
    if (searchBar.current) searchBar.current.value = undefined
    
  }, []);
  
  //get the max count
  useEffect(() => {
    if (!episodes) return setMax(undefined);
    let newMax = 0;
    if (bookFilter && !topicFilter && !search) {newMax = bookFilter.episodeCount || 0;}
    else if (!bookFilter && topicFilter && !search) {
      newMax = topicFilter.episodeCount || 0;
    }
    else {
      newMax = episodes[0]?.hitCount || 0;
    }
    const displayCount = 24 + ((skip||0)*24);
    if (displayCount >= newMax) setReachedMax(true);
    setMax(newMax);
  }, [episodes]);

  
  //get the max speech count
  useEffect(() => {
    if (!speeches) return setListMax(undefined);
    let newMax = 0;
    if (bookFilter && !topicFilter && !search) {
      newMax = bookFilter.speechCount || 0;
    }
    else if (!bookFilter && topicFilter && !search) {
      newMax = topicFilter.speechCount || 0;
    }
    else {
      newMax = speeches[0]?.hitCount || 0;
    }
    const displayCount = 24 + ((skip||0)*24);
    if (displayCount >= newMax) setReachedListMax(true);
    setListMax(newMax);
  }, [lists]);
  

  

  //Fetch more episodes
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const fetchMoreEpisodes = async (e) => {
    e.preventDefault();
    // if (!max) return setReachedMax(true);
    
    const displayCount = 24 + ((skip||0)*24);
    if (max && displayCount >= max) return setReachedMax(true);
    let sort = (!search) ? "-publishedAt" : undefined;
    const bookIds = bookFilter ? [bookFilter.objectId] : undefined;
    const topicIds = topicFilter ? [topicFilter.objectId!] : undefined;
    await getEpisodes(undefined,{limit: 24, search, bookIds, topicIds, sort, skip: (skip||-1)+1, exclude: ["text"]}, true);
    setIsLoadingMore(false);
  }
  //Fetch more Lists
  const [listIsLoadingMore, setListIsLoadingMore] = useState<boolean>(false);
  const fetchMoreLists = async (e) => {
    e.preventDefault();
    const displayCount = 24 + ((listSkip||0)*24);
    if (max && displayCount >= max) return setReachedListMax(true);
    let sort = (!search) ? "-createdTime" : undefined;
    const bookId = bookFilter ? bookFilter.objectId: undefined;
    const topicId = topicFilter ? topicFilter.objectId! : undefined;
    await getLists(undefined, {search, bookId, topicId, limit: 24, sort, isSpeech: true, skip: (listSkip||-1)+1, exclude: ["episodes.text", "episodes.quote", "episodes.metaData"] }, true);
    setListIsLoadingMore(false);
  }
  // Handle Episode Listen
  const handleListenClick = (e, index: number) => {
    e.preventDefault();
    if (!episodes) return;
    if (episodes.length < 1) return;
      const startIndex = (typeof index === "number" && index - 3 >= 0) ? index -3 : 0;
      const endIndex = (typeof index === "number" && index + 4 <= episodes.length-1) ? index +4 : episodes.length;
      const newEpisodes = [...episodes].slice(startIndex, endIndex);
      let newIndex = newEpisodes.findIndex((ep) => {
        return ep.objectId === episodes[index].objectId;
      })
      player.setIsAutoPlay(true);
      player.setList({episodes: newEpisodes});
      player.setIndex(newIndex);
      router.push(newEpisodes[newIndex]?._path!);
  }
  //Handle add to list
  //List modal trigger
  const [inspectedEpisode, setInspectedEpisode] = useState<IEpisode|undefined>();
  const [presentList, dimissList] = useIonModal(ListModal, {
      onDismiss: (data: string, role: string) => {
        dimissList(data, role); 
        if (isModalOpen) isModalOpen.current = false;
      },
        isAddingEpisode: true,
        addEpisodeId: inspectedEpisode?.objectId,
    });
  

  // Handle Speech Listen
  const handleSpeechClick = (e, index: number, epIndex = 0) => {
    e.preventDefault();
    if (!speeches) return;
    if (speeches.length < 1) return;
      //Change speech to list
      let speech = speeches[index];
      const list: IList = {
        name: resolveLangString(speech?.title, lang),
        episodes: speech.episodes,
        description: speech.description,
      };
      player.setIsAutoPlay(true);
      player.setList(list);
      player.setIndex(epIndex);
      if (list.episodes[epIndex]?._path) router.push(list.episodes[epIndex]._path!);

  }

  
  const [presentDisplay, dismissDisplay] = useIonPopover(EpisodeDisplay, {
    onDismiss: (data: any, role: string) => dismissDisplay(data, role),
  });

  const [presentMode, dismissMode] = useIonPopover(SearchMode, {
    onDismiss: (data: any, role: string) => dismissMode(data, role),
  });

  let modeName = "Search All";
  if (mode === "episodes") modeName = "Search Episodes";
  if (mode === "speeches") modeName = "Search Speeches";
  let hasFilter = false;
  if (topicFilter) hasFilter = true;
  else if (bookFilter) hasFilter = true;
  else if (mode === "episodes") hasFilter = true;
  else if (mode === "speeches") hasFilter = true;
  else if (search) hasFilter = true;

  
  useIonViewDidLeave(() => {
    setBooks(undefined);
    setLists(undefined);
    setTopics(undefined);
    setEpisodes(undefined);
  });

  //Render Topic Cards
  const topicCards = useMemo(() => {
    if (!topics) return;
  
    return topics.map((topic, index) => (
      <TopicCard
        size={topicWidth}
        topic={topic}
        index={index}
        key={topic?.objectId}
        customOnClick={(e) => {
          topicClickHandler(e, topic);
        }}
      />
    ));
  }, [topics, topicWidth, topicClickHandler]);

  //Episode List Component
  const episodeListItems = useMemo(() => {
    if (!episodes || display === "quote" || display === "card") return;
  
    return episodes.map((_episode, index) => {
      let episode = _episode;
  
      return (
        <EpisodeListItem
          episode={episode}
          onPlay={(e) => handleListenClick(e, index)}
          onAdd={(e: any) => {
            if (!user?.objectId)
              return router.push("/signin?message=Log in to save lists");
            setInspectedEpisode(episode);
            presentList({
              onDidDismiss: (e: CustomEvent) => {
                setInspectedEpisode(undefined);
              },
            });
          }}
          key={"epresult-" + episode.objectId}
        />
      );
    });
  }, [episodes, display, handleListenClick, user, router, presentList]);

  const episodeQuotes = useMemo(() => {
    if (!episodes) return;
  
    return episodes.map((episode, index) => {
      const publishedAt = episode.publishedAt!;
      const oneWeekAgo = Date.now() - publishedAt > 6.048e+8;
  
      return (
        <SwiperSlide key={"ephero-" + episode.objectId}>
          <Hero
            subtitle={episode._quote}
            mainButtonText={"Listen"}
            mainButtonIcon={playCircle}
            onClickMain={(e) => handleListenClick(e, index)}
            subButtonText={"List"}
            subButtonIcon={addCircleOutline}
            onClickSub={(e: any) => {
              if (!user?.objectId)
                return router.push("/signin?message=Log+in+to+save+lists");
              setInspectedEpisode(episode);
              presentList({
                onDidDismiss: (e: CustomEvent) => {
                  setInspectedEpisode(undefined);
                },
              });
            }}
            overlayColor={"rgba(0,0,0,.6)"}
            bgImageUrl={episode.imageUrl}
            postImageUrl={episode._bookImageUrl}
            postText={episode._fullTitle}
            scrollIsHidden
            isQuote
          />
        </SwiperSlide>
      );
    });
  }, [episodes, handleListenClick, user, router, presentList]);


  const episodeCards = useMemo(() => {
    if (display !== "card" || !episodes) return;
  
    return (
      <CardList spaceBetween={10} setItemWidth={setEpisodeWidth} idealWidth={180}>
        {episodes.map((episode, index) => (
          <EpisodeCard
            size={episodeWidth}
            list={{ episodes }}
            key={"epcard-" + episode.objectId}
            index={index}
            episode={episode}
            customClickHandler={(e) => {
              handleListenClick(e, index);
            }}
          />
        ))}
      </CardList>
    );
  }, [display, episodes, episodeWidth, handleListenClick]);


  //Speech List Item
  const speechListItems = useMemo(() => {
    if (!speeches) return;
  
    return speeches.map((speech, index) => (
      <SpeechListItem
        key={"speech-" + speech.objectId}
        list={speech}
        onPlay={(e) => {
          handleSpeechClick(e, index);
        }}
      />
    ));
  }, [speeches, handleSpeechClick]);
  

  //Render component

  return (
  <IonPage>
    <IonHeader>
      <Toolbar>
        {/* <div className="flex justify-center w-full"> */}
        <IonButton 
          fill="clear" 
          color="dark"
          onClick={(e: any) => presentMode({
            onDidDismiss: (e: CustomEvent) => setMode(e.detail.role),
          })}
        >
          <IonIcon icon={filter} slot={'start'} />
          {modeName}
        </IonButton>
        {/* </div> */}
      </Toolbar>
      <IonToolbar>
          <IonSearchbar 
          ref={searchBar} 
          animated 
          show-clear-button="focus" 
          placeholder={'Search...'} 
          debounce={500} 
          mode={'ios'} 
          onIonChange={(e)=>{searchChangeHandler(e)}}
        />

      </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col p-4 pt-4 sm:p-10 sm:pt-6">
        
        
          <div className='flex justify-center w-full'>
              <div className="flex flex-col w-full" style={{maxWidth:"768px"}}>
                <div>
                  {hasFilter &&
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm italic text-medium">By Book</span>
                    {bookFilter ?
                      <IonChip outline onClick={(e) => removeBookHandler(e)}>
                        <IonLabel>{resolveLangString(bookFilter.title, lang)}</IonLabel>
                        <IonIcon icon={closeCircle}></IonIcon>
                      </IonChip>
                      :
                      <IonSelect 
                        interface="action-sheet" 
                        value={"All Books"}
                        onIonChange={(e)=>{
                          if (typeof e.detail.value !== "string") return;
                          if (e.detail.value === "All Books") return removeBookHandler(e);
                          const book = books?.find(b => b.objectId === e.detail.value)
                          if (book) bookClickHandler(e, book);
                        }}
                      >
                        
                        <IonSelectOption value="All Books">All Books</IonSelectOption>
                        {books && books.map((book) => { 
                          return (
                            <IonSelectOption 
                              key={book.objectId} 
                              value={book.objectId}
                            >
                              {resolveLangString(book.title, lang)}
                            </IonSelectOption>
                            )
                          })
                        }
                      </IonSelect>
                    }
                  </div>
                  }
                </div>
                <div>
                  {hasFilter &&
                  <div className="flex flex-wrap items-center space-x-2">
                      <span className="text-sm italic text-medium">By Topic</span>
                      {topicFilter ?
                        <IonChip outline onClick={(e) => removeTopicHandler(e)}>
                          <IonLabel>{resolveLangString(topicFilter.name, lang)}</IonLabel>
                          <IonIcon icon={closeCircle}></IonIcon>
                        </IonChip>
                      :
                      <IonSelect 
                        interface="action-sheet" 
                        value={"All Topics"}
                        onIonChange={(e)=>{
                          if (typeof e.detail.value !== "string") return;
                          if (e.detail.value === "All Topics") return removeTopicHandler(e);
                          const topic = topics?.find(b => b.objectId === e.detail.value)
                          if (topic) topicClickHandler(e, topic);
                        }}
                      >
                        
                        <IonSelectOption value="All Topics">All Topics</IonSelectOption>
                        {topics && topics.map((topic) => { 
                          return (
                            <IonSelectOption 
                              key={topic.objectId} 
                              value={topic.objectId}
                            >
                              {resolveLangString(topic.name, lang)}
                            </IonSelectOption>
                            )
                          })
                        }
                      </IonSelect>
                    }
                  </div>
                  }
                </div>
                <div className="-ml-3">
              </div>
            </div>
          </div>
          {(mode !== "speeches" && !hasFilter) && <TextDivider>Topics</TextDivider>}
          {(mode !== "speeches" && !hasFilter) && <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              <CardList spaceBetween={10} setItemWidth={setTopicWidth} idealWidth={180}>
                {topicCards}
                {(!topics && topicsIsLoading) && Array(12).fill(undefined).map((skel, index) => {
                    return (
                      <IonSkeletonText key={"topicskel-"+index} style={{width:topicWidth, height:topicWidth}} />
                    )
                  })
                }
              </CardList>
            </div>
          </div>}
          {(mode !== "speeches" && !hasFilter) && 
          <TextDivider>Books</TextDivider>
          }
          {(mode !== "speeches" && !hasFilter) && 
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              <CardList spaceBetween={10} setItemWidth={setBookWidth} idealWidth={376}>
                {books && books.map((book, index) => {
                  return (
                      <BookCard 
                        key={"lateps-"+book.objectId}
                        size={bookWidth}
                        book={book}
                        showTagline
                        onClick={(e) => {
                          bookClickHandler(e, book);
                        }}
                      />
                  )
                })
                }
              </CardList>
            </div>
          </div>
          }
          {mode !== "speeches" && <TextDivider>
            <div className="flex items-center">
              <span>{`${max ? max +" ": ""}Episodes`}</span>
              <IonButton 
                fill="clear" 
                color="dark" 
                onClick={(e: any) => presentDisplay({
                  onDidDismiss: (e: CustomEvent) => setDisplay(e.detail.role),
                })}
              >
                <IonIcon icon={displayIcon} slot={'start'} />
                <IonIcon icon={chevronDown} slot={'end'} />
              </IonButton>
            </div>
          </TextDivider>
          }
          {mode !== "speeches" && 
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-stretch w-full overflow-hidden rounded-lg" style={{maxWidth:display==="quote" ? undefined: "768px"}}>
              {display === "quote" &&
                  <SlideList >
                    {episodeQuotes}
                </SlideList>
                }
                {display === "card" && episodeCards}
                {episodeListItems}
                {(!episodes && episodesIsLoading) && Array(12).fill(undefined).map((skel, index) => {
                    return (
                      <IonSkeletonText key={"episodeskel-"+index} style={{width:"100%", height:"48px"}} />
                    )
                  })
                }
                {(!reachedMax) &&
                <IonButton
                  onClick={(ev) => {
                    setIsLoadingMore(true);
                    fetchMoreEpisodes(ev);
                  }}
                  disabled={isLoadingMore}
                  color="medium"
                  fill="clear"
                >
                  {isLoadingMore ?
                    "Loading..."
                  :
                    (max && episodes) ?
                      "Load More"
                    :
                      "Load Episodes"
                  }
                </IonButton>
                }
            </div>
          </div>
          }
          {mode !== "episodes" &&
          <>
            <TextDivider>
              <span>{`${listMax ? listMax +" ": ""}Speeches`}</span>
            </TextDivider>
            <div className='flex justify-center w-full'>
              <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
                {speechListItems}
                {!speeches && listsIsLoading && Array(12).fill(undefined).map((skel, index) => {
                      return (
                        <IonSkeletonText key={"speechskel-"+index} style={{width:"100%", height:"75px"}} />
                      )
                    })
                }
                {(!reachedListMax) &&
                <IonButton
                  onClick={(ev) => {
                    setListIsLoadingMore(true);
                    fetchMoreLists(ev);
                  }}
                  disabled={listIsLoadingMore}
                  color="medium"
                  fill="clear"
                >
                  {listIsLoadingMore ?
                    "Loading..."
                  :
                    
                    (listMax && speeches) ?
                      "Load More"
                    :
                      "Load Speeches"
                  }
                </IonButton>
                }
              </div>
            </div>
          </>
          }
        </div>
        <Copyright />
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default SearchPage


const EpisodeDisplay = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  return (    
    <IonContent class="ion-padding" >
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 mw-">
                <li>
                <IonButton fill="clear" expand="block" onClick={() => onDismiss(null, 'list')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={list}  color="medium" />
                        <IonLabel>List</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block"  onClick={() => onDismiss(null, 'card')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={grid}  color="medium" />
                        <IonLabel>Cards</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block"  onClick={() => onDismiss(null, 'quote')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonIcon icon={bulb} color="medium"/>
                        <IonLabel >Quotes</IonLabel>
                    </div>
                </IonButton>
                </li>

            </ul>
  </IonContent>  
  )
}



const SearchMode = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  return (    
    <IonContent class="ion-padding" >
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 mw-">
                <li>
                <IonButton fill="clear" expand="block" onClick={() => onDismiss(null, 'all')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonLabel>Search All</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block"  onClick={() => onDismiss(null, 'episodes')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonLabel>Episodes</IonLabel>
                    </div>
                </IonButton>
                </li>
                <li>
                <IonButton fill="clear" expand="block"  onClick={() => onDismiss(null, 'speeches')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonLabel >Speeches</IonLabel>
                    </div>
                </IonButton>
                </li>

            </ul>
      </IonContent>
  )
}