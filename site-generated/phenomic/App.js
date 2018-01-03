import React from "react";
import { Router, Route, browserHistory, Link } from "react-router";
import { createApp, createContainer, query, renderApp } from "@phenomic/preset-react-app/lib/client";
import { BlogPostContainer } from './BlogPostContainer'
import { HomeContainer } from './HomeContainer'
import { PageError } from './PageError'

const routes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={HomeContainer} />
    <Route path="/after/:after" component={HomeContainer} />
    <Route path="/blog/*" component={BlogPostContainer} />
    <Route path="*" component={PageError} />
  </Router>
);

export default createApp(routes);

if (module.hot) {
  module.hot.accept(() => renderApp(routes));
}