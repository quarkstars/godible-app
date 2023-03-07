import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import Hero from 'components/ui/Hero';
import SlideList from 'components/ui/SlideList';
import Toolbar from 'components/ui/Toolbar';
import { logInOutline } from 'ionicons/icons'
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState } from 'react'
import Thumbnail from 'components/ui/Thumbnail';
import { EpisodeCard } from 'components/ui/EpisodeCard';
import { IEpisode } from 'data/types';
import { sampleEpisodes } from 'data/sampleEpisodes';
import { PlayerControls } from 'components/ui/PlayerControls';

const HomePage:React.FC = () => {


	const router = useIonRouter();

  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  console.log("sampleEpisodes", sampleEpisodes)

  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Welcome
        </IonTitle>
      </Toolbar>
      </IonHeader>
      <IonContent>
      <div className="flex flex-col justify-start w-full min-h-full">
        <SlideList >
          <SwiperSlide>
            <Hero></Hero>

          </SwiperSlide>
          <SwiperSlide>
            <Hero></Hero>

          </SwiperSlide>
        </SlideList>
        <div className="flex flex-col p-4 sm:p-10">
          <div className="flex flex-row items-center w-full space-x-5">
            <h2 className="mt-0 text-2xl">
              Latest Episodes
            </h2>
            <IonButton fill="clear">
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setEpisodeWidth} idealWidth={225}>
            {sampleEpisodes.map((episode, index) => {
              return (
                <SwiperSlide key={"lateps-"+episode.objectId}>
                  <EpisodeCard 
                    size={episodeWidth}
                    list={{episodes: sampleEpisodes}}
                    index={index}
                    episode={episode}
                  />
              </SwiperSlide>
              )
            })
            }
          </SlideList>
          <SlideList isCarousel spaceBetween={5} setItemWidth={setEpisodeWidth} idealWidth={225}>
            {sampleEpisodes.map((episode, index) => {
              return (
                <SwiperSlide key={"latesteps-"+episode.objectId}>
                  {index}
              </SwiperSlide>
              )
            })
            }
          </SlideList>
        </div>
      </div>
      </IonContent>
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  )
}

export default HomePage