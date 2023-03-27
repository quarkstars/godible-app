import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks } from 'data/sampleEpisodes'
import React from 'react'

const BooksPage:React.FC = () => {
	const router = useIonRouter();

  let book = sampleBooks[0]
  return (
    <IonPage>
      <IonHeader>
        <Toolbar>
          <IonTitle>
            Books
          </IonTitle>
        </Toolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col p-4 pt-4 space-y-4 sm:p-10 sm:pt-6">
        {sampleBooks.map((book, index) => {
              return (
                <BookCard 
                  book={book} 
                  key={book.objectId}
                  isFullWidth
                  showTagline
                  showDescription
                  showBuyLink
                  showEpisodesLink
                  showReaders
                  onClick={() => {
                    if (book?.slug) router.push("/book/"+book?.slug)
                  }}
                />

              )
            })
            }
            </div>
        <div className='text-medium w-full text-center py-5'>{`Copyright © ${new Date().getFullYear()}, FFWPU USA. All Rights Reserved.`}</div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default BooksPage