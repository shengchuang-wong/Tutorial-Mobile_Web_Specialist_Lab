/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BIx8narnlesNl7mvnGRA-QuWcGbnQpLFgL92vA30n01ZVUuFA8TxCmkTo6sDvt63OqXLOuem1RUbDOmUhq7k8zA';

const pushButton = document.querySelector('.js-push-btn');
const pushNotificationButton = document.querySelector('.js-click-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported')

  navigator.serviceWorker.register('sw.js')
  .then(swReg => {
    console.log('Service Worker is registered', swReg)

    swRegistration = swReg
    initializeUI()
  })
  .catch(error => {
    console.log('Service Worker Error', error)
  })
} else {
  console.warn('Push messaging is not supported')
  pushButton.textContent = 'Push Not Supported'
}

const initializeUI = () => {

  pushButton.addEventListener('click', () => {
    pushButton.disabled = true

    if (isSubscribed) {
      // TODO: Unsubscribe user
      unsubscribeUser()
    } else {
      subscribeUser()
    }
  })

  pushNotificationButton.addEventListener('click', () => {
    if(isSubscribed) {
      console.log('asdas')
      swRegistration.showNotification('Hello world', {})
    } else {
      console.warn('did not subscribe to push yet')
    }
  })

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(subscription => {
    isSubscribed = !(subscription === null)

    if (isSubscribed) {
      console.log('User is subscribed.')
    } else {
      console.log('User is not subscribed.')
    }

    updateBtn()
  })
}

const updateBtn = () => {

  if(Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.'
    pushButton.disabled = true

    pushNotificationButton.textContent = 'Push Messaging Blocked.'
    pushNotificationButton.disabled = true

    updateSubscriptionOnServer(null)
    return
  }

  if(isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging'
  } else {
    pushButton.textContent = 'Enable Push Messaging'
  }
  pushNotificationButton.textContent = 'Click to Push'

  pushButton.disabled = false
  pushNotificationButton.disabled = false
}

const subscribeUser = () => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(subscription => {
    console.log('User is subscribed.')

    updateSubscriptionOnServer(subscription)
    console.log({subscription})
    isSubscribed = true

    updateBtn()
  })
  .catch(err => {
    console.log('Failed to subscribe user: ', err)
    updateBtn()
  })
}

const updateSubscriptionOnServer = (subscription) => {
  // TODO: send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json')
  const subscriptionDetails = document.querySelector('.js-subscription-details')

  if(subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription)
    subscriptionDetails.classList.remove('is-invisible')
  } else {
    subscriptionDetails.classList.add('is-invisible')
  }
}

const unsubscribeUser = () => {
  swRegistration.pushManager.getSubscription()
  .then(subscription => {
    if(subscription) {
      return subscription.unsubscribe()
    }
  })
  .catch(error => {
    console.log('Error while unsubscribe', error)
  })
  .then(() => {
    updateSubscriptionOnServer(null)

    console.log('User is unsubscribed.')
    isSubscribed = false

    updateBtn()
  })
}