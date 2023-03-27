import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import Hero from 'components/ui/Hero';
import SlideList from 'components/ui/SlideList';
import Toolbar from 'components/ui/Toolbar';
import { add, addCircleOutline, arrowForwardOutline, logIn, logInOutline, playCircle } from 'ionicons/icons'
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState, useContext, useEffect, useRef } from 'react'
import Thumbnail from 'components/ui/Thumbnail';
import { EpisodeCard } from 'components/ui/EpisodeCard';
import { IEpisode } from 'data/types';
import { sampleBooks, sampleEpisodes, sampleTopics } from 'data/sampleEpisodes';
import { PlayerControls } from 'components/ui/PlayerControls';
import { Player, UserState } from 'components/AppShell';
import useEpisodes from 'hooks/useEpisodes';
import { BookCard } from 'components/ui/BookCard';
import Copyright from 'components/ui/Copyright';

const HomePage:React.FC = () => {


	const router = useIonRouter();

  const {user} = useContext(UserState);
  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [topicWidth, setTopicWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);
  
  //TODO: Attempting to prevent reordering by the list reorderer
  const player = useContext(Player);
  const {appendEpisodeStrings} = useEpisodes();
  useEffect(() => {
    setLatestEpisodes(JSON.parse(latestEpisodesString.current));
  }, [player.list])
  const [latestEpisodes, setLatestEpisodes] = useState(sampleEpisodes);
  const latestEpisodesString = useRef(JSON.stringify(sampleEpisodes));

      // Handle Click
      const handleListenClick = (e, index: number) => {
          e.preventDefault();
          player.setIsAutoPlay(true);
          player.setList({episodes: latestEpisodes});
          player.setIndex(index);
          router.push(appendEpisodeStrings(latestEpisodes[index])._path!);
      }

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
          {!user.objectId && 
          <SwiperSlide>
            <Hero 
              title={"Let God's Word Be Heard"}
              subtitle={"Playable Hoon Dok Hae"}
              mainButtonText={"Sign Up"}
              // mainButtonIcon={listener}
              onClickMain={() => router.push("/signup")}
              subButtonText={"Log in"}
              subButtonIcon={arrowForwardOutline}
              // isMainClear={} Listen To List
              onClickSub={() => router.push("/signin")}
              overlayColor={"linear-gradient(90deg, rgba(97,219,146,.2) 0%, rgba(0,255,239,.2) 100%)"}
              bgImageUrl={"/img/godible-bg.jpg"} //"/logo/godible.png"
              // postImageUrl={} 
              // postText={}
              // scrollIsHidden={}
              // isQuote={}
              preImageUrl={"/logo/godible-logo-white.png"}
              postText={"Now available on Android, iOS, or on the web"}
              // preText={}
            />
          </SwiperSlide>
          }
            {latestEpisodes.map((_episode, index) => {
        //TODO: Test again
              const episode = appendEpisodeStrings(_episode)
              let createdAt = episode.createdAt || Date.now();
              const createdTime = Math.floor(new Date(createdAt).getTime());
              const day = new Date(createdAt).getDay();
              const oneWeekAgo = Date.now() - createdTime > 6.048e+8;
              let pretext = (!index && Date.now() - createdTime < 8.64e+7) ? "Today's Episode" : `${oneWeekAgo ? "Last": ""} ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(day)}'s Episode`
              return (
              <SwiperSlide key={"lateps-"+episode.objectId}>
                <Hero 
                  // title={"Let God's Word Be Heard"}
                  subtitle={episode._quote}
                  mainButtonText={"Listen"}
                  mainButtonIcon={playCircle}
                  onClickMain={(e) => handleListenClick(e, index)}
                  subButtonText={"List"}
                  subButtonIcon={addCircleOutline}
                  onClickSub={() => router.push("/")}
                  overlayColor={"rgba(0,0,0,.6)"}
                  bgImageUrl={episode.imageUrl}
                  postImageUrl={episode._bookImageUrl} 
                  postText={episode._fullTitle}
                  isQuote
                  // preImageUrl={"/logo/godible-logo-white.png"}
                  preText={pretext}
                />
              </SwiperSlide>
              )
            })
            }

          <SwiperSlide>
            <Hero></Hero>

          </SwiperSlide>
        </SlideList>
        <div className="flex flex-col p-4 sm:p-10">
          <div className="flex flex-row items-center w-full space-x-5">
            <h2 className="mt-0 text-2xl">
              Latest Episodes
            </h2>
            <IonButton fill="clear" color="medium">
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setEpisodeWidth} idealWidth={225}>
            {latestEpisodes.map((episode, index) => {
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

        </div>
        <div className="flex flex-col p-4 sm:p-10">
          <div className="flex flex-row items-center w-full space-x-5">
            <h2 className="mt-0 text-2xl">
              Topics
            </h2>
            <IonButton fill="clear" color="medium">
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setTopicWidth} idealWidth={170}>
                {sampleTopics.map((topic, index) => {
                  return (
                    <SwiperSlide key={"topic-"+topic.name+"-"+index}>
                      <Thumbnail 
                        size={topicWidth}
                        imageUrl={topic.imageUrl}
                        overlayColor='#000000'
                        key={index}
                      >
                      <span className="text-xl font-bold text-white w-full text-center px-2">{topic.name?.english}</span>
                      </Thumbnail>
                </SwiperSlide>
              )
            })
            }
          </SlideList>

        </div>
        <div className="flex flex-col p-4 sm:p-10">
          <div className="flex flex-row items-center w-full space-x-5">
            <h2 className="mt-0 text-2xl">
              Books
            </h2>
            <IonButton fill="clear" color="medium">
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setBookWidth} idealWidth={376}>
            {sampleBooks.map((book, index) => {
              return (
                <SwiperSlide key={"lateps-"+book.objectId}>
                  <BookCard 
                    size={bookWidth}
                    book={book}
                    showTagline
                    onClick={() => {
                      if (book?.slug) router.push("/book/"+book?.slug)
                    }}
                  />
              </SwiperSlide>
              )
            })
            }
          </SlideList>

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

export default HomePage