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
              className="text-gray-900 w-full max-w-sm mr-4 rounded p-3 border-2 border-transparent focus:outline-none focus:border-green"
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
    <div className="antialised text-gray-500 font-body font-light leading-normal md:pt-24 pb-32 relative">
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
                  from a backend API before it was ready?
                </Title>

                <div className="mt-6">
                  <Text>If so, how’d you handle it?</Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Maybe you created some local mock data directly in your app,
                    just to keep you moving:
                  </Text>
                </div>

                <div className="mt-8">
                  <Snippet name="1-local-mock-data" />
                </div>

                <div className="mt-8">
                  <Text>Seems harmless enough.</Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Weeks later, the server’s ready and you wire up your app –
                    but nothing works like it did during development.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Some screens flash with missing data, others are broken
                    entirely, and worst of all, you have no idea how much of
                    your code needs to be rewritten.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>How did this happen?</Text>
                </div>

                <div className="mt-10">
                  <Title>You ignored the network for too long.</Title>
                </div>

                <div className="mt-4">
                  <Text>
                    Dealing with the network is a huge part of your application.
                    You can't just put it off until the end of your project –
                    it's fundamental complexity that needs to be dealt with from
                    the start.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Think about everything that goes into dealing with the
                    network: loading and error states, fetching partial data and
                    caching... not to mention the fact that asynchronous APIs
                    like network requests add a ton of new states to your app's
                    existing user flows.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    When you put off dealing with the network, all these issues
                    fell on your lap after you had already written a ton of
                    code.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    The fact is that your local mock data setup poked one too
                    many holes in reality. And because of that, the code you
                    wrote wasn't ready for production.
                  </Text>
                </div>

                <div className="mt-10">
                  <Title>What if you could have the best of both worlds?</Title>
                </div>

                <div className="mt-4">
                  <Text>
                    What if you could still mock data in the frontend, but also
                    ensure that your app could only ever access that mock data
                    in exactly the same way it accesses real server data in
                    production?
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>With Mirage.js, you can.</Text>
                </div>

                <div className="mt-4">
                  <Text>Here's what it looks like:</Text>
                </div>

                <div className="mt-8">
                  <div className="flex text-white text-center">
                    <button className="w-1/2 border-b border-white pb-2">
                      index.js
                    </button>
                    <button className="w-1/2 border-b border-gray-700 pb-2">
                      App.js
                    </button>
                  </div>

                  <div className="mt-6">
                    <Snippet name="2-mirage-index" />
                  </div>
                </div>

                <div className="mt-8">
                  <Text>
                    You start by defining your API endpoints with Mirage. When
                    you boot up your frontend, Mirage kicks in automatically.
                    There's no separate server process for you to manage in
                    yet-another terminal tab.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    Now your components can fetch things from your API
                    endpoints, and Mirage will respond back with its own mock
                    data. But your components won't contain a single line of
                    code that reveals you're using Mirage under-the-hood,
                    because your components don't even know they're using Mirage
                    instead of a real API.
                  </Text>
                </div>

                <div className="mt-4">
                  <Text>
                    With Mirage, you'll never have to write throwaway network
                    code again.
                  </Text>
                </div>

                <hr className="mt-24 w-1/4 border border-gray-400" />

                <div className="text-xl mt-24 max-w-3xl mx-auto">
                  <p className="mt-4 text-gray-100 font-bold">
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
