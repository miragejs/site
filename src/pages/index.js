import React, { useState } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Logo from "../assets/images/logo.svg"
import BackgroundLines from "../assets/images/background-lines.svg"

import "./index.css"
import "../fonts/GTAmerica/gt-america.css"
import "../fonts/Ginto/ginto.css"

import Snippet from "./components/snippet"

function SignupForm() {
  let convertKitUrl = "https://app.convertkit.com/forms/987317/subscriptions"
  let [email, setEmail] = useState("")
  let [formState, setFormState] = useState("")

  let isSaving = formState === "saving"
  let didError = formState === "error"
  let didSignup = formState === "finished"

  let handleSubmit = async function(event) {
    event.preventDefault()
    if (!email) {
      setFormState("error")
    } else {
      setFormState("saving")

      let formData = new FormData(event.target)

      try {
        let response = await fetch(convertKitUrl, {
          method: "POST",
          body: formData,
        })

        let state = response.ok ? "finished" : "error"
        setFormState(state)
      } catch (e) {
        setFormState("error")
      }
    }
  }

  return (
    <div>
      {didSignup ? (
        <div>Thanks {email}, you're all signed up!</div>
      ) : (
        <form onSubmit={handleSubmit} action={convertKitUrl} method="post">
          <div className="md:flex">
            <input
              type="text"
              name="email_address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-gray-dark w-full max-w-sm mr-4 rounded p-3 border-2 border-transparent focus:outline-none focus:border-green"
            />
            <button
              disabled={isSaving && "disabled"}
              className="mt-4 w-full border-2 border-green p-3 rounded text-green hover:bg-green hover:text-white focus:outline-none focus:outline-shadow"
            >
              Get notified
            </button>
          </div>
          {didError && (
            <div className="text-red">Opps, looks like there was an error.</div>
          )}
        </form>
      )}
    </div>
  )
}

function Container({ children }) {
  return <div className="px-5">{children}</div>
}

function Title({ children }) {
  return (
    <h2 className="text-white text-2xl leading-snug tracking-tight">
      {children}
    </h2>
  )
}

function Text({ children }) {
  return <p className="font-light text-lg leading-copy">{children}</p>
}

function IndexPage({ data }) {
  // let html = data.allMarkdownRemark.edges[0].node.html

  return (
    <div className="antialised text-gray-light font-body font-light leading-normal md:pt-24 pb-32 relative">
      <div className="absolute top-0 inset-x-0 overflow-hidden max-w-full flex justify-center">
        <BackgroundLines className="flex-shrink-0" />
      </div>

      <div className="relative z-10">
        <Layout>
          <div className="max-w-4xl mx-auto">
            <SEO />

            <section className="pt-6 pb-20">
              <Container>
                <Logo className="w-10 md:w-12 h-8 md:h-16" />

                <div className="mt-6">
                  <h1 className="font-title text-4xl md:text-5xl tracking-title leading-title md:leading-tight text-white">
                    Build a production-ready frontend,{" "}
                    <br className="hidden md:inline" />
                    <span className="text-green">
                      even if your API's not ready.
                    </span>
                  </h1>
                </div>

                <div className="mt-8 md:mt-16 max-w-3xl">
                  <Text>
                    Mirage.js is an API mocking library that lets you build,
                    test and even share a complete working JavaScript
                    application without having to rely on any backend services.
                  </Text>
                  <div className="mt-4">
                    <Text>
                      Sign up and be the first to hear first about our public
                      release:
                    </Text>
                  </div>
                  <div className="mt-8">
                    <SignupForm />
                  </div>
                </div>
              </Container>
            </section>

            <section
              className="pt-12"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #020202, #1A1C1D )",
              }}
            >
              <Container>
                <Title>
                  Have you ever worked on a React or Vue app that needed data
                  from an incomplete API?
                </Title>

                <div className="mt-6">
                  <Text>If so, how’d you deal with it?</Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Maybe you created some dummy data in JavaScript just so you
                    could keep moving:
                  </Text>
                </div>

                <div className="mt-8">
                  <Snippet name="example-1" />
                </div>

                <div className="mt-8">
                  <Text>Seems harmless enough.</Text>
                </div>

                <div className="mt-4">
                  <Text>
                    But then you realize the code you’re writing isn’t really
                    production-ready. Your React components are rendering local
                    data, but eventually they’ll be making asynchronous network
                    requests and rendering from JSON.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    And we all know that those are two very different worlds.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Even worse, any time your app needs to persist data back to
                    your server, you’re kinda stuck. Your dummy data doesn’t let
                    you easily build out and test these sorts of dynamic
                    features.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Before you know it, you’ve spent half your time cobbling
                    together a mock API instead of focusing on your application.
                  </Text>
                </div>

                <div className="mt-10">
                  <Title>What if there was a better way?</Title>
                </div>

                <div className="mt-4">
                  <Text>
                    What if you had a tool that embraced your frontend workflow,
                    giving you everything you needed to build out complete,
                    production-ready JavaScript features without having to wait
                    on your production API?
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>That's exactly why Mirage.js was created.</Text>
                </div>

                <div className="mt-4">
                  <Text>Here’s what it looks like:</Text>
                </div>

                <div className="mt-8">
                  <Snippet name="example-2" />
                </div>

                {/* <div className="markdown max-w-3xl mx-auto">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div> */}

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
              </Container>
            </section>
          </div>
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
