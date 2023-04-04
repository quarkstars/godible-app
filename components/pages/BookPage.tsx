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
import React, {useContext, useState} from 'react'

const BookPage:React.FC = () => {      
  
	const router = useIonRouter();
  const player = useContext(Player);
  const [goto, setGoto] = useState<string>("1")
  const handleListenClick = (e, index: number) => {
    e.preventDefault();
    setGoto(e.detail.value)
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
        <div className="flex justify-center w-full">
          <div className="flex flex-col p-4 pt-4 sm:p-10 sm:pt-6" style={{maxWidth:"1200px"}}>

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
            
            <div className='flex justify-center w-full'>
              <div className="flex flex-col items-stretch w-full" style={{maxWidth:"768px"}}>
                  <TextDivider>30 Episodes</TextDivider>
                  <div className="flex justify-between w-full">
                    <div className="flex items-center w-full space-x-2">
                    <span className="pl-4 font-medium uppercase">Go to</span>
                    <IonSelect 
                      value={goto} 
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