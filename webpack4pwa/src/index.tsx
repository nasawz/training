import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Layout } from 'antd';
const { Content } = Layout;
import Rss from './rss'

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

OfflinePluginRuntime.install({
  onInstalled: () => {
    console.log('onInstalled');
  },
  onUpdating: () => {
    console.log('onUpdating');
  },
  onUpdateReady: () => {
    console.log('-->>>');
    OfflinePluginRuntime.applyUpdate()
  },
  onUpdated: () => {
    console.log('----');
    // location.reload()
  },
});

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