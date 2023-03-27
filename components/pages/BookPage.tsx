import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonItemDivider, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { Player } from 'components/AppShell'
import { BookCard } from 'components/ui/BookCard'
import Copyright from 'components/ui/Copyright'
import EpisodeListItem from 'components/ui/EpisodeListItem'
import { PlayerControls } from 'components/ui/PlayerControls'
import TextDivider from 'components/ui/TextDivider'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks, sampleEpisodes } from 'data/sampleEpisodes'
import useEpisodes from 'hooks/useEpisodes'
import { search } from 'ionicons/icons'
import React, {useContext} from 'react'

const BookPage:React.FC = () => {      
  
	const router = useIonRouter();
  const player = useContext(Player);
  const handleListenClick = (e, index: number) => {
    e.preventDefault();
    player.setIsAutoPlay(true);
    player.setList({episodes: sampleEpisodes});
    player.setIndex(index);
    router.push(appendEpisodeStrings(sampleEpisodes[index])._path!);
}

  const {appendEpisodeStrings} = useEpisodes();
  let book = sampleBooks[0];
  return (
    <IonPage>
      <IonHeader>
        <Toolbar>
          <IonTitle>
            Chambumo Gyeong
          </IonTitle>
        </Toolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col p-4 pt-4 sm:p-10 sm:pt-6">

          <BookCard 
            book={book} 
            isFullWidth
            showTagline
            showDescription
            showAuthor
            showMetaData
            showBuyLink
            showReaders
          />
          
          <div className='w-full flex justify-center'>
            <div className="flex flex-col w-full items-stretch" style={{maxWidth:"768px"}}>
                <TextDivider>30 Episodes</TextDivider>
                <div className="w-full flex justify-between">
                  <div className="w-full flex items-center space-x-2">
                  <span className="uppercase font-medium pl-4">Go to</span>
                  <IonSelect 
                    defaultValue="1" 
                    interface="action-sheet" 
                    onIonChange={(e)=>{
                      if (typeof e.detail.value !== "string") return;
                        handleListenClick(e, Number(e.detail.value)-1);
                    }}
                  >
                      <IonSelectOption value="1">Episode 1</IonSelectOption>
                      <IonSelectOption value="2">Episode 2</IonSelectOption>
                      <IonSelectOption value="3">Episode 3</IonSelectOption>
                      <IonSelectOption value="4">Episode 4</IonSelectOption>
                      <IonSelectOption value="5">Episode 5</IonSelectOption>
                  </IonSelect>
                  </div>
                <IonButton fill="clear">
                  <IonIcon icon={search} slot="start" />
                  Search Book
                </IonButton>
                </div>
                {sampleEpisodes.map((_episode, index) => {
                let episode = appendEpisodeStrings(_episode)
                  if (index > 4) return <></>
                  return (
                      <EpisodeListItem 
                        episode={episode}  
                        key={"epresult-"+episode.objectId} 
                        onPlay={(e) => {
                          handleListenClick(e, index);
                        }}
                        // customSubText='...heres thd her'
                        // highlightStrings={['heres']}
                      />
                  )
                })}
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

export default BookPage