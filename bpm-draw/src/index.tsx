
// import * as joint from './rappid/rappid.min'

// import { ThemePicker } from './module/view/theme-picker';

// const themePicker = new ThemePicker({ mainView: null });
// themePicker.render().$el.appendTo(document.body);


declare var module: any
if (module.hot) {
  module.hot.accept();
}


import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from './module/view/main'
import { AppContainer } from 'react-hot-loader';

ReactDOM.render(
  <AppContainer>
    <Main />
  </AppContainer>,
  document.getElementById('mainContainer')
);

declare var module: any
if (module.hot) {
  module.hot.accept();
}