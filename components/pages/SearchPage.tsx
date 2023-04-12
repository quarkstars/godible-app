import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonSearchbar, IonButton, useIonViewDidEnter, IonIcon, IonChip, IonLabel, useIonPopover, IonFooter, useIonRouter, IonSelect, IonSelectOption } from '@ionic/react'
import { Player } from 'components/AppShell'
import { UserState } from 'components/UserStateProvider'
import { BookCard } from 'components/ui/BookCard'
import CardList from 'components/ui/CardList'
import Copyright from 'components/ui/Copyright'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import { PlayerControls } from 'components/ui/PlayerControls'
import SpeechListItem from 'components/ui/SpeechListItem'
import TextDivider from 'components/ui/TextDivider'
import Thumbnail from 'components/ui/Thumbnail'
import Toolbar from 'components/ui/Toolbar'
import { TopicCard } from 'components/ui/TopicCard'
import { sampleBooks, sampleEpisodes, sampleTopics } from 'data/sampleEpisodes'
import { userDefaultLanguage } from 'data/translations'
import { IBook, ITopic } from 'data/types'
import useBooks from 'hooks/useBooks'
import useEpisodes from 'hooks/useEpisodes'
import useTopics from 'hooks/useTopics'
import { bulb, card, chevronDown, closeCircle, filter, grid, list } from 'ionicons/icons'
import React, {useRef, useState, useContext, useEffect} from 'react'
import { resolveLangString } from 'utils/resolveLangString'

interface ISearchPageProps {
  //"all" (undefined) will only show topics in thumbnails and books in thumbnails
  //"topics" will only show topics in thumbnails
  //"episodes" will only show episodes with topic and book chips
  //"speeches" will only show speeches with topic and book chips
  defaultMode?: string, 
  defaultDisplay?: string, 



  defaultTopicId?: string,
  defaultBookId?: string,
  defaultQuery?: string,
}


const SearchPage = (props: ISearchPageProps) => {

	const router = useIonRouter();
  
  const player = useContext(Player);

  const {
    user
  } = useContext(UserState);
  const lang = (user.language) ? user.language : userDefaultLanguage;


  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [topicWidth, setTopicWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);
  const [display, setDisplay] = useState<string|undefined>(props.defaultDisplay);
  let displayIcon = list;
  if (display === "card") displayIcon = grid;
  if (display === "quote") displayIcon = bulb;

  //Get topics
  const {getTopics, topics} = useTopics();
  useEffect(() => {
    if (topics) return;
    getTopics(undefined, {sort: "+index"});
  }, []);

  //Selected Topic
  const [topicFilter, setTopicFilter] = useState<ITopic|undefined>();
  //Get the topics on the first load
  useEffect(() => {  
    console.log("TOPIC CHANGED", topics, router.routeInfo, !router.routeInfo)
    if (!topics || !router.routeInfo.search) return;
    if (topics.length < 1) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const topicSlug = urlParams.get("topic");
    let currentTopic = topics.find((top) => {
      return topicSlug === top.slug;
    });
    setTopicFilter(currentTopic);
  }, [topics, router.routeInfo.search]);
  // console.log("TOPIC CHANGED", topics, router.routeInfo.search, routeChecks)
  
  //Set topic to the url param (keeping book param if it exists)
  const topicClickHandler = (e, topic:ITopic) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const bookSlug = urlParams.get("book");
    let bookParam = (bookSlug) ? `&book=${bookSlug}` : "";
    router.push("/search?topic="+topic.slug+bookParam);
    setTopicFilter(topic);
  }
    //Set topic to the url param (keeping book param if it exists)
    const removeTopicHandler = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(router.routeInfo.search)
      const bookSlug = urlParams.get("book");
      let bookParam = (bookSlug) ? `&book=${bookSlug}` : "";
      router.push("/search?"+bookParam);
      setTopicFilter(undefined);
    }


  //Get books
  const {getBooks, books} = useBooks();
  useEffect(() => {
    if (books) return;
    getBooks(undefined, {sort: "+index"});
  }, []);

  //Selected Book
  const [bookFilter, setBookFilter] = useState<IBook|undefined>();
  //Get the books on the first load
  useEffect(() => {  
    console.log("BOOK CHANGED", books, router.routeInfo, !router.routeInfo)
    if (!books || !router.routeInfo.search) return;
    if (books.length < 1) return;
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const bookSlug = urlParams.get("book");
    let currentBook = books.find((top) => {
      return bookSlug === top.slug;
    });
    setBookFilter(currentBook);
  }, [books, router.routeInfo.search]);
  // console.log("TOPIC CHANGED", books, router.routeInfo.search, routeChecks)
  
  //Set book to the url param (keeping book param if it exists)
  const bookClickHandler = (e, book:IBook) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(router.routeInfo.search)
    const topicSlug = urlParams.get("topic");
    let topicParam = (topicSlug) ? `&topic=${topicSlug}` : "";
    router.push("/search?book="+book.slug+topicParam);
    setBookFilter(book);
  }
    //Set book to the url param (keeping book param if it exists)
    const removeBookHandler = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(router.routeInfo.search)
      const topicSlug = urlParams.get("topic");
      let topicParam = (topicSlug) ? `&topic=${topicSlug}` : "";
      router.push("/search?"+topicParam);
      setBookFilter(undefined);
    }


  //Focus search bar when entering the page
  const searchBar = useRef<HTMLIonSearchbarElement>(null)
  useIonViewDidEnter(async () => {
    if (!searchBar.current) return;
    setTimeout(async () => {await searchBar.current!.setFocus()}, 200);
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
  const {
    getEpisodes, 
    setEpisodes,
    isLoading: episodesIsLoading,
    error: episodesError,
    episodes,
    skip,
  } = useEpisodes();
  //Update episode list everytime parameters change
  useEffect(() => {
    const bookIds = bookFilter ? [bookFilter.objectId] : undefined;
    const topicIds = topicFilter ? [topicFilter.objectId!] : undefined;
    setMax(undefined);
    setReachedMax(false);
    setEpisodes(undefined);
    getEpisodes(undefined, {search, bookIds, topicIds, limit: 12,  exclude: ["text"]});
    
  }, [search, bookFilter, topicFilter])
  
  //get the max count
  useEffect(() => {
    if (!episodes) return setMax(undefined);
    if (bookFilter && !topicFilter && !search) return setMax(bookFilter.episodeCount);
    if (!bookFilter && topicFilter && !search) return setMax(topicFilter.episodeCount);
    setMax(episodes[0]?.hitCount)
  }, [episodes]);
  console.log("RESULTS", max)
  
  const fetchMoreEpisodes = (e) => {
    e.preventDefault();
    if (!max) return setReachedMax(true);
    const displayCount = 12 + ((skip||0)*12);
    if (displayCount >= max) return setReachedMax(true);
    const bookIds = bookFilter ? [bookFilter.objectId] : undefined;
    const topicIds = topicFilter ? [topicFilter.objectId!] : undefined;
    getEpisodes(undefined,{limit: 12, search, bookIds, topicIds, skip: (skip||0)+1, exclude: ["text"]}, true);
  }
  
  
  const [presentDisplay, dismissDisplay] = useIonPopover(EpisodeDisplay, {
    onDismiss: (data: any, role: string) => dismissDisplay(data, role),
  });

  const [mode, setMode] = useState<string|undefined>(props.defaultMode);
  const [presentMode, dismissMode] = useIonPopover(SearchMode, {
    onDismiss: (data: any, role: string) => dismissMode(data, role),
  });

  let modeName = "Search All";
  if (mode === "topics") modeName = "Select a Topic";
  if (mode === "episodes") modeName = "Search Episodes";
  if (mode === "speeches") modeName = "Search Speeches";
  let hasFilter = false;
  if (topicFilter) hasFilter = true;
  else if (bookFilter) hasFilter = true;
  else if (search) hasFilter = true;

  return (
  <IonPage>
    <IonHeader>
      <Toolbar>
        {/* <div className="flex justify-center w-full"> */}
        <IonButton 
          fill="clear" 
          color="dark"
          onClick={(e: any) => presentMode({
            event: e,
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
          onIonChange={(e)=>searchChangeHandler(e)}
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
                {topics && topics.map((topic, index) => {
                  return (
                    <TopicCard 
                      size={topicWidth}
                      topic={topic}
                      index={index}
                      key={topic?.objectId}
                      customOnClick={(e) => {topicClickHandler(e, topic)}}
                    />
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
                event: e,
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
            <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
                {episodes && episodes.map((_episode, index) => {
                let episode = _episode
                  return (
                      <EpisodeListItem 
                        episode={episode}  
                        key={"epresult-"+episode.objectId} 
                        // customSubText='...heres thd her'
                        // highlightStrings={['heres']}
                      />
                  )
                })}
                {(!reachedMax && max) &&
                <IonButton
                  onClick={(ev) => {
                    fetchMoreEpisodes(ev);
                  }}
                  disabled={reachedMax}
                  color="medium"
                  fill="clear"
                >
                  Load More
                </IonButton>
                }
            </div>
          </div>
          }
          <TextDivider>Speeches</TextDivider>
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
              <SpeechListItem 
                list={{name: "How to Gain Spiritual Help", episodes: sampleEpisodes, metaData: {defaultLanguage: "english", english: "1975\nWashington Monument\nSun Myung Moon"}}}
              />
              
              <SpeechListItem 
                list={{name: "Where Do You Stand?", episodes: [sampleEpisodes[5]], metaData: {defaultLanguage: "english", english: "1975\nWashington Monument\nSun Myung Moon"}}}
              />
              
              <SpeechListItem 
                list={{name: "Boldly Fulfill God's Expectations", episodes: [sampleEpisodes[6]], metaData: {defaultLanguage: "english", english: "1975\nWashington Monument\nSun Myung Moon"}}}
              />
            </div>
          </div>
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
                <li>
                <IonButton fill="clear" expand="block"  onClick={() => onDismiss(null, 'topics')} >
                    <div className="flex items-center justify-start w-full space-x-2">
                        <IonLabel >Topics</IonLabel>
                    </div>
                </IonButton>
                </li>

            </ul>
      </IonContent>
  )
}