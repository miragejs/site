import React from "react"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"
import SEO from "../components/seo"
import Code from "../components/code"
import SignupForm from "../components/signup-form"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

function Container({ children }) {
  return <div className="px-5">{children}</div>
}

export default function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "homepage-placeholder1.png" }) {
        childImageSharp {
          fluid(maxWidth: 3000) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `)

  return (
    <div className="relative">
      <div className="relative z-10">
        <SEO />

        <div className="bg-gray-1000">
          <div className="absolute inset-x-0 flex justify-center max-w-full overflow-hidden -top-16 xl:top-0">
            <BackgroundLines className="flex-shrink-0 2xl:hidden" />
            <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
          </div>

          <div className="relative z-10 max-w-lg mx-auto md:px-8 md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl">
            <section className="pt-8 pb-20 lg:pt-16 2xl:pt-24 md:pb-32 xl:pb-40 2xl:pb-48">
              <Container>
                <h1 className="tracking-tight text-white leading-tighter text-4-5xl font-title md:text-4-75xl md:leading-tighter lg:text-5xl 2xl:text-5-5xl ">
                  Build complete frontend features,{" "}
                  <br className="hidden md:inline" />
                  <span className="text-green-500">
                    even if your API doesn't exist.
                  </span>
                </h1>

                <div className="max-w-3xl mt-8 md:mt-10 2xl:mt-12 2xl:max-w-4xl">
                  <p className="leading-normal text-gray-500 md:text-xl 2xl:text-2xl">
                    Mirage JS is an API mocking library that lets you build,
                    test and share a complete working JavaScript application
                    without having to rely on any backend services.
                  </p>
                </div>

                <div className="mt-8">
                  <button className="w-full py-3 text-lg font-medium text-center text-white bg-green-500 rounded">
                    Get started
                  </button>
                </div>
              </Container>

              <div className="mt-16">
                <Img fluid={data.file.childImageSharp.fluid} />
              </div>

              <div className="mt-12">
                <Container>
                  <div className="flex -mx-4">
                    <div className="w-1/4 px-4">
                      <ProgressBar progress={66} />
                    </div>
                    <div className="w-1/4 px-4">
                      <ProgressBar progress={0} />
                    </div>
                    <div className="w-1/4 px-4">
                      <ProgressBar progress={0} />
                    </div>
                    <div className="w-1/4 px-4">
                      <ProgressBar progress={0} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="font-medium text-white">Create a Server</p>
                    <p className="mt-3 text-gray-500">
                      Import and use Mirage right alongside the rest of your
                      frontend JavaScript code – no separate server process for
                      you to manage in yet-another terminal tab.
                    </p>
                  </div>
                </Container>
              </div>
            </section>
          </div>
        </div>

        {/* <div className="mt-16">
          <p className="font-medium leading-normal text-white md:text-lg">
            Sign up for updates and to find out when the project's
            ready:
          </p>
        </div>
        <div className="mt-4 md:mt-6 2xl:text-lg">
          <SignupForm />
        </div> */}

        {/* <section className="py-4 pb-12 bg-white md:py-8 md:pb-16">
          <div className="max-w-lg px-5 mx-auto md:max-w-1-5xl lg:max-w-3xl lg:px-10"></div>
        </section>

        <section className="pt-20 xl:pt-32 pb-72">
          <div className="max-w-lg px-5 mx-auto text-center md:px-8 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <h2 className="leading-tight tracking-tight text-white font-title text-2-5xl md:text-3-5xl lg:text-4-5xl md:leading-snug">
              Interested in Mirage and the <br className="hidden sm:inline" />{" "}
              frontend-first workflow?
            </h2>
            <div className="mt-12">
              <p className="font-medium leading-normal text-white md:text-lg">
                Sign up for updates and to find out when the project's ready:
              </p>
            </div>
            <div className="mt-4 md:mt-6">
              <SignupForm />
            </div>
          </div>
        </section> */}
      </div>
    </div>
  )
}

function ProgressBar({ progress }) {
  return (
    <div className="relative w-full h-1 overflow-hidden bg-gray-900 rounded">
      <div
        className="absolute top-0 bottom-0 left-0 bg-green-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}
