import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import Hero from 'components/ui/Hero';
import SlideList from 'components/ui/SlideList';
import Toolbar from 'components/ui/Toolbar';
import { logInOutline } from 'ionicons/icons'
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState } from 'react'
import Thumbnail from 'components/ui/Thumbnail';

const HomePage:React.FC = () => {


	const router = useIonRouter();

  const [episodeWidth, setEpisodeWidth] = useState<number>(148)

  return (
    <IonPage>
    <IonHeader>
      <Toolbar>
        <IonTitle>
          Not Ga
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
          
          <SlideList isCarousel spaceBetween={30} setItemWidth={setEpisodeWidth} idealWidth={200}>
            <SwiperSlide key="fdafda">
              <div className='flex flex-col items-center justify-start py-4 bg-dark dark:bg-light rounded-xl' style={{width: episodeWidth}}>
                <Thumbnail 
                  size={episodeWidth-32} 
                  overlayColor='#000000'
                  cornerImageUrl='https://cdn.shopify.com/s/files/1/0267/3780/3343/files/CBG_Thumbnail_160x160.png?v=1666202514'
                  imageUrl='https://images.unsplash.com/photo-1677477605371-f65e2ef8759d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                >
                  <span className="text-3xl font-bold text-white dark:text-white">10</span>
                  <span className="text-lg font-bold text-white dark:text-white">to</span>
                  <span className="text-3xl font-bold text-white dark:text-white">539</span>
                </Thumbnail>
                <span className="px-4 pt-5 pb-2 text-lg font-medium max-h-20 line-clamp-2 ">Speech When the saint go  mfdafdafda fda fda dfaarchi marching in</span>
              </div>
            </SwiperSlide>
            <SwiperSlide key="fdafda">
              <div className='flex flex-col items-center justify-start py-4 bg-dark dark:bg-light rounded-xl' style={{width: episodeWidth}}>
                <Thumbnail 
                  size={episodeWidth-32} 
                  overlayColor='#000000'
                  cornerImageUrl='https://cdn.shopify.com/s/files/1/0267/3780/3343/files/CBG_Thumbnail_160x160.png?v=1666202514'
                  imageUrl='https://images.unsplash.com/photo-1677477605371-f65e2ef8759d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                >
                  <span className="text-3xl font-bold text-white dark:text-white">10</span>
                </Thumbnail>
                <span className="px-4 pt-5 pb-2 text-lg font-medium max-h-20 line-clamp-2 ">Speech When the saint go marching</span>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='h-64 bg-black'style={{width: episodeWidth}}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='h-64 bg-black'style={{width: episodeWidth}}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='h-64 bg-black'style={{width: episodeWidth}}></div>
            </SwiperSlide>

          </SlideList>
        </div>
      </div>
      </IonContent>
    </IonPage>
  )
}

export default HomePage