import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.less'

import { DatePicker } from 'antd';

ReactDOM.render(
  <AppContainer>
    <div>pwa</div>
  </AppContainer>,
  document.getElementById('mainContainer')
);

declare var module: any
if (module.hot) {
  module.hot.accept();
}