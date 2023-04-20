import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { BookCard } from 'components/ui/BookCard'
import { PlayerControls } from 'components/ui/PlayerControls'
import Toolbar from 'components/ui/Toolbar'
import { sampleBooks } from 'data/sampleEpisodes'
import React from 'react'
import SearchPage from './SearchPage'

const SpeechesPage:React.FC = () => {

  return (
    <SearchPage defaultMode="speeches" isNotInitSearch />
  )
}

export default SpeechesPage