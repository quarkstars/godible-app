import { IonContent, IonFooter, IonHeader, IonPage, IonSkeletonText, IonTitle, IonToolbar, useIonRouter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks } from 'data/sampleEpisodes'
import useBooks from 'hooks/useBooks'
import React, {useEffect, useMemo} from 'react'

const BooksPage:React.FC = () => {
	const router = useIonRouter();
  const {getBooks, books, isLoading, setBooks} = useBooks();
  //Get Books
  useIonViewWillEnter(() => {
    if (books) return;
    getBooks(undefined, {sort: "+index"});
  });  //Clear books when leaving
  useIonViewDidLeave(() => {
    setBooks(undefined)
  });
  

  //Books page
  const bookCards = useMemo(() => {
    if (!books) return;
  
    return books.map((book, index) => (
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
          if (book?.slug) router.push("/book/" + book?.slug);
        }}
      />
    ));
  }, [books, router]);

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
          <div className="flex flex-col w-full p-4 pt-4 space-y-4 sm:p-10 sm:pt-6" style={{maxWidth: "1200px"}}>
            {(!books && isLoading) &&   Array(4).fill(undefined).map((skel, index) => {
                    return (
                      <IonSkeletonText key={"episodeskel-"+index} style={{width:"100%", height:"348px"}} />
                    )
                  })
                }
              {bookCards}

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