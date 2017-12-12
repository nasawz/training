import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Layout } from 'antd';
const { Content } = Layout;
import Rss from './rss'

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

OfflinePluginRuntime.install({
  onUpdateReady: () => {
    console.log('onUpdateReady');
    OfflinePluginRuntime.applyUpdate()
  },
  onUpdated: () => {
    console.log('onUpdated');
    // location.reload()
  },
});

const { serviceWorker } = navigator
console.log(serviceWorker);
serviceWorker.getRegistrations().then(registrations => {
  let registration = registrations[0]
  return registration.pushManager.getSubscription().then((subscription) => {
    console.log(subscription);
    // if (subscription) {
    //   return 0;
    // }
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    }).then((subscription) => {
      console.log(subscription);
      var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
      key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
      var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
      authSecret = rawAuthSecret ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
      endpoint = subscription.endpoint;
      return fetch('/api/register', {
        method: 'post',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          key: key,
          authSecret: authSecret,
        }),
      });
    })
  }).catch((err) => {
    console.log('ServiceWorker registration failed: ', err);
  })
  // console.log('--->>>', registrations);
  // for (const registration of registrations) registration.unregister()
})

var endpoint;
var key;
var authSecret;
var vapidPublicKey = 'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY';

function urlBase64ToUint8Array(base64String) {
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

import './index.less'

ReactDOM.render(
  <AppContainer>
    <Layout className="layout">
      <Content style={{ padding: '10px' }}>
        <Rss />
      </Content>
    </Layout>
  </AppContainer>,
  document.getElementById('mainContainer')
);

declare var module: any
if (module.hot) {
  module.hot.accept();
}