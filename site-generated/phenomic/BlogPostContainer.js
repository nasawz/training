import Head from "react-helmet";
import React from "react";
import { Router, Route, browserHistory, Link } from "react-router";
import {
  createApp,
  createContainer,
  query,
  BodyRenderer,
  textRenderer
} from "@phenomic/preset-react-app/lib/client";
import { Layout, DefaultPostLayout, HeroPostLayout } from './Layout'
import { PageError } from './PageError'


const PostLayouts = {
  default: DefaultPostLayout,
  hero: HeroPostLayout
};

const BlogPost = ({ hasError, isLoading, page }) => {
  if (hasError) {
    return <PageError error={page.error} />;
  }
  const PostLayout =
    (page.node && PostLayouts[page.node.layout]) || PostLayouts.default;

  return (
    <Layout>
      {isLoading && "Loading..."}
      {!isLoading && page.node && <PostLayout {...page.node} />}
      <footer>
        <Link to="/">Go to home</Link>
      </footer>
    </Layout>
  )
};

const BlogPostContainer = createContainer(BlogPost, props => ({
  page: query({ path: "posts", id: props.params.splat })
}));

export {
  BlogPostContainer
}