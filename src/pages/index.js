import React, { useState, useEffect } from "react"

import server, { resetDb } from "../server"

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

function Container({ children }) {
  return (
    <div className="px-5 md:px-8 max-w-lg md:max-w-2xl xl:max-w-3xl mx-auto">
      {children}
    </div>
  )
}

function Title({ children }) {
  return (
    <h2 className="text-white text-2xl leading-tight md:leading-snug tracking-tight">
      {children}
    </h2>
  )
}

function Text({ children }) {
  return (
    <p className="font-light text-lg leading-normal md:text-xl">{children}</p>
  )
}

function IndexPage() {
  let [activeTab, setActiveTab] = useState(0)
  let [refresh, setRefresh] = useState(0)

  function resetApp() {
    if (server) {
      resetDb(server.db)
      setRefresh(refresh + 1)
    }
  }

  return (
    <div className="antialised text-gray-500 font-body font-light leading-normal relative">
      <div className="absolute inset-x-0 overflow-hidden max-w-full flex justify-center -top-16 lg:top-0">
        <BackgroundLines className="flex-shrink-0 2xl:hidden" />
        <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
      </div>

      <div className="relative z-10">
        <SEO />

        <div className="">
          <div className="px-5 md:px-8 max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            <header className="pt-4">
              <Logo className="w-8 h-8 md:w-10 md:h-16" />
            </header>

            <section className="pt-12 lg:pt-16 2xl:pt-24 pb-20 md:pb-32 xl:pb-40 2xl:pb-48">
              <h1
                className="font-title text-white
                text-3-5xl tracking-tight leading-tighter
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

              <div className="mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl text-gray-400">
                <p className="leading-normal text-lg md:text-xl 2xl:text-2xl 2xl:font-thin">
                  Mirage.js is an API mocking library that lets you build, test
                  and even share a complete working JavaScript application
                  without having to rely on any backend services.
                </p>

                <div className="mt-4 md:mt-6 2xl:mt-8">
                  <p className="leading-normal text-lg md:text-xl 2xl:text-2xl 2xl:font-thin">
                    Sign up and be the first to hear first about our public
                    release:
                  </p>
                </div>
                <div className="mt-8 2xl:text-lg">
                  <SignupForm />
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="bg-gray-1000 py-20 lg:py-24 shadow-black-inset">
          <Container>
            <div>
              <Text>
                Have you ever worked on a React or Vue app that needed data from
                a backend API before it was ready?
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>If so, how’d you handle it?</Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Maybe you created some local mock data directly in your app,
                just so you could keep moving:
              </Text>
            </div>

            <div className="mt-8 lg:mt-12">
              <div className="sm:rounded-lg overflow-hidden -mx-5">
                <Snippet name="1-local-mock-data" />
              </div>
            </div>

            <div className="mt-8 lg:mt-12">
              <Text>Seems harmless enough.</Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Weeks later, the server’s ready and you wire up your app — but
                nothing works like it did during development.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Some screens flash with missing data, others are broken
                entirely, and worst of all, you have no idea how much of your
                code needs to be rewritten.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>How did this happen?</Text>
            </div>

            <div className="mt-8 md:mt-12">
              <Title>You ignored the network for too long.</Title>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                The network is the kind of thing that can't just be dealt with
                at the end of your sprint.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Think about everything that goes into dealing with the network:
                loading and error states, fetching partial data, and caching —
                not to mention the fact that asynchronous APIs like network
                requests add a ton of new states to every one of your app's
                existing user flows.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                When you put off dealing with the network, these issues pile up
                and fall on your lap after you've already written a ton of
                application code — which is the hardest time to deal with them.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                The fact is that your local mock data setup poked one too many
                holes in reality. Because of that, the code you wrote wasn't
                ready for production.
              </Text>
            </div>

            <div className="mt-8 md:mt-12">
              <Title>What if you could have the best of both worlds?</Title>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                What if you could still mock data in the frontend, but also
                ensure that your app only ever accessed that mock data the exact
                same way it would access real server data in production?
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>With Mirage.js, you can.</Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>Here's what it looks like:</Text>
            </div>

            <div className="mt-8 lg:mt-12">
              <div className="flex text-center sm:bg-gray-900 sm:-mx-5 sm:border-b sm:border-gray-600 sm:px-5 sm:pt-1 sm:rounded-t-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`w-1/2 sm:w-auto sm:px-4 hover:text-white focus:outline-none border-b py-2  ${
                    activeTab === 0
                      ? "text-white border-white"
                      : "text-gray-500 border-gray-600 sm:border-transparent"
                  }`}
                >
                  index.js
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={`w-1/2 sm:w-auto sm:px-4 hover:text-white focus:outline-none border-b py-2  ${
                    activeTab === 1
                      ? "text-white border-white"
                      : "text-gray-500 border-gray-600 sm:border-transparent"
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
            </div>

            <div className="mt-8 lg:mt-12">
              <Text>
                You start by defining your API endpoints in Mirage. When you
                boot up your frontend, Mirage kicks in automatically. There's no
                separate server process for you to manage in yet-another
                terminal tab.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Now your components can fetch data from your API endpoints, just
                as if there was a real server. Your components won't contain a
                single line of code that reveals you're using Mirage
                under-the-hood, because they won't even know they're talking to
                Mirage instead of a real API.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                With Mirage, you never have to write throwaway network code
                again.
              </Text>
            </div>

            <div className="mt-8 md:mt-12">
              <Title>Mirage is a server that runs in the browser.</Title>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                And it comes with all the power you'd expect from a real server.
                You can tweak things like latency, error codes, and HTTP
                headers. There's an in-memory database that lets you persist
                data. And you can even write tests against all this
                functionality.
              </Text>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                With Mirage, you can build fully dynamic features entirely in
                your frontend codebase, without having to wire up a production
                server.
              </Text>
            </div>

            <div className="mt-8 md:mt-12">
              <Title>Live demo</Title>
            </div>

            <div className="mt-4 md:mt-6">
              <Text>
                Here's a complete To-Do application — including server-side
                persistence logic — built with React and Mirage:
              </Text>
            </div>

            <div className="mt-12 md:mt-20">
              <div className="max-w-sm mx-auto">
                <TodoApp refresh={refresh} />
              </div>

              <div className="mt-4">
                <button
                  onClick={resetApp}
                  className="text-sm text-green focus:outline-none px-3 py-2 mx-auto flex items-center hover:underline"
                >
                  Reset App
                  <Replay className="ml-1 w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-12 md:mt-20">
              <Text>
                This app is running in the browser. If you take a look at the
                console, you'll see Mirage intercepting all of the React app's
                network requests. The state is not actually being persisted —
                but the React app is ready to be deployed to production, as long
                as there's an API fulfilling the same contract as Mirage.
              </Text>
            </div>
          </Container>
        </section>

        <section className="pt-20 xl:pt-32 pb-72">
          <div className="px-5 md:px-8 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-snug tracking-tight">
              Interested in Mirage and the frontend-first workflow?
            </h2>
            <div className="mt-8">
              <Text>
                Sign up and be the first to hear first about our public release:
              </Text>
            </div>
            <div className="mt-6">
              <SignupForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default IndexPage
