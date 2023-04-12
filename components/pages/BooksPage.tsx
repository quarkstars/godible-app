import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks } from 'data/sampleEpisodes'
import useBooks from 'hooks/useBooks'
import React, {useEffect} from 'react'

const BooksPage:React.FC = () => {
	const router = useIonRouter();
  const {getBooks, books} = useBooks();
  //Get Books
  useEffect(() => {
    if (books) return;
    getBooks(undefined, {sort: "+index"});
  }, []);
  
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
        <div className='flex justify-center w-full'>
          <div className="flex flex-col p-4 pt-4 space-y-4 sm:p-10 sm:pt-6" style={{maxWidth: "1200px"}}>
          {books && books.map((book, index) => {
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
              <div className='w-full py-5 text-center text-medium'>{`Copyright © ${new Date().getFullYear()}, FFWPU USA. All Rights Reserved.`}</div>

              </div>        
            </div>

      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default BooksPage