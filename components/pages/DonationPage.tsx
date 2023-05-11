import React, {useContext, useRef, useState, useEffect} from 'react';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useDonation from 'hooks/useDonation'; 
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonModal, useIonPopover, useIonRouter } from '@ionic/react';
import { UserState } from 'components/UserStateProvider';
import { checkmarkCircle, close, closeCircle, heartCircle, logOut, logOutOutline, pencil, personCircleOutline } from 'ionicons/icons';
import InitialsAvatar from 'react-initials-avatar';
import TextDivider from 'components/ui/TextDivider';
import { countryCodes } from 'data/countryCodes';
import AlertInline from 'components/ui/AlertInline';
import BillingHistoryModal from 'components/ui/BillingHistoryModal';
import { App } from '@capacitor/app';


const DonationPage: React.FC = () => {
	const router = useIonRouter();

  const {user, isLoading: userIsLoading, setReroutePath, logOut, updateUser, isModalOpen} = useContext(UserState);
  const {
    error,
    isLoading,
    createSubscription,
    updateDonationAmount,
    savePaymentMethod,
    updateCustomer,
    cancelSubscription,
    stripe,
    setError,
  } = useDonation();
  let userName = `${user?.firstName ? user?.firstName:""}${user?.lastName ? " "+user?.lastName:""}`

  
  const [enteringCustomAmount, setEnteringCustomAmount] = useState(false);
  const [changingAmount, setChangingAmount] = useState(false);
  const [changingMethod, setChangingMethod] = useState(false);
  const [changingAddress, setChangingAddress] = useState(false);
  const [countryCode, setCountryCode] = useState<string|undefined>("US");
  const [message, setMessage] = useState<string|undefined>(undefined);
  const [showingMinNote, setShowingAmountNote] = useState(false);
  const customAmountInput = useRef<HTMLIonInputElement>(null);
  const [paymentIsLoading, setPaymentIsLoading] = useState(false);
  
  const line1 = useRef<HTMLIonInputElement>(null);
  const line2 = useRef<HTMLIonInputElement>(null);
  const city = useRef<HTMLIonInputElement>(null);
  const state = useRef<HTMLIonInputElement>(null);
  const postal_code = useRef<HTMLIonInputElement>(null);

  
  const [isCoveringFee, setIsCoveringFee] = useState(false);
  useEffect(() => {
    if (!user?.objectId) return;
    setIsCoveringFee(user?.isCoveringFee||false);
  }, [user?.isCoveringFee])
  const [hasAddress, setHasAddress] = useState(false);
  useEffect(() => {
    if (!user?.objectId) return;
    setHasAddress(user?.hasAddress||false);
  }, [user?.hasAddress]);
  
  useEffect(() => {
    if (!user?.objectId) return;
    if (line1.current) line1.current.value = user?.address?.line1

  }, [user?.address, line1, changingAddress]);
  useEffect(() => {
    if (!user?.objectId) return;
    if (line2.current) line2.current.value = user?.address?.line2
  }, [user?.address, line2, changingAddress]);
  useEffect(() => {
    if (!user?.objectId) return;
    if (city.current) city.current.value = user?.address?.city
  }, [user?.address, city, changingAddress]);
  useEffect(() => {
    if (!user?.objectId) return;
    if (state.current) {
      state.current.value = user?.address?.state
    }
  }, [user?.address, state.current, changingAddress]);
  useEffect(() => {
    if (!user?.objectId) return;
    if (postal_code.current) postal_code.current.value = user?.address?.postal_code
  }, [user?.address, postal_code, changingAddress]);
  
   //List modal trigger
   const [presentCancelMenu, dismissCancelMenu] = useIonPopover(cancelMenu, {
    onDismiss: (data: string, role: string) => dismissCancelMenu(data, role),
      cancelSubscription,
      setMessage,
  });   

  const [presentHistory, dismissHistory] = useIonModal(BillingHistoryModal, {
    onDismiss: (data: string, role: string) => {
      dismissHistory(data, role); 
      if (isModalOpen) isModalOpen.current = false;
    },
  });

  const [presentSuccess, dismissSuccess] = useIonModal(SuccessModal, {
    onDismiss: (data: string, role: string) => {
      dismissSuccess(data, role); 
      if (isModalOpen) isModalOpen.current = false;
    },
    router,
  });

  
  let selectingAmount = false;
  let enteringMethod = false;
  let enteringAddress = false;
  
  if(user) {
    selectingAmount = enteringCustomAmount || changingAmount || !user.donationAmount ? true: false;
    enteringMethod = changingMethod || (!user.subscriptionId && !user.paymentMethod && user.donationAmount) ? true: false;
    enteringAddress = changingAddress || (user.hasAddress && !user.address) ? true: false;
  }
  
  
  
  const handleSelectDonation = async (amount: number) => {
    await updateDonationAmount(Math.floor(amount));
    setChangingAmount(false);
    setEnteringCustomAmount(false);
  }



	const stripeFeePercent = 0.029;
	const stripeFixedFee = 0.3;

  let totalAmount:number|string|undefined = user?.donationAmount;
  let fee:number|string = Math.round(((user?.donationAmount||0) * stripeFeePercent + stripeFixedFee)  * 100) / 100
	if (user?.isCoveringFee && user?.donationAmount) {
		totalAmount = user?.donationAmount + fee;
		totalAmount = Math.round(totalAmount * 100) / 100; // Round to the nearest cent
	}
  if (typeof totalAmount === "number" && !Number.isInteger(totalAmount)) {
    totalAmount = totalAmount.toFixed(2)
  } 
  if (typeof fee === "number" && !Number.isInteger(fee)) {
    fee = fee.toFixed(2)
  } 
  
  const accessTime = 31 * 24 * 60 * 60 * 1000;
  const lastAccessTime = (user?.lastPaymentTime||0) + accessTime;
  let hasAccess = (user?.lastPaymentTime && Date.now() < lastAccessTime) ? true : false;

	return (
		<IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <div className='flex justify-start sm:w-28'>
                <IonBackButton defaultHref="/"></IonBackButton>
              </div>
            </IonButtons>
            <div className="flex justify-center w-full pr-24"><img src='/logo/godible-logo.png' className='w-24'/></div>
          
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col items-center justify-center w-full min-h-full">
            <div className="flex flex-col items-stretch justify-center p-6 py-8 bg-white rounded-lg dark:bg-light" style={{maxWidth:"460px"}}>
            { user?.objectId && <>
            <TextDivider>{`Donor ${user?.subscriptionId ? "Settings" : "Upgrade"}`}</TextDivider>
            

            <div className="flex justify-center w-full">
              <div className="flex items-center justify-between w-full p-2 space-x-1 bg-gray-100 rounded-md dark:bg-gray-700">
                  <div className="flex items-center space-x-2">

                    {user.imageUrl ?

                      <img 
                        className='w-10 h-10 rounded-full'
                        src={user.imageUrl} 
                        alt="My Profile" 
                      ></img>
                      :
                      <div
                          className='p-2'
                      >
                          <InitialsAvatar name={userName}  />
                      </div>
                      }

                      <div className="flex flex-col w-full">
                        <div className="font-medium text-md xs:text-lg line-clamp-1">{`${userName}`}</div>
                        <div className="text-xs xs:text-sm text-medium line-clamp-1">{`${user.email}`}</div>
                      </div>
                    </div>
                    <IonButtons>
                      <IonButton size="small" onClick={()=>{logOut();}}>
                        <IonIcon icon={logOutOutline} color="medium" slot="start" />
                        Logout
                      </IonButton>
                    </IonButtons>
              </div>
            </div>
            
            {user?.subscriptionId && 
              <div className="w-full pt-4 italic text-center text-primary">
                {`Active (next charge ${user?.nextPaymentTime ? new Date(user?.nextPaymentTime).toLocaleDateString() : ""})`}
              </div>
            }
            {(!user?.subscriptionId && hasAccess)  && 
              <div className="w-full pt-4 italic text-center text-medium">
                {`Canceled (access until ${lastAccessTime ? new Date(lastAccessTime).toLocaleDateString() : ""})`}
              </div>
            }
            <div className="flex flex-col items-center w-full">
              {!enteringCustomAmount &&
                <div className="flex py-4 text-light dark:text-dark">
                  {(user?.donationAmount && !selectingAmount) &&
                  <div className="flex items-center">
                    <span className="p-2 text-2xl font-medium">$</span>
                    <span className="pr-2 text-5xl font-bold">{user?.donationAmount}</span>
                  </div>
                  }
                  {(!user?.donationAmount || selectingAmount) ?
                    <span className="px-2 text-2xl font-medium text-center">Select your donation monthly</span>
                  :
                  <div className="flex items-center"><span className="pb-1 text-2xl font-medium border-b-4 border-primary">monthly</span></div>
                  }
                  {(!selectingAmount && user?.donationAmount) && 
                  <div className="flex items-center justify-center w-full">
                    <IonButton size="small" fill="clear" onClick={() => {setChangingAmount(true);setShowingAmountNote(false);}}>
                      <IonIcon slot="icon-only" icon={pencil} size="small" />
                    </IonButton>
                  </div>
                  }
                </div>
              }
              {(!enteringCustomAmount && selectingAmount) &&
              <div className="flex flex-wrap justify-center w-full">
                <IonChip
                  onClick={() => {handleSelectDonation(5);}}
                  disabled={isLoading}
                >
                  <span className="pr-1 text-xs text-light dark:text-dark">$</span><span className="text-lg font-bold">5</span>
                </IonChip>
                <IonChip
                  onClick={() => {handleSelectDonation(7);}}
                  disabled={isLoading}
                >
                  <span className="pr-1 text-xs text-light dark:text-dark">$</span><span className="text-lg font-bold">7</span></IonChip>
                
                <IonChip
                  onClick={() => {handleSelectDonation(12);}}
                  disabled={isLoading}
                >
                  <span className="pr-1 text-xs text-light dark:text-dark">$</span><span className="text-lg font-bold">12</span>
                </IonChip>
                <IonChip
                  onClick={() => {handleSelectDonation(21);}}
                  disabled={isLoading}
                >
                  <span className="pr-1 text-xs text-light dark:text-dark">$</span><span className="text-lg font-bold tracking-tighter">21</span>
                </IonChip>
                
                <IonChip
                  onClick={()=>handleSelectDonation(40)}
                  disabled={isLoading}
                >
                  <span className="pr-1 text-xs text-light dark:text-dark">$</span><span className="text-lg font-bold">40</span>
                </IonChip>
                
                <IonChip
                  onClick={(e) => {
                    setEnteringCustomAmount(true);
                    setTimeout(async () => {
                      await customAmountInput.current?.setFocus();
                    }, 200);
                    // setTimeout(async () => await customAmountInput.current?.setFocus(), 200);
                  }}
                  disabled={isLoading}
                >
                  Enter an amount
                </IonChip>
              </div>
            }
            
            </div>
            
            </>}
            {enteringCustomAmount && 
              <IonItem>
                <IonLabel>$</IonLabel>
                <IonInput 
                  placeholder="Enter an amount..."
                  ref={customAmountInput}
                
                >

                </IonInput>
                <IonButton
                  color="primary"
                  onClick={(e) => {
                    if (!customAmountInput.current?.value) return;
                    const value = customAmountInput.current?.value;
                    let amount = (typeof value === "string") ? Number(value) : value;
                    if (amount < 2) {
                      customAmountInput.current.value = 2;
                      return setShowingAmountNote(true);
                    }
                    if (amount > 400) {
                      customAmountInput.current.value = 400;
                      return setShowingAmountNote(true);
                    }
                    handleSelectDonation(amount);
                    setShowingAmountNote(false);
                  }}
                  disabled={isLoading}
                >
                  Save
                </IonButton>              
                {showingMinNote && <IonNote slot="helper"><span className="text-xs text-primary">Enter between $2 to $400</span></IonNote>}

              </IonItem>
            }
            {(selectingAmount && user?.donationAmount) && 
              <IonButton size="small" fill="clear" disabled={isLoading} onClick={() => {setChangingAmount(false);setEnteringCustomAmount(false)}}>
                Cancel
              </IonButton>
            }

            {error &&
            <div className="w-full py-2">
                <AlertInline
                  message={typeof error === "string" ? error : error?.message}
                  type="error"
                  onDismiss={()=>{setError(undefined)}}
              />
            </div>
            }
            {message &&
            <div className="w-full py-2">
                <AlertInline
                  message={message}
                  type="success"
                  onDismiss={()=>{setMessage(undefined)}}
              />
            </div>
            }
            {enteringMethod &&
            <>
              <form className="p-1 overflow-hidden bg-white border-b rounded-lg dark:border-none">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontWeight: "bold",
                      backgroundColor: '#FFFFFF',
                      padding: '6px',
                    },
                  },
                }}
              />
              </form>
              
            <div className='flex items-center w-full space-x-0.5'>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-400">Secured with</span>
              <img src='/img/stripe.png' className='w-10 pt-0.5'/>

            </div>
            <IonButton 
                color="primary" 
                expand="block"
                disabled={isLoading}
                onClick={() => {
                  savePaymentMethod();
                }}
            >
                Save Payment Method
            </IonButton>
            {user?.paymentMethod && <IonButton size="small" fill="clear" onClick={(e) => {setChangingMethod(false)}}>Cancel</IonButton>}

            </>}
            {!enteringMethod && user?.paymentMethod && 
            <div className='flex flex-col px-8 pt-4 pb-8 border rounded-md'>
              <div className="flex items-center justify-between">
                <h5 className="text-sm xs:text-lg">Payment Method</h5>
                <IonButton size="small" fill="clear" onClick={(e) => {setChangingMethod(true)}}>
                  <IonIcon icon={pencil} slot="icon-only" size="small" />
                </IonButton>
              </div>
              <div className="flex justify-between text-sm font-medium text-medium">
              <span>{user.paymentMethod.card.brand}</span>
              <span>Expires {user.paymentMethod.card.exp_month}/{user.paymentMethod.card.exp_year.toString().slice(-2)}</span>
              <span className="pr-4">**{user.paymentMethod.card.last4}</span>
              </div>
            </div>
            }
            
            {user?.paymentMethod && !user?.subscriptionId && <span className="w-full py-2 italic text-center">Card added. One last step...</span>}
          {(user?.paymentMethod && user?.donationAmount) && 
            <div className="flex flex-col w-full mt-6">
            <IonItem>
              <IonCheckbox 
                slot="start"
                checked={isCoveringFee}
                onIonChange={(e) => {
                  setIsCoveringFee(e.detail.checked);
                  if (!user?.donationAmount) return;
                  updateDonationAmount(user?.donationAmount, e.detail.checked)
                }}
              
              ></IonCheckbox>
              <div className="hidden xs:inline">
                <IonLabel><span className="text-md">{`Help cover the $${fee} transaction fee?`}</span></IonLabel>
              </div>
              <div className="inline xs:hidden">
                <IonLabel><span className="text-sm">{`Cover transaction fee ($${fee})?`}</span></IonLabel>
              </div>
            </IonItem>
            <IonItem>
              <IonCheckbox 
                slot="start"
                checked={hasAddress}
                onIonChange={(e) => {
                  setHasAddress(e.detail.checked);
                  updateUser({hasAddress: e.detail.checked})
                }}
              
              >

              </IonCheckbox>
              <div className="hidden xs:inline">
                <IonLabel><span className="text-md">{`Get mailed an annual tax receipt (US only)`}</span></IonLabel>
              </div>
              <div className="inline xs:hidden">
                <IonLabel><span className="text-sm">{`Get mailed tax receipt (US)`}</span></IonLabel>
              </div>
            </IonItem>
            {enteringAddress && <>
            <IonItem>
              <IonLabel position='stacked'>Street Address</IonLabel>
              <IonInput 
                ref={line1}
                placeholder="Address" 

              >
                

              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position='stacked'>Address Line 2</IonLabel>
              <IonInput 
                placeholder="Address Line 2" 
                ref={line2}

              >
                

              </IonInput>
            </IonItem>
            
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                    <IonItem>
                      <IonLabel position='stacked'>City</IonLabel>
                      <IonInput placeholder="City" ref={city}></IonInput>
                    </IonItem>
                </div>
                <div className="form-group">
                    <IonItem>
                      <IonLabel position='stacked'>State</IonLabel>
                      <IonInput placeholder="State" ref={state}></IonInput>
                    </IonItem>
                </div>
                <div className="form-group">
                    <IonItem>
                      <IonLabel position='stacked'>Zip Code</IonLabel>
                      <IonInput placeholder="Zip" ref={postal_code}></IonInput>
                    </IonItem>
                </div>
               
              </div>
              </>}
              {(enteringAddress && user?.address) && 
                  <IonButtons>
                    <IonButton 
                      size="small" 
                      color="primary" 
                      disabled={isLoading} 
                      onClick={async () => {
                        let address:any = {};
                        if (line1.current?.value) address.line1 = line1.current?.value;
                        if (line2.current?.value) address.line2 = line2.current?.value;
                        if (city.current?.value) address.city = city.current?.value;
                        if (state.current?.value) address.state = state.current?.value;
                        if (postal_code.current?.value) address.postal_code = postal_code.current?.value;
                        await updateUser({
                          address
                        })
                        await updateCustomer({
                          address
                        })
                        setChangingAddress(false)
                      }}
                    >
                      Save
                    </IonButton>
                    <IonButton size="small" fill="clear" disabled={isLoading} onClick={() => {setChangingAddress(false)}}>
                      Cancel
                    </IonButton>
                  </IonButtons>
                }
              {(user?.address && !enteringAddress) &&
              <div className="flex justify-start w-full">
                <div className='flex flex-col items-start pt-4 pb-4 ml-16 text-sm font-medium text-medium'>
                  {user.address.line1 && <span>{user.address.line1}</span>}
                  {user.address.line2 && <span>{user.address.line2}</span>}
                  {user.address.city && <span>{user.address.city}</span>}
                  {user.address.state && <span>{user.address.state}</span>}
                  {user.address.postal_code && <span>{user.address.postal_code}</span>}
                  <div className="-ml-4">
                  <IonButton size="small" fill="clear" onClick={ async() => {
                    setChangingAddress(true);
                    // await getCurrentUser()
                    
                    setEnteringCustomAmount(false);
                  }}>
                    <IonIcon size="small" icon={pencil} />
                  </IonButton>
                  </div>
                </div>
              </div>
              }
            </div>
            }
            {(!user?.subscriptionId && totalAmount && user?.paymentMethod) &&
            <div className="w-full py-4">
              <IonButton 
                  color="primary" 
                  expand="block"
                  disabled={isLoading||userIsLoading||paymentIsLoading}
                  onClick={async () => {
                    let address:any = {};
                    if (line1.current?.value) address.line1 = line1.current?.value;
                    if (line2.current?.value) address.line2 = line2.current?.value;
                    if (city.current?.value) address.city = city.current?.value;
                    if (state.current?.value) address.state = state.current?.value;
                    if (postal_code.current?.value) address.postal_code = postal_code.current?.value;
                    setPaymentIsLoading(true);
                    setTimeout(()=> setPaymentIsLoading(false), 10000);
                    let response = await createSubscription(address);
                    if (response) {
                      setMessage("Subscription created")
                      presentSuccess({
                        initialBreakpoint: 0.50

                      });
                    }
                  }}
              >
                  {`Subscribe ($${totalAmount} monthly)`}
              </IonButton>
            </div>
            }
            
            {user?.hasBillingHistory && 
            <div className="flex justify-center w-full pt-6">
              <IonButton size="small" fill="clear" onClick={(e) => {presentHistory({})}}>Billing History</IonButton>
            </div>
            }
            {user?.subscriptionId && 
            <div className="flex justify-center w-full py-6">
              <IonButton size="small" fill="clear" onClick={(e: any) => {presentCancelMenu({event: e})}}>
                Cancel Subscription
              </IonButton>
            </div>
            }
            {!user?.objectId && <>
              <div className="flex items-start justify-center w-full py-2 space-x-1">
                <IonIcon icon={personCircleOutline} size="large" />
                <div className="flex flex-col w-full">
                  <div className="font-medium text-md xs:text-lg">Link an account to your donation</div>
                  <div className="text-xs italic xs:text-sm text-medium">Log in is required</div>
                </div>
              </div>
              <IonButton 
                  color="primary" 
                  expand="block"
                  onClick={() => {
                    setReroutePath("/donation");
                    router.push("/signin");
                  }}
              >
                  Log in
              </IonButton>
              <IonButton 
                  color="primary" 
                  expand="block"
                  fill="clear"
                  onClick={() => {
                    setReroutePath("/donation");
                    router.push("/signup");
                  }}
              >
                  Create Account
              </IonButton>
                
            </>}
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};


const cancelMenu = ({onDismiss, cancelSubscription, router, isLoading, setMessage}) => {
  return (    
    <IonContent class="ion-padding">
      <div className="flex flex-col">
      <span className="w-full font-bold text-center">Are you sure?</span>
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
              <IonButton 
                fill="clear" 
                expand="block" 
                disabled={isLoading}
                onClick={async (e) => {
                  let response = await cancelSubscription();
                  if (response) setMessage("Subscription canceled");
                  onDismiss();
                }}
              >
                  <div className="flex items-center justify-start w-full space-x-2">
                      <IonIcon icon={checkmarkCircle} color="danger" />
                      <IonLabel color="danger">Cancel Subscription</IonLabel>
                  </div>
              </IonButton>
              </li>
              <li>
              <IonButton fill="clear" expand="block" 
                disabled={isLoading}
                onClick={(e) => {
                  onDismiss();
                }}
              >
                  <div className="flex items-center justify-start w-full space-x-2">
                      <IonIcon icon={closeCircle} color="medium" />
                      <IonLabel color="medium">Keep Subscription</IonLabel>
                  </div>
              </IonButton>
              </li>
          </ul>
      </div>
  </IonContent>  
  )
}

const SuccessModal = ({onDismiss, router, reroutePath}) => {
  const {isModalOpen} = useContext(UserState);
  useEffect(() => {
    let backButtonListener;
    if (isModalOpen) isModalOpen.current = true;

    const addListenerAsync = async () => {
        backButtonListener = await App.addListener('backButton', (data) => {
            onDismiss();
        });
    };

    addListenerAsync();

    return () => {
        // Clean up listener
        if (backButtonListener) {
            backButtonListener.remove();
        }
        if (isModalOpen) isModalOpen.current = false;
    };
  }, []);

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onDismiss(null, 'close')}>
              <IonIcon icon={close} slot="icon-only"/>
              {/* Default */}
            </IonButton>
          </IonButtons>
          <div className="pr-10">
          <IonTitle>Donation Successful!</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex justify-center w-full"><IonIcon icon={heartCircle} color="primary" size="large" /></div>
        
        <h2 className="w-full text-center">Thank you for your support</h2>

        
        <IonButton
            onClick={async (e) => {
              if (reroutePath) router.push(reroutePath);
              else router.push("/");
              onDismiss()
            }}
            expand="block"
            color="primary"
          >
            Continue Listening
          </IonButton>
        <IonButton
            onClick={async (e) => {
              onDismiss()
            }}
            expand="block"
            color="primary"
            fill="clear"
          >
            Close
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default DonationPage;