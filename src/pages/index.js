import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./index.css"

const IndexPage = function({ data }) {
  let html = data.allMarkdownRemark.edges[0].node.html

  return (
    <div className="bg-gray-900 text-gray-400 leading-normal pt-32 pb-16">
      <Layout>
        <div className="max-w-3xl mx-auto">
          <SEO title="Home" />
          <div>
            <h1 className="text-5xl font-bold leading-tight text-white">
              Build a production-ready frontend, even if your API's not ready.
            </h1>
            <div className="text-lg">
              <p className="mt-4">
                Mirage.js is an API mocking library that lets you build, test
                and even share a complete working JavaScript application without
                having to rely on any backend services.
              </p>
              <p className="mt-4">
                Sign up and be the first to hear first about our public release:
              </p>
              <div className="mt-4 flex">
                <input
                  type="text"
                  placeholder="your@email.com"
                  className="mr-4 rounded px-3 py-2"
                />
                <button className="border border-green-500 px-3 py-2 rounded text-green-500">
                  Notify me
                </button>
              </div>
            </div>

            <hr className="mt-24 border border-gray-400" />

            <div className="mt-24 markdown">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
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
