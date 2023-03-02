import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { PlayerControls } from 'components/ui/PlayerControls';
import { useEffect } from 'react';
import Parse from "parse";
import { logInOutline } from 'ionicons/icons';
import Toolbar from 'components/ui/Toolbar';

const NotFoundPage: React.FC = () => {


	const router = useIonRouter();

  const { name } = useParams<{ name: string; }>();
  useEffect(() => {
    const hello = Parse.Cloud.run('hello');
    console.log(hello)
  }, [])
  

  return (
    <IonPage>
      <IonHeader>
        <Toolbar>
          <IonTitle>
            Not Found
          </IonTitle>
        </Toolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main className="grid min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <a
              href="#"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            {/* <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a> */}
          </div>
        </div>
      </main>
      </IonContent>
      
      <IonFooter>
        <PlayerControls />
      </IonFooter>
    </IonPage>
  );
};

export default NotFoundPage;
