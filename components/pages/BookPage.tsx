import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks } from 'data/sampleEpisodes'
import React from 'react'

const BookPage:React.FC = () => {

  let book = sampleBooks[0]
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
        </div>
        <div id="episodes"></div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default BookPage