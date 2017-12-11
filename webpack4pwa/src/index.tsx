import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Layout } from 'antd';
const { Content } = Layout;
import Rss from './rss'

import './index.less'

import { DatePicker } from 'antd';

ReactDOM.render(
  <AppContainer>
    <Layout className="layout">
      <Content style={{ padding: '50px' }}>
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