import React from "react"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"
import Rings from "../assets/images/rings.svg"
import QuoteOpen from "../assets/images/quote-open.svg"
import QuoteClose from "../assets/images/quote-close.svg"
import Browsers from "../assets/images/homepage-image-2.svg"
import HomepageImage3 from "../assets/images/homepage-image-3.svg"
import SEO from "../components/seo"
import Code from "../components/code"
import SignupForm from "../components/signup-form"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import Snippet from "../components/snippet"

export default function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      homepageVideo: file(relativePath: { eq: "homepage-placeholder1.png" }) {
        childImageSharp {
          fluid(maxWidth: 3000) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
      testimonial1: file(relativePath: { eq: "homepage-testimonial-1.png" }) {
        childImageSharp {
          fluid(maxWidth: 120) {
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

        <section className="bg-gray-1000">
          <div className="absolute inset-x-0 flex justify-center max-w-full overflow-hidden -top-16 xl:top-0">
            <BackgroundLines className="flex-shrink-0 2xl:hidden" />
            <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
          </div>

          <div className="relative z-10 max-w-lg mx-auto md:px-8 md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl">
            <div className="pt-8 pb-20 lg:pt-16 2xl:pt-24 md:pb-32 xl:pb-40 2xl:pb-48">
              <Container>
                <h1 className="tracking-tight text-white leading-tighter text-4-5xl font-title md:text-4-75xl md:leading-tighter lg:text-5xl 2xl:text-5-5xl ">
                  Build complete frontend features,{" "}
                  <br className="hidden md:inline" />
                  <span className="text-green-500">
                    even if your API doesn't exist.
                  </span>
                </h1>

                <div className="max-w-3xl mt-8 md:mt-10 2xl:mt-12 2xl:max-w-4xl">
                  <Text color="light-gray">
                    Mirage JS is an API mocking library that lets you build,
                    test and share a complete working JavaScript application
                    without having to rely on any backend services.
                  </Text>
                </div>

                <div className="mt-8">
                  <button className="w-full py-3 text-lg font-medium text-center text-white bg-green-500 rounded">
                    Get started
                  </button>
                </div>
              </Container>

              <div className="mt-16">
                <Img fluid={data.homepageVideo.childImageSharp.fluid} />
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
                    <div className="mt-3">
                      <Text color="light-gray">
                        Import and use Mirage right alongside the rest of your
                        frontend JavaScript code – no separate server process
                        for you to manage in yet-another terminal tab.
                      </Text>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 overflow-hidden bg-white">
          <Rings className="absolute top-0 z-0" />

          <div className="relative z-10">
            <Container>
              <Title>
                The <span className="text-green-500">best DX</span> for frontend
                development.
              </Title>
              <div className="mt-4">
                <Text color="dark-gray">
                  Say goodbye to configuring and running painful backend
                  environments just to hack on the dynamic parts of your
                  frontend. Mirage runs alongside the rest of your frontend
                  code, so there’s no new infrastruture for you to learn.{" "}
                </Text>
              </div>
            </Container>

            <div className="mt-8">
              <div className="px-2">
                <div className="overflow-hidden rounded-lg">
                  <Snippet name="homepage-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-green-500">
          <Container>
            <div className="relative">
              <QuoteOpen className="absolute w-20" />
              <QuoteClose className="absolute bottom-0 right-0 w-20" />
              <div className="pt-8 pb-6">
                <p className="text-lg text-white">
                  Honestly, I can't recommend this tool enough. Finally an
                  idiomatic way for a frontend developer to prototype and test
                  an entire feature without touching a real API! Productivity
                  just goes through the roof.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <Img
                className="w-24 mr-4 rounded-full"
                fluid={data.testimonial1.childImageSharp.fluid}
              />
              <div className="flex-shrink-0 leading-none">
                <p className="text-lg font-medium text-white">Roman Sandler</p>
                <p className="mt-2 text-green-200">Founder of Brixton Apps</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative pt-16 bg-gray-100">
          <div className="relative z-10">
            <Container>
              <Title>
                Write{" "}
                <span className="text-green-500">high-level UI tests</span> that
                stress your networking code.
              </Title>

              <div className="mt-4">
                <Text color="dark-gray">
                  Mirage lets you put your API into any state needed to stress
                  some piece of dynamic functionality in your app. Test how your
                  app handles 0 blog posts, 10, or 1000 – or even how it behaves
                  when your server is slow or returns an error. No messy network
                  mocking code or handcrafting API respones – just real-world
                  scenarios validating the entire functionality of your full
                  application.
                </Text>
              </div>

              <div className="mt-16">
                <Browsers className="max-w-full" />
              </div>
            </Container>
          </div>

          <div className="absolute bottom-0 z-0 w-full text-white">
            <svg className="w-full fill-current" viewBox="0 0 100 35">
              <polygon points="0,18 0,35 100,35 100,0" />
            </svg>
          </div>
        </section>

        <section className="pt-24 pb-16 bg-white">
          <Container>
            <Title>
              Share a <span className="text-green-500">fully-working UI</span>{" "}
              without needing a backend.
            </Title>

            <div className="mt-4">
              <Text color="dark-gray">
                Because Mirage realistically mocks out your full API server, you
                can share a clickable, working prototype of your JavaScript
                application without needing to run any backend services.
              </Text>
            </div>
          </Container>

          <div className="mt-12">
            <HomepageImage3 className="mx-auto w-72" />
          </div>
        </section>

        <section className="py-16 bg-gray-600">
          <Container>
            <div className="relative">
              <QuoteOpen className="absolute w-20" />
              <QuoteClose className="absolute bottom-0 right-0 w-20" />
              <div className="pt-8 pb-6">
                <p className="text-lg text-white">
                  Reminder: If there is one single piece of software born in
                  2015 that has change the way I build software, it's Mirage. It
                  just enables a different way of doing frontend/backend
                  collaboration. Use it now. Gold.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <Img
                className="w-24 mr-4 rounded-full"
                fluid={data.testimonial1.childImageSharp.fluid}
              />
              <div className="flex-shrink-0 leading-none">
                <p className="text-lg font-medium text-white">Roman Sandler</p>
                <p className="mt-2 text-gray-300">Founder of Brixton Apps</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="pt-24 pb-32 bg-white">
          <div className="text-center">
            <Container>
              <Title>Ready to start using Mirage in your app?</Title>

              <div className="mt-4">
                <Text color="dark-gray">
                  Mirage works with all major JavaScript frameworks, libraries
                  and test runners.
                </Text>
              </div>

              <div className="mt-8">
                <button className="w-full py-3 text-lg font-medium text-center text-white bg-green-500 rounded">
                  Get started
                </button>
              </div>
            </Container>
          </div>
        </section>

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

function Container({ children }) {
  return <div className="px-5">{children}</div>
}

function Title({ children }) {
  return (
    <h2 className="text-3xl leading-tight text-gray-1000 font-title">
      {children}
    </h2>
  )
}

function Text({ children, color }) {
  let styles = {
    "light-gray": "text-gray-500",
    "dark-gray": "text-gray-700",
  }

  if (styles[color] === undefined) {
    throw new Error("<Text> requires a color.")
  }

  return <p className={`${styles[color]}`}>{children}</p>
}
