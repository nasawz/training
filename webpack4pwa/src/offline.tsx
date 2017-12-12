import * as React from 'react';

export interface OfflineProps {
}

export default class Offline extends React.PureComponent<OfflineProps, any> {
  render() {
    return (
      <div className="offline">
        <div className="img">
          <img src={require('./img/offline.png')} />
        </div>
        <div class="info">
          Offline
        </div>
      </div>
    );
  }
}
