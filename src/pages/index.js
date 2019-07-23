import React from "react"
import Logo from "../assets/images/logo.svg"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"
import IndexCopy from "./index-copy"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SignupForm from "../components/signup-form"

export default function IndexPage() {
  return (
    <Layout>
      <div className="relative">
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
                text-3-5xl tracking-tight leading-tight
                md:text-4-75xl md:leading-tighter
                lg:text-5xl
                2xl:text-5-5xl
              "
                >
                  Build a production-ready frontend,{" "}
                  <br className="hidden md:inline" />
                  <span className="text-green-500">
                    even if your API's not ready.
                  </span>
                </h1>

                <div className="mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl text-gray-400">
                  <p className="text-gray-8 leading-normal text-lg md:text-xl 2xl:text-2xl">
                    Mirage.js is an API mocking library that lets you build,
                    test and share a complete working JavaScript application
                    without having to rely on any backend services.
                  </p>

                  <div className="mt-16">
                    <p className="md:text-lg leading-normal text-white font-medium">
                      Sign up to get notified when it's ready:
                    </p>
                  </div>
                  <div className="mt-4 md:mt-6 2xl:text-lg">
                    <SignupForm />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="bg-white text-gray-5 py-4 pb-12 md:py-8 md:pb-16">
            <div className="px-5 max-w-lg md:max-w-1-5xl lg:max-w-3xl lg:px-10 mx-auto">
              <IndexCopy />
            </div>
          </section>

          <section className="pt-20 xl:pt-32 pb-72">
            <div className="text-center px-5 md:px-8 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
              <h2 className="font-title text-white text-2-5xl md:text-3-5xl lg:text-4-5xl leading-tight md:leading-snug tracking-tight">
                Interested in Mirage and the <br className="hidden sm:inline" />{" "}
                frontend-first workflow?
              </h2>
              <div className="mt-12">
                <p className="md:text-lg leading-normal text-white font-medium">
                  Sign up to get notified when it's ready:
                </p>
              </div>
              <div className="mt-4 md:mt-6">
                <SignupForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
