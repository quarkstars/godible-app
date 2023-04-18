import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonModal, useIonRouter } from '@ionic/react'
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
import { Player } from 'components/AppShell';
import useEpisodes from 'hooks/useEpisodes';
import { BookCard } from 'components/ui/BookCard'; 
import Copyright from 'components/ui/Copyright';
import useBooks from 'hooks/useBooks';
import useTopics from 'hooks/useTopics'; 
import useLists from 'hooks/useLists';
import useNotes from 'hooks/useNotes';
import { UserState } from 'components/UserStateProvider';
import { TopicCard } from 'components/ui/TopicCard';
import ListModal from 'components/ui/ListModal';

const HomePage:React.FC = () => {


	const router = useIonRouter();

  const {user} = useContext(UserState);
  const [episodeWidth, setEpisodeWidth] = useState<number>(148);
  const [topicWidth, setTopicWidth] = useState<number>(148);
  const [bookWidth, setBookWidth] = useState<number>(376);
  
  //TODO: Attempting to prevent reordering by the list reorderer
  const player = useContext(Player);
  const {
    appendEpisodeStrings, 
    getEpisodes, 
    isLoading: episodesIsLoading,
    error: episodesError,
    episodes,
  } = useEpisodes();
  const {getBooks, books} = useBooks();
  const {getTopics, topics} = useTopics();
  const {getLists, lists, postList, reorderEpisodes, reorderLists, addEpisodeToList, deleteList, removeEpisodeFromList} = useLists();
  const {getNotes, postNote, deleteNote, postNoteFeedback} = useNotes();
  //Get episodes
  useEffect(() => {
    // if (!user.objectId) return;
    console.log("GET EPISODES AGAIN!")
    getEpisodes(undefined, {limit: 12, sort:"-publishedAt", exclude: ["text"]});
    // quickTest();
  }, [user.objectId]);

  //Get topics
  useEffect(() => {
    if (topics) return;
    getTopics(undefined, {limit: 12, sort: "+index"});
  }, []);
  //Get Books
  useEffect(() => {
    if (books) return;
    getBooks(undefined, {limit: 12, sort: "+index"});
  }, []);

  // useEffect(() => {
  //   setLatestEpisodes(JSON.parse(latestEpisodesString.current));
  // }, [player.list])
  // const latestEpisodesString = useRef(JSON.stringify(sampleEpisodes));

  // Handle Click
  const handleListenClick = (e, index: number) => {
    if (!episodes) return;
    if (episodes.length < 1) return;
    //Reverse episodes because playlist should be incremental
      e.preventDefault();
      const reversedEpisodes = [...episodes].reverse();
      const reversedIndex = Math.abs(episodes.length - 1 - index);
      player.setIsAutoPlay(true);
      player.setList({episodes: reversedEpisodes});
      player.setIndex(reversedIndex);
      router.push(episodes[index]._path!);
  }

  console.log("EPISODES", episodes);
  async function quickTest() {
    await getBooks();
    console.log("BOOKS ALL", books);
    // await getBooks(["GB8WMxtDTx"]); 
    // console.log("BOOKS", books);
    // await getEpisodes();
    // console.log("EPISODE ALL", episodes); 
    // console.log("EPISODES only number", episodes); 
    // await getEpisodes({include: ["number", "text", "quote", "book"]});
    // console.log("EPISODES only number", episodes);
    // await getEpisodes({include: ["number"], sort: "-number"});
    // console.log("EPISODES only -number", episodes);
    // await getEpisodes({include: ["number"], sort: "+number"});
    // console.log("EPISODES only +number", episodes);
    // await getEpisodes({search: "spiritual"});
    // console.log("EPISODES search spiritual", episodes);
    // await getEpisodes({search: "spiritual", limit: 1, skip: 1});
    // console.log("EPISODES search limit 1, skip 1", episodes);
    // await getEpisodes({bookIds: ["xQUvSz4VSJ"], include: ["book"]});
    // console.log("EPISODES book filter", episodes)
    // await getEpisodes({topicIds: ["NtS19tf8UC"]});
    // console.log("EPISODES topic filter", episodes); 
    // await getEpisodes(undefined, {limit: 1, skip: 1}); 
    // console.log("EPISODES get limit 1 skip 1", episodes); 
    // await getEpisodes({limit: 1, skip: 2});
    // console.log("EPISODES get limit 1 skip 2", episodes);
    // await getBooks();
    // console.log("BOOKS ALL", books);
    // await getBooks(["GB8WMxtDTx"]);
    // console.log("BOOKS ID", books);
    // await postList({name: "Mike's Other List", index: 2});
    // console.log("USER ID", user);
    // await getLists(undefined, {userId: user.objectId, sort: "+index"});
    // await removeEpisodeFromList(3, "vUgJiuslyU") 
    // await getLists(undefined, {userId: user.objectId, sort: "+index"})
    // setTimeout(async() => {console.log("NEW ALL", lists)}, 100); 
    // setTimeout(async() => {await reorderLists(1, 2);}, 500); 
    // setTimeout(async() => {await postList({name: "New List", index: lists?.length||1});}, 6500); 
    // setTimeout(async() => {await getLists(undefined, {userId: user.objectId, sort: "+index"})}, 1000); 
    // setTimeout(async() => {console.log("NEW ALL", lists)}, 2500); 
    // await postList({name: "Bookmarks", index: 0});  
    // setTimeout(async() => {await getLists(undefined, {userId: user.objectId, sort: "+index"})}, 7000); 
    // setTimeout(async() => {console.log("NEW ALL", lists)}, 7500); 
    // setTimeout(async() => {await removeEpisodeFromList(3, "vUgJiuslyU")}, 8500);  
    // setTimeout(async() => {await addEpisodeToList(2, "vUgJiuslyU")}, 8500);
    // setTimeout(async() => {await getLists(undefined, {userId: user.objectId, sort: "+index"})}, 9000); 
    // setTimeout(async() => {console.log("NEW ALL UPDATE", lists)}, 9500); 
    // setTimeout(async() => {await deleteList(2)}, 3000); 
    // setTimeout(async() => {await getLists(undefined, {userId: user.objectId, sort: "+index"})}, 3200); 
    // setTimeout(async() => {console.log("NEW ALL DELETED", lists)}, 3500);  
    // console.log("LISTS ID", lists);  
    // await getTopics();
    // console.log("TOPICS ALL", topics); 
    // await getTopics(["NtS19tf8UC"]);
    // console.log("TOPICS ID", topics);
    // await postNote({text: "my note", isPublic: true});
    // await postNoteFeedback({noteId: "hTr5xMpzNa", isHearted: null, isFlagged: null, report: "Hey"}) ;
    // await getLists(undefined, {userId: user.objectId, sort: "+index"})
    // await deleteNote("K4gTFvxAEJ");
  }
    //List modal trigger
  const [inspectedEpisode, setInspectedEpisode] = useState<IEpisode|undefined>();
  const [presentList, dimissList] = useIonModal(ListModal, {
      onDismiss: (data: string, role: string) => dimissList(data, role),
        router,
        isAddingEpisode: true,
        addEpisodeId: inspectedEpisode?.objectId,
    });

  console.log("EPISODE ALL", episodes); 
  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          <div className="flex items-center justify-center w-full py-2 md:hidden">
            {user.objectId ? 
              <img src='/logo/godible-logo.png' className='w-24'/>
            :
              <span>Welcome</span>
            }
          </div>
          <div className="hidden md:inline">Welcome</div>
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
              onClickMain={() => router.push("/signup")}
              subButtonText={"Log in"}
              subButtonIcon={arrowForwardOutline}
              onClickSub={() => router.push("/signin")}
              overlayColor={"linear-gradient(90deg, rgba(97,219,146,.2) 0%, rgba(0,255,239,.2) 100%)"}
              bgImageUrl={"/img/godible-bg.jpg"} //"/logo/godible.png"
              preImageUrl={"/logo/godible-logo-white.png"}
              postText={"Now available on Android, iOS, or on the web"}
            />
          </SwiperSlide>
          }
            {episodes && episodes.map((episode, index) => {
        //TODO: Test again
              const publishedAt = episode.publishedAt!;
              const oneWeekAgo = Date.now() - publishedAt > 6.048e+8;
              let pretext = (!index && Date.now() - publishedAt < 8.64e+7) ? "Today's Episode" : `${oneWeekAgo ? "Last": ""} ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(publishedAt)}'s Episode`
              return (
              <SwiperSlide key={"ephero-"+episode.objectId}>
                <Hero 
                  // title={"Let God's Word Be Heard"}
                  subtitle={episode._quote}
                  mainButtonText={"Listen"}
                  mainButtonIcon={playCircle}
                  onClickMain={(e) => handleListenClick(e, index)}
                  subButtonText={"List"}
                  subButtonIcon={addCircleOutline}
                  onClickSub={(e:any) => {
                    if (!user.objectId) return router.push("/signin?message=Log in to save lists")
                    setInspectedEpisode(episode)
                    presentList({
                      onDidDismiss: (e: CustomEvent) => {setInspectedEpisode(undefined)},
                    })
                  }}
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


        </SlideList>
        <div className="flex flex-col p-4 sm:p-10">
          <div className="flex flex-row items-center w-full space-x-5">
            <h2 className="mt-0 text-2xl">
              Latest Episodes
            </h2>
            <IonButton fill="clear" color="medium" onClick={() => router.push("/search?mode=episodes")}>
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setEpisodeWidth} idealWidth={220}>
            {episodes && episodes.map((episode, index) => {
              return (
                <SwiperSlide key={"epcard-"+episode.objectId}>
                  <EpisodeCard 
                    size={episodeWidth}
                    list={{episodes}}
                    index={index}
                    episode={episode}
                    customClickHandler={(e) => {handleListenClick(e, index)}}
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
            <IonButton fill="clear" color="medium" onClick={() => router.push("/search?mode=topics")}>
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setTopicWidth} idealWidth={180}>
                {topics && topics.map((topic, index) => {
                  return (
                    <SwiperSlide key={"topic-"+topic.name+"-"+index}>
                      <TopicCard 
                        size={topicWidth}
                        topic={topic}
                        index={index}
                        key={topic?.objectId}
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
              Books
            </h2>
            <IonButton fill="clear" color="medium" onClick={() => router.push("/books")}>
              Show All
            </IonButton>
          </div>
          
          <SlideList isCarousel spaceBetween={5} setItemWidth={setBookWidth} idealWidth={376}>
            {books && books.map((book, index) => {
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