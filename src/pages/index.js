import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import Logo from "../images/logo.svg"
import BackgroundLines from "../images/background-lines-lg.svg"

import "./index.css"
import "../fonts/GTAmerica/gt-america.css"
import "../fonts/Ginto/ginto.css"

function SignupForm() {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder="your@email.com"
        className="w-full max-w-sm mr-4 rounded px-3 py-2 border-3 border-transparent focus:outline-none focus:border-green"
      />
      <button className="border border-green px-3 py-2 rounded text-green hover:bg-green hover:text-white focus:outline-none focus:outline-shadow">
        Notify me
      </button>
    </div>
  )
}

function IndexPage({ data }) {
  let html = data.allMarkdownRemark.edges[0].node.html

  return (
    <div className="antialised text-gray-light font-body font-light leading-normal tracking-wide pt-24 pb-32 relative">
      <div
        className="absolute inset-0 bg-no-repeat bg-top"
        style={{
          backgroundImage: `url(${BackgroundLines})`,
        }}
      ></div>

      <div className="relative z-10">
        <Layout>
          <div className="max-w-4xl px-4 mx-auto">
            <SEO title="Home" />
            <div>
              <div
                className="w-12 h-16 bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${Logo})` }}
              ></div>
              <h1 className="font-title text-5xl leading-tight text-white tracking-wide">
                Build a production-ready frontend,{" "}
                <span className="text-green">
                  even if your API's not ready.
                </span>
              </h1>
              <div className="mt-16 text-lg max-w-3xl">
                <p>
                  Mirage.js is an API mocking library that lets you build, test
                  and even share a complete working JavaScript application
                  without having to rely on any backend services.
                </p>
                <p className="mt-4">
                  Sign up and be the first to hear first about our public
                  release:
                </p>
                <div className="mt-6">
                  <SignupForm />
                </div>
              </div>

              <hr className="mt-24 w-1/4 border border-gray-400" />

              <div className="mt-24 markdown max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>

              <hr className="mt-24 w-1/4 border border-gray-400" />

              <div className="text-xl mt-24 max-w-3xl mx-auto">
                <p className="mt-4 text-gray-lighter font-bold">
                  Interested in Mirage and the frontend-first workflow?
                </p>
                <p className="mt-4">
                  Sign up and be the first to hear first about our public
                  release:
                </p>
                <div className="mt-6">
                  <SignupForm />
                </div>
              </div>
            </div>
          </div>

          {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
          <Image />
        </div> */}
        </Layout>
      </div>
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
