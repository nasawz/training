
import * as joint from './rappid/rappid.min'

import { ThemePicker } from './module/view/theme-picker';

const themePicker = new ThemePicker({ mainView: null });
themePicker.render().$el.appendTo(document.body);


declare var module: any
if (module.hot) {
  module.hot.accept();
}