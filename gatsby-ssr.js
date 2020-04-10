/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
const React = require("react")

exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  // setHeadComponents([
  //   <link
  //     rel="stylesheet"
  //     href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
  //   />,
  // ])
  // setPostBodyComponents([
  //   <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>,
  //   <script
  //     dangerouslySetInnerHTML={{
  //       __html: `
  //           docsearch({
  //             // Your apiKey and indexName will be given to you once
  //             // we create your config
  //             apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  //             indexName: 'docsearch',
  //             //appId: '<APP_ID>', // Should be only included if you are running DocSearch on your own.
  //             // Replace inputSelector with a CSS selector
  //             // matching your search input
  //             inputSelector: '#mirage-algolia-search-input',
  //             // Set debug to true to inspect the dropdown
  //             debug: false,
  //           });
  //       `,
  //     }}
  //   />,
  // ])
}
