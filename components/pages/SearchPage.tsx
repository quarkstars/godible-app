import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonSearchbar, IonButton, useIonViewDidEnter, IonIcon, IonChip, IonLabel, useIonPopover, IonFooter } from '@ionic/react'
import { Player } from 'components/AppShell'
import { BookCard } from 'components/ui/BookCard'
import CardList from 'components/ui/CardList'
import Copyright from 'components/ui/Copyright'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import { PlayerControls } from 'components/ui/PlayerControls'
import SpeechListItem from 'components/ui/SpeechListItem'
import TextDivider from 'components/ui/TextDivider'
import Thumbnail from 'components/ui/Thumbnail'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks, sampleEpisodes, sampleTopics } from 'data/sampleEpisodes'
import useEpisodes from 'hooks/useEpisodes'
import { bulb, card, chevronDown, closeCircle, filter, grid, list } from 'ionicons/icons'
import React, {useRef, useState, useContext} from 'react'

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

  
  const player = useContext(Player);
  const {appendEpisodeStrings} = useEpisodes();

  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [topicWidth, setTopicWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);
  const [display, setDisplay] = useState<string|undefined>(props.defaultDisplay);
  let displayIcon = list;
  if (display === "card") displayIcon = grid;
  if (display === "quote") displayIcon = bulb;

  const searchBar = useRef<HTMLIonSearchbarElement>(null)
  useIonViewDidEnter(async () => {
    if (!searchBar.current) return;
    // await searchBar.current!.setFocus()
    let timeout = setTimeout(async () => {await searchBar.current!.setFocus()}, 200);
    // return clearTimeout(timeout)
  }, [searchBar.current]);
  
  
  const [presentDisplay, dismissDisplay] = useIonPopover(EpisodeDisplay, {
    onDismiss: (data: any, role: string) => dismissDisplay(data, role),
  });

  const [mode, setMode] = useState<string|undefined>(props.defaultMode);
  const [presentMode, dismissMode] = useIonPopover(SearchMode, {
    onDismiss: (data: any, role: string) => dismissMode(data, role),
  });


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
          Search All
        </IonButton>
        {/* </div> */}
      </Toolbar>
      <IonToolbar>
        <IonSearchbar ref={searchBar} animated show-clear-button="focus" placeholder={'Search...'} debounce={500} mode={'ios'} />

      </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col p-4 pt-4 sm:p-10 sm:pt-6">
        
          <div className='flex justify-center w-full'>
              <div className="flex flex-col w-full" style={{maxWidth:"768px"}}>
                <div>
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm italic text-medium">By Book</span>
                    <IonChip outline>
                      <IonLabel>Selected Book</IonLabel>
                      <IonIcon icon={closeCircle}></IonIcon>
                    </IonChip>
                  
                  {/* <IonChip outline>ChamBumo Gyeong</IonChip>
                  <IonChip outline>As a Peace Loving Global Citizen</IonChip>
                  <IonChip outline>Cheon Seong Gyeong</IonChip>
                  <IonChip outline>Cheon Seong Gyeong</IonChip> */}
                  </div>
                </div>
                <div>

                  <div className="flex flex-wrap items-center space-x-2">
                      <span className="text-sm italic text-medium">By Topic</span>
                      <IonChip outline>
                        <IonLabel>Selected Topic</IonLabel>
                        <IonIcon icon={closeCircle}></IonIcon>
                      </IonChip>
                      
                    <IonChip outline>Heavenly Parent</IonChip>
                    <IonChip outline>Love</IonChip>
                    <IonChip outline>Joy</IonChip>
                    <IonChip outline>Love</IonChip>
                    <IonChip outline>True Parents</IonChip>
                    <IonChip outline>History</IonChip>
                    <IonChip outline>Faith</IonChip>
                  </div>
                </div>
                <div className="-ml-3">
              </div>
            </div>
          </div>
          {mode !== "speeches" && <TextDivider>Topics</TextDivider>}
          {mode !== "speeches" && <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              <CardList spaceBetween={10} setItemWidth={setTopicWidth} idealWidth={150}>
                {sampleTopics.map((topic, index) => {
                  return (
                    <Thumbnail 
                      size={topicWidth}
                      imageUrl={topic.imageUrl}
                      overlayColor='#000000'
                      key={index}
                    >
                      <span className="w-full px-2 text-2xl font-bold text-center text-white">{topic.name?.english}</span>
                    </Thumbnail>
                  )
                })
                }
              </CardList>
            </div>
          </div>}
          {mode !== "speeches" && 
          <TextDivider>Books</TextDivider>
          }
          {mode !== "speeches" && 
          <div className='flex justify-center w-full'>
            <div className="flex flex-col items-center w-full" style={{maxWidth:"768px"}}>
              <CardList spaceBetween={10} setItemWidth={setBookWidth} idealWidth={376}>
                {sampleBooks.map((book, index) => {
                  return (
                      <BookCard 
                        key={"lateps-"+book.objectId}
                        size={bookWidth}
                        book={book}
                        showTagline
                        onClick={() => {

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
              <span>Episodes</span>
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
                {sampleEpisodes.map((_episode, index) => {
                let episode = appendEpisodeStrings(_episode)
                  return (
                      <EpisodeListItem 
                        episode={episode}  
                        key={"epresult-"+episode.objectId} 
                        // customSubText='...heres thd her'
                        // highlightStrings={['heres']}
                      />
                  )
                })}
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