import { IonButton, IonIcon } from '@ionic/react';
import { UserState } from 'components/UserStateProvider';
import { checkmarkCircle } from 'ionicons/icons';
import React, {useContext} from 'react'

const Pricing = ({onClick}) => {
    
  const {
    user
  } = useContext(UserState);

  return (
    <div className="grid w-full grid-cols-1 gap-6 mx-auto xs:grid-cols-2">
        {!user?.subscriptionId &&
        <div className="p-5 bg-white border border-t-4 rounded-lg shadow border-medium dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-500 uppercase">
                Free Account
            </p>

            <p className="mt-4 text-3xl font-medium text-gray-700 dark:text-gray-100">
                $0 <span className="text-base font-normal"></span>
            </p>

            <p className="mt-4 font-medium text-gray-700 dark:text-gray-100">
                Not yet supporting Godible
            </p>

            <div className="mt-8">
                <ul className="grid grid-cols-1 gap-4">
                <li className="flex items-start text-gray-600 dark:text-gray-200">
                    <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                    </div>
                    1 newest episode daily
                </li>

                <li className="flex items-start text-gray-600 dark:text-gray-200">
                    <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                    </div>

                    Email and push daily reminders
                </li>

                <li className="flex items-start text-gray-600 dark:text-gray-200">
                    <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                    </div>

                    Save lists of episodes
                </li>
                <li className="flex items-start text-gray-600 dark:text-gray-200">
                    <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                    </div>

                    Take reading notes
                </li>
                <li className="flex items-start text-gray-600 dark:text-gray-200">
                    <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                    </div>

                    Spiritual life calendar
                </li>
                </ul>
            </div>


            </div>
        }
        <div className="p-5 bg-white border border-t-4 rounded-lg shadow border-primary dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-500 uppercase">
            {user?.subscriptionId ? `Your Pro Account` : "Pro Account"}
            </p>

            {!user?.subscriptionId && 
                <p className="mt-4 text-3xl font-medium text-gray-700 dark:text-gray-100">
                    $Any <span className="text-base font-normal">/month</span>
                </p>
            }

            <p className={`mt-4 ${user?.subscriptionId ? "text-primary font-bold":"text-gray-700 dark:text-gray-100 font-medium"}`} >
            {user?.subscriptionId ? `You are contributing $${user?.donationAmount}/month` : "Support Godible and you get"}
            </p>

            <div className="mt-8">
            <ul className="grid grid-cols-1 gap-4">


                <li className="flex items-start text-gray-600 dark:text-gray-200">
                <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                </div>
                    <span><span className="inline font-bold">Full access to all episodes</span> 
                    <span className="block text-sm">1200+ episodes with 200+ speeches & 6 Holy Books</span>
                </span>
                </li>

                <li className="flex items-start text-gray-600 dark:text-gray-200">
                <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="primary" size="small" />
                </div>

                Text daily reminders
                </li>                          
                <li className="flex items-start text-gray-600 dark:text-gray-200">
                <div className="w-6 pt-1 pr-2">
                    <IonIcon icon={checkmarkCircle} color="medium" size="small" />
                </div>

                All features of a free account
                </li>
            </ul>
            </div>

            <div className="mt-8">
            <IonButton color="primary" expand="block" onClick={(e) => onClick(e)}>
                {`${user?.subscriptionId ? "Manage Subscription" : "Subscribe Now"}`}
            </IonButton>
            </div>
        </div>

        </div>
  )
}

export default Pricing