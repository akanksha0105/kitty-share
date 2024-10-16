import axios from "axios";

// VAPID Public Key (Replace with your own)
const publicVapidKey =  process.env.REACT_APP_VAPID_PUBLIC_KEY;

// Main function to register service worker and subscribe user to push notifications
export const subscribeUserToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported in this browser');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    
    return true;
    
    // const subscriptionSent = await sendSubscriptionToServer(pushSubscription);
    // if (subscriptionSent) {
    //   console.log('User successfully subscribed to push notifications');
    //   return true;
    // }
  } catch (error) {
    console.error('Push subscription failed:', error);
    return false;
  }
};

// Helper function: Converts a base64 string to a Uint8Array (needed for VAPID)
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

// Send push subscription details to server
const sendSubscriptionToServer = async (subscription) => {
  const subscribedDeviceId = localStorage.getItem('deviceId');
  if (!subscribedDeviceId) {
    console.error('No device ID found for subscription');
    return false;
  }

  try {
    const response = await axios.post('/api/subscription/savesubscription', {
      subscriptionObject: subscription,
      subscribedDeviceId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Subscription sent to server successfully:', response.data.data);
    return true;
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    return false;
  }
};



