import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonSearchbar, IonButton, useIonViewDidEnter, IonIcon, IonChip, IonLabel } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import CardList from 'components/ui/CardList'
import TextDivider from 'components/ui/TextDivider'
import Thumbnail from 'components/ui/Thumbnail'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks, sampleEpisodes } from 'data/sampleEpisodes'
import { chevronDown, closeCircle, filter, list } from 'ionicons/icons'
import React, {useRef, useState} from 'react'

interface ISearchPageProps {
  //"all" (undefined) will only show topics in thumbnails and books in thumbnails
  //"topics" will only show topics in thumbnails
  //"episodes" will only show episodes with topic and book chips
  //"speeches" will only show speeches with topic and book chips
  defaultMode?: string, 



  defaultTopicId?: string,
  defaultBookId?: string,
  defaultQuery?: string,
}



const SearchPage:React.FC = (props: ISearchPageProps) => {

  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);

  const searchBar = useRef<HTMLIonSearchbarElement>(null)
  useIonViewDidEnter(async () => {
    if (!searchBar.current) return;
    // await searchBar.current!.setFocus()
    let timeout = setTimeout(async () => {await searchBar.current!.setFocus()}, 200);
    // return clearTimeout(timeout)
  }, [searchBar.current]);
  
  
  return (
  <IonPage>
    <IonHeader>
      <Toolbar>
        {/* <div className="w-full flex justify-center"> */}
        <IonButton fill="clear" color="dark">
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

          <TextDivider>Books</TextDivider>
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
          <TextDivider>Topics</TextDivider>
          <CardList spaceBetween={10} setItemWidth={setEpisodeWidth} idealWidth={185}>
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
          <TextDivider>
            <div className="flex items-center">
              <span>Episodes</span>
              <IonButton fill="clear" color="dark">
                <IonIcon icon={list} slot={'start'} />
                <IonIcon icon={chevronDown} slot={'end'} />
              </IonButton>
            </div>
          </TextDivider>
          <TextDivider>Speeches</TextDivider>
        </div>
      </IonContent>
  </IonPage>
  )
}

export default SearchPage