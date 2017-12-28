
import * as joint from './rappid/rappid.min'

console.log(joint);

declare var module: any
if (module.hot) {
  module.hot.accept();
}