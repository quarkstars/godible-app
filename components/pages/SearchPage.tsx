import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonSearchbar, IonButton, useIonViewDidEnter, IonIcon, IonChip, IonLabel, useIonPopover } from '@ionic/react'
import { Player } from 'components/AppShell'
import { BookCard } from 'components/ui/BookCard'
import CardList from 'components/ui/CardList'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import SpeechListItem from 'components/ui/SpeechListItem'
import TextDivider from 'components/ui/TextDivider'
import Thumbnail from 'components/ui/Thumbnail'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks, sampleEpisodes } from 'data/sampleEpisodes'
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


const SearchPage:React.FC = (props: ISearchPageProps) => {

  
  const player = useContext(Player);
  const {appendEpisodeStrings} = useEpisodes();

  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
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
        {/* <div className="w-full flex justify-center"> */}
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
        
          <div className='w-full flex justify-center'>
              <div className="flex flex-col w-full" style={{maxWidth:"768px"}}>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="italic text-medium text-sm">By Book</span>
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

                  <div className="flex items-center space-x-2 flex-wrap">
                      <span className="italic text-medium text-sm">By Topic</span>
                      <IonChip outline>
                        <IonLabel>Selected Topic</IonLabel>
                        <IonIcon icon={closeCircle}></IonIcon>
                      </IonChip>
                      
                    <IonChip outline>God</IonChip>
                    <IonChip outline>Love</IonChip>
                    <IonChip outline>Joy</IonChip>
                    <IonChip outline>God</IonChip>
                    <IonChip outline>Love</IonChip>
                    <IonChip outline>Joy</IonChip>
                  </div>
                </div>
                <div className="-ml-3">
              </div>
            </div>
          </div>
          <TextDivider>Books</TextDivider>
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
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
          <TextDivider>Topics</TextDivider>
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-center" style={{maxWidth:"768px"}}>
              <CardList spaceBetween={10} setItemWidth={setEpisodeWidth} idealWidth={150}>
                {sampleEpisodes.map((episode, index) => {
                  return (
                    <Thumbnail 
                      size={episodeWidth}
                      imageUrl={episode.imageUrl}
                      overlayColor='#000000'
                      key={index}
                    >
                      <span className="text-2xl font-bold text-white">Topic</span>
                    </Thumbnail>
                  )
                })
                }
              </CardList>
            </div>
          </div>
          <TextDivider>
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
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-stretch" style={{maxWidth:"768px"}}>
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
          <TextDivider>Speeches</TextDivider>
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-stretch" style={{maxWidth:"768px"}}>
              <SpeechListItem 
                list={{name: "How to Gain Spiritual Help", episodes: sampleEpisodes, metaData: {defaultLanguage: "english", english: "1975\nWashington Monument\nSun Myung Moon"}}}
              />
            </div>
          </div>
        </div>
      </IonContent>
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