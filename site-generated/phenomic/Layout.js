import * as React from "react";
import Head from "react-helmet";
import {
  createApp,
  createContainer,
  query,
  BodyRenderer,
  textRenderer
} from "@phenomic/preset-react-app/lib/client";

const Layout = ({ children }) => (
  <div>
    <Head>
      <html lang="en" /> {/* this is valid react-helmet usage! */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <header>{/* ... */}</header>
    <div>{children}</div>
    <footer>{/* ... */}</footer>
  </div>
);

const DefaultPostLayout = ({ title, body }) => (
  <article>
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content={textRenderer(body).slice(0, 150) + "…"}
      />
    </Head>
    <h1>{title}</h1>
    <BodyRenderer>{body}</BodyRenderer>
  </article>
);


const HeroPostLayout = ({ title, body }) => (
  <article>
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content={textRenderer(body).slice(0, 150) + "…"}
      />
    </Head>
    <div style={{ padding: "4rem", background: "pink", color: "#fff" }}>
      <h1>{title}</h1>
    </div>
    <BodyRenderer>{body}</BodyRenderer>
  </article>
);


// const BlogPost = ({ isLoading, page }) => {
//   const PostLayout =
//     (page.node && PostLayouts[page.node.layout]) || PostLayouts.default;
//   return (
//     <Layout>
//       {isLoading && "Loading..."}
//       {!isLoading && page.node && <PostLayout {...page.node} />}
//       <footer>
//         <Link to="/">Go to home</Link>
//       </footer>
//     </Layout>
//   );
// };

export {
  Layout,
  DefaultPostLayout,
  HeroPostLayout
}