import * as React from 'react';
import { Spin, List, Avatar, Icon } from 'antd';
import axios from 'axios'
import _ from 'lodash'
import Offline from './offline'

export interface RssProps {
}

export interface RssState {
  listData: Array<Object>
  loading: boolean
}
export default class Rss extends React.Component<RssProps, RssState> {
  setState: any;
  state: RssState

  constructor(props: RssProps) {
    super();
    this.state = {
      listData: [],
      loading: true
    }
  }

  componentDidMount() {
    axios.get('https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeed.cnblogs.com%2Fblog%2Fu%2F24081%2Frss').then((res) => {
      let datas = []
      _.map(res.data.items, (item) => {
        datas.push({
          href: item.link,
          title: item.title,
          description: item.description,
          content: item.content,
        })
      })
      this.setState({
        listData: datas,
        loading: false
      });
    }).catch((err) => {
    })
  }

  render() {

    let rss = (
      <Spin tip="Loading..." spinning={this.state.loading}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.state.listData}
          renderItem={item => (
            <List.Item key={item.title}>
              <List.Item.Meta
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </ List.Item>
          )}
        />
      </Spin>
    );
    if (!navigator.onLine) {
      rss = <Offline />
    }

    return rss
  }
}