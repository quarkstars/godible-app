import { useState, useContext, useEffect } from 'react';
import { useStripe, useElements, CardElement  } from '@stripe/react-stripe-js';
import Parse from 'parse';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { UserState } from 'components/UserStateProvider';

const useDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number|undefined>();
  const [error, setError] = useState<any>(null);
  const { user, updateUser, getCurrentUser } = useContext(UserState);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Check if user is signed in and has a customerId
    if (user?.objectId && !user?.customerId) {
      createCustomer();
    }
  }, [user?.objectId]);

  //TODO: Update customer when email changes
  const createCustomer = async () => {
    if (!user?.objectId) return;
    setIsLoading(true);
    try {
      // Call the createStripeCustomer cloud function
      const response = await Parse.Cloud.run("createStripeCustomer");

      // Update user with the new customerId
      // updateUser({ customerId: response.customerId });
      if (!response) throw "Failed to connect to Stripe"
      let updatedUser = await getCurrentUser();
      if (!updatedUser.customerId) throw "Failed to connect to Stripe!!"

      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  //TODO: Update customer when email changes
  const getMonthlyDonation = async () => {

    try {
      // Call the createStripeCustomer cloud function
      return await Parse.Cloud.run("getLatestCalendarMonthRevenue") || 0;

    } catch (error) {
      return 0;
    } 
  };

  const updateCustomer = async (updateData: any) => {
    if (!user?.objectId) return;
    setIsLoading(true);
    try {
      // Call the updateStripeCustomer cloud function
      const response = await Parse.Cloud.run("updateStripeCustomer", updateData);
  
      if (!response) throw "Failed to update customer in Stripe";
  
      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDonationAmount = async (newAmount: number, isCoveringFee?: boolean) => {
    let currentDonationAmount = donationAmount;
    if (newAmount < 2) setDonationAmount(2);
    else setDonationAmount(newAmount);
    
    setIsLoading(true);
    try {
      //Update isCoveringFee if specified
      if (typeof isCoveringFee === "boolean") await updateUser({isCoveringFee})
      // Call the updateDonationAmount cloud function
      const response = await Parse.Cloud.run("updateDonationAmount", {newAmount, isCoveringFee});
      if (!response) setDonationAmount(currentDonationAmount);

      // Update user with the new donationAmount and priceId
      if (!response) throw "Failed to set new price!"
      let updatedUser = await getCurrentUser();
      if (!updatedUser.priceId || updatedUser.donationAmount !== newAmount) throw "Failed to set new price"
      // updateUser({ donationAmount: newAmount, priceId: response.priceId });
      setError(undefined);
    } catch (error) {
      setError(error);
      //revert
      setDonationAmount(currentDonationAmount);
    } finally {
      setIsLoading(false);
    }
  };
  const createSubscription = async (address:any = undefined) => {
    setIsLoading(true);
    try {
      if (!user.customerId || !user.priceId) {
        throw new Error("Missing customerId or priceId");
      }
      if (address?.line1) {
        await updateUser({address});
        await updateCustomer({address});
      }
      const response = await Parse.Cloud.run("createSubscription");
      if (!response) throw "Failed to create subscription"
      let updatedUser = await getCurrentUser();
      if (!updatedUser.subscriptionId) throw "Failed to create subscription"

      setError(undefined);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error);
      setIsLoading(false);
      return false;
    } 
  };

  //Saves payment method, either first time, or updates it
  const savePaymentMethod = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);
    try {
      const cardElement: StripeCardElement | null = elements.getElement(CardElement);
  
      if (!cardElement) {
        throw new Error("Card element not found");
      }
  
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
  
      if (error) {
        setError(error.message);
      } else {
        await updateUser({ paymentMethod });
        if (user.subscriptionId) {

  
          const response = await Parse.Cloud.run("updateSubscription");
  
          if (!response.id) throw "Failed to save payment method"
          let updatedUser = await getCurrentUser();
          if (!updatedUser.subscriptionId) throw "Failed to save payment method"
        }
      }
      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  //Cancel Subscription
  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      // Call the createStripeCustomer cloud function
      const response = await Parse.Cloud.run("deleteSubscription");
      if (!response) throw "Failed to cancel subscription"
      let updatedUser = await getCurrentUser();
      if (updatedUser.subscriptionId) throw "Failed to delete subscription"
      setError(undefined);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error);
      setIsLoading(false);
      return false;
    } 
  };

  
  //Get Payment Events
  const [events, setEvents] = useState<any[]|undefined>()
  const getPaymentEvents = async (type?: string) => {
    setIsLoading(true);
    try {
      // Call the createStripeCustomer cloud function
      const response = await Parse.Cloud.run("getPaymentEvents", {type});
      if (!response) throw "Failed to get events"
      console.log("EVENTS", response)
      setEvents(response);
      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };



  return {
    isLoading,
    error,
    createSubscription,
    updateDonationAmount,
    updateCustomer,
    savePaymentMethod,
    cancelSubscription,
    stripe,
    events,
    setEvents,
    getPaymentEvents,
    setError,
    getMonthlyDonation,
  };
};


export default useDonation;