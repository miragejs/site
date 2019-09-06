import React from "react"
import { MDXProvider } from "@mdx-js/react"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"
import SEO from "../components/seo"
import Code from "../components/code"
import SignupForm from "../components/signup-form"

export default function IndexPage({ children }) {
  return (
    <div className="relative">
      <div className="relative z-10">
        <SEO />

        <div className="bg-gray-1000">
          <div className="absolute -top-16 xl:top-0 inset-x-0 overflow-hidden max-w-full flex justify-center">
            <BackgroundLines className="flex-shrink-0 2xl:hidden" />
            <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
          </div>

          <div className="px-5 md:px-8 max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl mx-auto z-10 relative">
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

              <div className="mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl">
                <p className="text-gray-500 leading-normal text-lg md:text-xl 2xl:text-2xl">
                  Mirage JS is an API mocking library that lets you build, test
                  and share a complete working JavaScript application without
                  having to rely on any backend services.
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

        <section className="bg-white py-4 pb-12 md:py-8 md:pb-16">
          <div className="px-5 max-w-lg md:max-w-1-5xl lg:max-w-3xl lg:px-10 mx-auto">
            <MDXProvider components={components}>{children}</MDXProvider>
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
  )
}

const components = {
  h1: props => (
    <h1
      {...props}
      className="text-gray-1000 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-3xl leading-tight
        md:text-5xl
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
    <h2
      {...props}
      className="text-gray-1000 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-2-25xl leading-tight
        md:text-3-5xl
      "
    >
      {props.children}
    </h2>
  ),

  h3: props => (
    <h3
      {...props}
      className="text-gray-1000 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-1-2xl leading-tight
        md:text-2xl
      "
    >
      {props.children}
    </h3>
  ),

  p: props => (
    <p
      {...props}
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
      "
    >
      {props.children}
    </p>
  ),

  ul: props => (
    <ul {...props} className="ml-8 list-disc">
      {props.children}
    </ul>
  ),

  li: props => (
    <li
      {...props}
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
      "
    >
      {props.children}
    </li>
  ),

  strong: props => (
    <strong {...props} className="font-medium">
      {props.children}
    </strong>
  ),

  a: props => (
    <a {...props} className="underline text-blue-500">
      {props.children}
    </a>
  ),

  pre: props => <div {...props} />,

  code: props => (
    <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-auto md:w-5/6 md:shadow-lg my-8 md:my-10 lg:my-12">
      <Code {...props} />
    </div>
  ),
}
