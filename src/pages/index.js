import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = function({ data }) {
  let html = data.allMarkdownRemark.edges[0].node.html;

  return (
    <Layout>
      <SEO title="Home" />
      <h1 className="bg-blue-500">Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  )
};

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(filter: {frontmatter: {page: {eq: "homepage"}}}) {
      edges {
        node {
          html
          frontmatter {
            title
          }
        }
      }
    }
  }
`

export default IndexPage
