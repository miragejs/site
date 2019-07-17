import React, { useState, useEffect } from "react"

import server from "../server"
import { loadDb, resetDb } from "../lib/persist"

import SEO from "../components/seo"

import Logo from "../assets/images/logo.svg"
import Replay from "../assets/images/replay.svg"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"

import "./index.css"
import "../fonts/GTAmerica/gt-america.css"
import "../fonts/Ginto/ginto.css"

import SignupForm from "../components/signup-form"
import Snippet from "../components/snippet"
import TodoApp from "../components/todo-app"

loadDb()

function Container({ children }) {
  return (
    <div className="px-5 md:px-8 max-w-lg md:max-w-1-5xl mx-auto">
      {children}
    </div>
  )
}

function Title({ children }) {
  return (
    <h2 className="text-gray-900 font-normal text-2xl md:text-3xl leading-snug">
      {children}
    </h2>
  )
}

function Text({ children }) {
  return (
    <p className="text-base md:text-lg font-normal leading-copy">{children}</p>
  )
}

function Spacer({ children, size = "md" }) {
  let classes

  switch (size) {
    case "md":
      classes = "mt-5 md:mt-6"
      break

    case "lg":
      classes = "mt-8 lg:mt-12"
      break

    case "xl":
      classes = "mt-12"
      break

    default:
  }

  return <div className={classes}>{children}</div>
}

function IndexPage() {
  let [activeTab, setActiveTab] = useState(0)
  let [refresh, setRefresh] = useState(0)

  function resetApp() {
    if (server) {
      resetDb()
      setRefresh(refresh + 1)
    }
  }

  return (
    <div className="antialiased text-gray-500 font-body font-light leading-normal relative">
      <div className="absolute inset-x-0 overflow-hidden max-w-full flex justify-center -top-16 lg:top-0">
        <BackgroundLines className="flex-shrink-0 2xl:hidden" />
        <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
      </div>

      <div className="relative z-10">
        <SEO />

        <div className="">
          <div className="px-5 md:px-8 max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            <header className="pt-4">
              <Logo className="mx-auto w-8 h-8 md:w-10 md:h-16" />
            </header>

            <section className="pt-12 lg:pt-16 2xl:pt-24 pb-20 md:pb-32 xl:pb-40 2xl:pb-48">
              <h1
                className="font-title text-white text-center
                text-3-5xl tracking-tight leading-tight
                md:text-4-5xl
                lg:text-5xl
                2xl:text-5-5xl
              "
              >
                Build a production-ready frontend,{" "}
                <br className="hidden md:inline" />
                <span className="text-green">
                  even if your API's not ready.
                </span>
              </h1>

              <div className="text-center mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl mx-auto text-gray-400">
                <p className="text-gray-8 leading-normal text-lg md:text-xl 2xl:text-2xl">
                  Mirage.js is an API mocking library that lets you build, test
                  and share a complete working JavaScript application without
                  having to rely on any backend services.
                </p>

                <div className="mt-16">
                  <p className="lg:text-lg leading-normal text-white font-medium">
                    Sign up to get notified when it's ready:
                  </p>
                </div>
                <div className="mt-4 2xl:text-lg">
                  <SignupForm />
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="bg-white text-gray-5 py-16 md:py-20 lg:py-24">
          <Container>
            <Title>
              Have you ever worked on a React or Vue app that needed to talk to
              a backend API before it was ready?
            </Title>

            <Spacer />

            <Text>If so, how’d you handle it?</Text>

            <Spacer />

            <Text>
              Maybe you created some mock data directly in your app just to keep
              you moving:
            </Text>

            <Spacer size="lg" />

            <div className="sm:rounded-lg overflow-hidden -mx-5">
              <Snippet name="1-local-mock-data" />
            </div>

            <Spacer size="lg" />

            <Text>Seems harmless enough.</Text>

            <Spacer />

            <Text>
              Weeks later, the server’s ready and you wire up your app — but
              nothing works like it did during development.
            </Text>

            <Spacer />

            <Text>
              Some screens flash with missing data, others are broken entirely,
              and worst of all, you have no idea how much of your code needs to
              be rewritten.
            </Text>

            <Spacer />

            <Text>How did this happen?</Text>

            <Spacer size="xl" />

            <Title>You ignored the network for too long.</Title>

            <Spacer />

            <Text>
              Code that deals with the network isn't the kind of thing you can
              just tack on to the end of a sprint.
            </Text>

            <Spacer />

            <Text>
              Think about everything that comes along with making network
              requests: loading and error states, fetching partial data,
              caching... not to mention the fact that asynchronous APIs like
              network requests add a <em className="italic">ton</em> of new
              states to every one of your app's existing user flows.
            </Text>

            <Spacer />

            <Text>
              If you don't grapple with this crucial part of your application up
              front, you're just going to have to rewrite a ton of code when it
              comes time to deploy your app.
            </Text>

            <Spacer />

            <Text>
              You're not doing yourself any favors by writing code that avoids
              the network. You're just poking holes in reality. And code that
              doesn't grapple with reality isn't ready for production.
            </Text>

            <Spacer size="xl" />

            <Title>What if you could have the best of both worlds?</Title>

            <Spacer />

            <Text>
              What if you could still mock data in your frontend app, but be
              sure that your application code could only access that data in the
              same way it could access real production data?
            </Text>

            <Spacer />

            <Text>
              That way, you'd be writing code that was ready for the network
              from day one.
            </Text>

            <Spacer />

            <Text>
              <strong className="font-medium">
                Mirage.js let's you do exactly that.
              </strong>
            </Text>

            <Spacer />

            <Text>Here's how it works:</Text>

            <Spacer size="lg" />

            <div className="flex text-center sm:bg-gray-900 sm:-mx-5 sm:border-b sm:border-gray-600 sm:px-5 sm:pt-1 sm:rounded-t-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(0)}
                className={`w-1/2 sm:w-auto sm:px-4 hover:text-gray-900 sm:hover:text-white focus:outline-none border-b py-2  ${
                  activeTab === 0
                    ? "text-gray-900 border-gray-900 sm:text-white sm:border-white"
                    : "text-gray-400 border-gray-200 sm:border-transparent"
                }`}
              >
                index.js
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`w-1/2 sm:w-auto sm:px-4 hover:text-gray-900 sm:hover:text-white focus:outline-none border-b py-2  ${
                  activeTab === 1
                    ? "text-gray-900 border-gray-900 sm:text-white sm:border-white"
                    : "text-gray-400 border-gray-200 sm:border-transparent"
                }`}
              >
                App.js
              </button>
            </div>

            <div className="-mx-5 mt-6 sm:mt-0 sm:rounded-b-lg overflow-hidden">
              {activeTab === 0 ? (
                <Snippet name="2-mirage-index" />
              ) : (
                <Snippet name="2-mirage-app" />
              )}
            </div>

            <Spacer size="lg" />

            <Text>
              You start by defining your API endpoints in Mirage. When you boot
              up your frontend, Mirage kicks in automatically. There's no
              separate server process for you to manage in yet-another terminal
              tab.
            </Text>

            <Spacer />

            <Text>
              In development, your components can fetch data from Mirage's API
              endpoints, just as if they were talking to a real server. Your app
              won't contain a single line of code that reveals you're using
              Mirage under-the-hood, because it won't even know it's talking to
              Mirage instead of a real API.
            </Text>

            <Spacer />

            <Text>
              When you're ready to deploy, simply build your app without Mirage,
              and point it at your production API server.
            </Text>

            <Spacer />

            <Text>
              With Mirage, you'll never write throwaway network code again.
            </Text>

            <Spacer size="xl" />

            <Title>Mirage is a server that runs in the browser.</Title>

            <Spacer />

            <Text>
              And it comes with all the power you'd expect from a real server.
            </Text>

            <Spacer />

            <Text>
              You can tweak things like latency, error codes, and HTTP headers.
              There's an in-memory database that lets you build dynamic features
              involving persistent data. And you can even write tests against
              any of this functionality.
            </Text>

            <Spacer />

            <Text>
              Here's a complete Todo application (with server-side persistence
              logic) built with Mirage and React:
            </Text>

            <Spacer size="xl" />

            <div className="max-w-sm mx-auto">
              <TodoApp refresh={refresh} />
            </div>

            <div className="mt-4">
              <button
                onClick={resetApp}
                className="text-sm text-blue-500 focus:outline-none px-3 py-2 mx-auto flex items-center hover:underline"
              >
                Reset app
                <Replay className="ml-1 w-4 h-4" />
              </button>
            </div>

            <Spacer size="xl" />

            <Text>
              <span className="xl:hidden">
                This app is running in the browser, but Mirage is intercepting
                all the React app's network requests.
              </span>
              <span className="hidden xl:visible">
                This app is running in the browser. If you take a look at the
                console, you'll see Mirage intercepting all of the React app's
                network requests.
              </span>{" "}
              The data is not actually being persisted to a real server. But the
              React app is deployable, and ready to talk to a real API that
              fulfills the same contract that Mirage is providing.
            </Text>

            <Spacer />

            <Text>
              Once you see how much confidence you can have building fully
              dynamic features entirely in the frontend, you'll wonder how you
              ever did it any other way.
            </Text>
          </Container>
        </section>

        <section className="pt-20 xl:pt-32 pb-72">
          <div className="text-center px-5 md:px-8 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            <h2 className="text-white text-2-5xl md:text-3xl lg:text-4xl leading-tight md:leading-snug tracking-tight">
              Interested in Mirage and the frontend-first workflow?
            </h2>
            <div className="mt-12">
              <p className="lg:text-lg leading-normal text-white font-medium">
                Sign up to get notified when it's ready:
              </p>
            </div>
            <div className="mt-3">
              <SignupForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default IndexPage
