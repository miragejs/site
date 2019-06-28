import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = function({ data }) {
  let html = data.allMarkdownRemark.edges[0].node.html

  return (
    <div className="bg-gray-500">
      <Layout>
        <SEO title="Home" />
        <div className="max-w-md mx-auto">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div> */}
      </Layout>
    </div>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(filter: { frontmatter: { page: { eq: "homepage" } } }) {
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
