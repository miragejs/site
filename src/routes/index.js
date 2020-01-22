import React, { Fragment, useState } from "react"
import { ReactComponent as QuoteOpen } from "../assets/images/quote-open.svg"
import { ReactComponent as QuoteClose } from "../assets/images/quote-close.svg"
import ringsUrl from "../assets/images/rings.svg"
import testingImageUrl from "../assets/images/homepage/testing.png"
import prototypeImageUrl from "../assets/images/homepage/prototype.png"
import overlayMeteorsImageUrl from "../assets/images/homepage/overlay-meteors.png"
import SEO from "../components/seo"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import Snippet from "../components/snippet"
import { Link } from "@reach/router"
import { useRouter } from "../hooks/use-router"
import { SectionWithLines, AspectRatio } from "../components/ui"
import { keyframes } from "styled-components"
import Vimeo from "@u-wave/react-vimeo"
import { useSpring, animated } from "react-spring"
import { usePrevious } from "../hooks/use-previous"

const scroll = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-988px);
  }
`

export default function IndexPage() {
  const router = useRouter()
  const data = useStaticQuery(graphql`
    query {
      testimonial1: file(
        relativePath: { eq: "homepage/testimonial-roman.jpeg" }
      ) {
        childImageSharp {
          fluid(maxWidth: 128, quality: 100) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `)

  let [currentTime, setCurrentTime] = useState(0)

  function handleTimeUpdate(event) {
    setCurrentTime(event.seconds)
  }

  let segments = {
    createServer: { start: 0, end: 15 },
    useDatabase: { start: 15, end: 40 },
    seedFactories: { start: 40, end: 55 },
    writeTest: { start: 55, end: 63 },
  }

  let currentSegment =
    Object.keys(segments).find(name => {
      let segment = segments[name]
      return segment.start < currentTime && segment.end >= currentTime
    }) || Object.keys(segments)[0]

  return (
    <div className="relative">
      <div className="relative z-10">
        <SEO />

        <SectionWithLines>
          <div className="pt-8 pb-20 md:pt-16 lg:pt-16 md:pb-32 xl:pb-40 2xl:pb-48">
            <Gutters>
              <Container>
                <div className="md:text-center">
                  <h1 className="tracking-tight text-white leading-tighter text-4-5xl font-title md:text-4-75xl md:leading-tighter lg:text-5xl 2xl:text-5-5xl ">
                    Build complete frontend features,{" "}
                    <br className="hidden md:block" />
                    <span className="text-green-500">
                      even if your API doesn't exist.
                    </span>
                  </h1>

                  <div className="flex justify-center mt-8 md:mt-10">
                    <Text color="light-gray">
                      Mirage JS is an API mocking library that lets you build,
                      test and share a complete working JavaScript application
                      without having to rely on any backend services.
                    </Text>
                  </div>

                  <div className="flex mt-8 md:justify-center">
                    <Link
                      to={router.routerFor("/docs").pages[0].fullPath}
                      className="flex items-center justify-center block w-full px-4 py-3 text-lg font-medium text-center text-white bg-green-500 rounded md:py-2 md:w-auto"
                    >
                      Get started <Caret className="inline w-2 ml-2" />
                    </Link>
                  </div>
                </div>
              </Container>
            </Gutters>

            <div className="mt-16 2xl:mt-24"></div>

            <div className="md:px-8">
              <div className="max-w-lg mx-auto md:max-w-4xl 2xl:max-w-5xl">
                <AspectRatio ratio={16 / 9}>
                  <Vimeo
                    video="386535369"
                    controls={false}
                    autoplay={true}
                    muted={true}
                    loop={true}
                    responsive={true}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </AspectRatio>
              </div>
            </div>

            <div className="mt-12"></div>

            <Gutters>
              <div className="max-w-lg mx-auto md:max-w-4xl 2xl:max-w-5xl">
                <div className="flex -mx-4">
                  <div className="w-1/4 px-4">
                    <VideoSegmentProgress
                      start={segments.createServer.start}
                      end={segments.createServer.end}
                      current={currentTime}
                    />
                  </div>
                  <div className="w-1/4 px-4">
                    <VideoSegmentProgress
                      start={segments.useDatabase.start}
                      end={segments.useDatabase.end}
                      current={currentTime}
                    />
                  </div>
                  <div className="w-1/4 px-4">
                    <VideoSegmentProgress
                      start={segments.seedFactories.start}
                      end={segments.seedFactories.end}
                      current={currentTime}
                    />
                  </div>
                  <div className="w-1/4 px-4">
                    <VideoSegmentProgress
                      start={segments.writeTest.start}
                      end={segments.writeTest.end}
                      current={currentTime}
                    />
                  </div>
                </div>

                <div className="mt-8 md:hidden">
                  <p className="font-medium text-white">
                    {currentSegment === "createServer"
                      ? "Create a Server"
                      : currentSegment === "useDatabase"
                      ? "Use the database"
                      : currentSegment === "seedFactories"
                      ? "Seed with factories"
                      : "Write a test"}
                  </p>
                </div>

                <div className="hidden mt-3 md:block">
                  <div className="flex -mx-4">
                    <div className="w-1/4 px-4">
                      <p
                        className={`text-center transition ${
                          currentSegment === "createServer"
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Create a server
                      </p>
                    </div>
                    <div className="w-1/4 px-4">
                      <p
                        className={`text-center transition ${
                          currentSegment === "useDatabase"
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Use the database
                      </p>
                    </div>
                    <div className="w-1/4 px-4">
                      <p
                        className={`text-center transition ${
                          currentSegment === "seedFactories"
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Seed with factories
                      </p>
                    </div>
                    <div className="w-1/4 px-4">
                      <p
                        className={`text-center transition ${
                          currentSegment === "writeTest"
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Write a test
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-10 md:text-center md:flex md:justify-center md:h-28">
                  <Text color="light-gray">
                    {currentSegment === "createServer" ? (
                      <Fragment>
                        Import and use Mirage right alongside the rest of your
                        frontend JavaScript code – no separate server process
                        for you to manage in yet-another terminal tab.
                      </Fragment>
                    ) : currentSegment === "useDatabase" ? (
                      <Fragment>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </Fragment>
                    ) : currentSegment === "seedFactories" ? (
                      <Fragment>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean luctus arcu a turpis malesuada eleifend. Mauris
                        ac sapien quis diam consequat imperdiet ut ac eros. Cras
                        sollicitudin rhoncus risus, ac vehicula lorem sagittis
                        vitae.
                      </Fragment>
                    ) : (
                      <Fragment>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Pellentesque feugiat malesuada lectus id dignissim. Nunc
                        sed finibus mi.
                      </Fragment>
                    )}
                  </Text>
                </div>
              </div>
            </Gutters>
          </div>
        </SectionWithLines>

        <section
          className="relative py-16 overflow-hidden bg-white bg-no-repeat xl:py-32 md:py-24"
          style={{
            backgroundPosition: "center top, center top -43px",
            backgroundImage: `linear-gradient(rgba(255,255,255,.75) 80%, rgba(255,255,255,1) 95%), url(${ringsUrl})`,
            backgroundSize: "100%, 1100px",
          }}
        >
          <div className="relative z-10 max-w-6xl mx-auto md:text-center xl:text-left">
            <div className="xl:flex xl:-mx-8">
              <div className="xl:w-1/2 xl:pt-10 xl:px-8">
                <div className="px-5 md:px-8 xl:px-0">
                  <div className="max-w-lg mx-auto md:max-w-xl">
                    <Title>
                      The <span className="text-green-500">best DX</span> for
                      frontend development.
                    </Title>

                    <div className="mt-4"></div>

                    <Text color="dark-gray">
                      Say goodbye to configuring painful backend environments
                      just to hack on your UI. Mirage runs alongside the rest of
                      your frontend code, so there’s no new infrastruture for
                      you to learn.
                    </Text>
                    <div className="mt-4">
                      <Text color="dark-gray">
                        New collaborators can clone your frontend codebase, run
                        npm install, and have a complete local offline dev
                        environment up and running in seconds – no environment
                        variables or auth tokens needed.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2 mt-8 xl:ml-auto xl:w-1/2 xl:mt-0 xl:px-8">
                <div className="max-w-lg mx-auto md:max-w-xl">
                  <div className="overflow-hidden rounded-lg">
                    <Snippet name="homepage-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-green-500 md:py-20 xl:py-24">
          <Gutters>
            <div className="max-w-lg mx-auto xl:max-w-2xl">
              <div className="relative">
                <QuoteOpen className="absolute w-20 text-green-600 fill-current md:-ml-10" />
                <QuoteClose className="absolute bottom-0 right-0 w-20 text-green-600 fill-current md:-mr-5" />
                <div className="relative pt-8 pb-6">
                  <p className="text-lg text-white xl:text-xl max-w-measure">
                    Honestly, I can't recommend this tool enough. Finally an
                    idiomatic way for a frontend developer to prototype and test
                    an entire feature without touching a real API! Productivity
                    just goes through the roof.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center mt-6">
                <Img
                  className="w-24 mr-4 rounded-full xl:w-32 xl:mr-6"
                  fluid={data.testimonial1.childImageSharp.fluid}
                />
                <div className="flex-shrink-0 leading-none">
                  <p className="text-lg font-medium text-white">
                    Roman Sandler
                  </p>
                  <p className="mt-2 text-green-200">Founder of Brixton Apps</p>
                </div>
              </div>
            </div>
          </Gutters>
        </section>

        <section
          className="relative pt-16 bg-gray-100 md:pt-24 xl:pt-32 md:text-center xl:text-left"
          style={{
            background: `linear-gradient(173deg, rgb(243, 245, 247) calc(100% - (.25 * 55vw)), #fff calc(100% - (.25 * 55vw)))`,
          }}
        >
          <Gutters>
            <div className="max-w-lg mx-auto md:max-w-xl xl:max-w-6xl">
              <div className="xl:flex xl:-mx-8">
                <div className="xl:w-2/5 xl:px-8">
                  <div className="xl:pt-12">
                    <Title>
                      Write{" "}
                      <span className="text-green-500">
                        high-level UI tests
                      </span>{" "}
                      that stress your networking code.
                    </Title>

                    <div className="mt-4 xl:mt-8">
                      <Text color="dark-gray">
                        With Mirage, you can write automated tests against your
                        API no matter what state it's in. Test how your app
                        handles 0 blog posts, 10, or 1000 – or even how it
                        behaves when your server is slow or responds with an
                        error.
                      </Text>

                      <div className="mt-4">
                        <Text color="dark-gray">
                          No messy mocking code or handcrafted API respones in
                          your tests. Just real-world scenarios validating the
                          entire functionality of your full application.
                        </Text>
                      </div>

                      <div className="mt-6">
                        <Link
                          to="/docs/testing/application-tests"
                          className="inline-flex items-center font-medium text-green-500 md:text-lg"
                          css={`
                            &:hover svg {
                              transform: translateX(5px);
                            }
                          `}
                        >
                          Read more about UI testing{" "}
                          <Caret
                            className="w-2"
                            style={{
                              marginLeft: "10px",
                              transition: "all 0.15s",
                            }}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto mt-16 xl:w-3/5 xl:px-8 xl:mt-0">
                  <img src={testingImageUrl} alt="Browsers" />

                  <div
                    css={`
                      position: absolute;
                      overflow: hidden;
                      width: 141%;
                      left: 50%;
                      height: 53%;
                      top: 24%;
                      transform: translateX(-50%) translateY(-50%) scale(0.6);

                      @media (min-width: 768px) {
                        transform: translateX(-50%) translateY(-50%) scale(0.7);
                        width: 121%;
                        height: 48%;
                      }

                      @media (min-width: 1280px) {
                        width: 110.5%;
                      }
                    `}
                  >
                    <div
                      className="absolute z-10 w-full"
                      style={{
                        top: "-2px",
                        bottom: "-2px",
                        background:
                          "linear-gradient(0deg, #1A1C1D, transparent 20%, transparent 97%, #1A1C1D 97.5%)",
                      }}
                    ></div>

                    <div
                      css={`
                        animation: ${scroll} 90s linear infinite;
                      `}
                    >
                      <Snippet
                        name="homepage-2"
                        backgroundColor="transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Gutters>
        </section>

        <section
          className="pt-24 pb-16 bg-white bg-no-repeat bg-contain md:pt-32 xl:pb-48 md:text-center"
          css={`
            background-image: url(${overlayMeteorsImageUrl});
            background-size: 350%;
            background-position: calc(50% + 50px) bottom;

            @media (min-width: 480px) {
              background-size: 1600px;
            }

            @media (min-width: 1280px) {
              background-size: 2000px;
              background-position: calc(50% - 230px) calc(100% - 40px);
            }
          `}
        >
          <Gutters>
            <div className="max-w-lg mx-auto md:max-w-xl xl:max-w-6xl">
              <div className="xl:inline-flex">
                <div className="lg:mr-6 xl:order-last xl:text-left xl:max-w-lg xl:px-8">
                  <div className="xl:mt-32">
                    <Title>
                      Share a{" "}
                      <span className="text-green-500">fully-working UI</span>{" "}
                      without running a backend.
                    </Title>
                  </div>

                  <div className="mt-4 xl:mt-8">
                    <Text color="dark-gray">
                      Because Mirage realistically mocks out your entire API
                      server, you can share a clickable, working prototype of
                      your JavaScript application without needing to run any
                      backend services.
                    </Text>
                  </div>
                  <div className="mt-4">
                    <Text color="dark-gray">
                      Get high-quality feedback from your users and iterate
                      faster than ever, before you start investing in expensive
                      server-side infrastructure.
                    </Text>
                  </div>
                  <div className="mt-6">
                    <a
                      target="blank"
                      href="https://mirage-react-demo.netlify.com/"
                      className="inline-flex items-center font-medium text-green-500 md:text-lg"
                      css={`
                        &:hover svg {
                          transform: translateX(5px);
                        }
                      `}
                    >
                      View demo{" "}
                      <Caret
                        className="inline w-2"
                        style={{ marginLeft: "10px", transition: "all 0.15s" }}
                      />
                    </a>
                  </div>
                </div>

                <div className="max-w-sm mx-auto mt-12 xl:mr-4 xl:pr-16 xl:w-full xl:max-w-xl">
                  <img src={prototypeImageUrl} alt="" />
                </div>
              </div>
            </div>
          </Gutters>
        </section>

        <section className="py-16 bg-gray-600 md:py-20 xl:py-24">
          <Gutters>
            <div className="max-w-lg mx-auto xl:max-w-2xl">
              <div className="relative">
                <QuoteOpen className="absolute w-20 text-gray-500 opacity-50 fill-current md:-ml-10" />
                <QuoteClose className="absolute bottom-0 right-0 w-20 text-gray-500 opacity-50 fill-current md:-mr-5" />
                <div className="relative pt-8 pb-6">
                  <p className="text-lg text-white xl:text-xl max-w-measure">
                    Reminder: If there is one single piece of software born in
                    2015 that has change the way I build software, it's Mirage.
                    It just enables a different way of doing frontend/backend
                    collaboration. Use it now. Gold.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center mt-6">
                <Img
                  className="w-24 mr-4 rounded-full xl:w-32 xl:mr-6"
                  fluid={data.testimonial1.childImageSharp.fluid}
                />
                <div className="flex-shrink-0 leading-none">
                  <p className="text-lg font-medium text-white">
                    Roman Sandler
                  </p>
                  <p className="mt-2 text-gray-300">Founder of Brixton Apps</p>
                </div>
              </div>
            </div>
          </Gutters>
        </section>

        <section className="pt-24 pb-32 bg-white xl:py-40">
          <div className="text-center">
            <Gutters>
              <Container>
                <h2 className="tracking-tight leading-tighter text-4-5xl font-title md:text-4-75xl md:leading-tighter lg:text-5xl">
                  Ready to use Mirage?
                </h2>

                <div className="max-w-xs mx-auto mt-6 lg:max-w-sm">
                  <p className="text-lg text-gray-700 lg:text-1-5xl max-w-measure">
                    Mirage works with all major JavaScript frameworks, libraries
                    and test runners.
                  </p>
                </div>

                <div className="mt-12">
                  <Link
                    to={router.routerFor("/docs").pages[0].fullPath}
                    className="inline-flex items-center px-4 py-3 text-lg font-medium text-center text-white bg-green-500 rounded"
                  >
                    Get started
                    <Caret className="inline w-2 ml-2" />
                  </Link>
                </div>
              </Container>
            </Gutters>
          </div>
        </section>
      </div>
    </div>
  )
}

// start at 30, end at 60
// at 45 - 50%

// end - start = duration = 30
// complete = current - start = 15

function VideoSegmentProgress({ start, end, current }) {
  let duration = end - start
  let completedTime = current - start
  let progress =
    current < start ? 0 : current >= end ? 1 : completedTime / duration
  return <ProgressBar progress={progress * 100} />
}

function ProgressBar({ progress }) {
  const prev = usePrevious(progress)

  const props = useSpring({
    to: {
      width: `${progress}%`,
      opacity: progress === 100 ? 0.6 : progress > 0 ? 1 : 0,
    },
    immediate: prev > progress,
    config: { duration: 250, easing: t => t },
  })

  return (
    <div className="relative w-full h-1 overflow-hidden bg-gray-900 rounded">
      <animated.div
        className="absolute top-0 bottom-0 left-0 bg-green-500"
        style={props}
      ></animated.div>
    </div>
  )
}

function Gutters({ children }) {
  return <div className="px-5 md:px-8">{children}</div>
}

function Container({ children }) {
  return <div className="max-w-lg mx-auto md:max-w-full">{children}</div>
}

function Title({ children }) {
  return (
    <h2 className="text-3xl leading-tight md:text-4xl text-gray-1000 xl:text-4-5xl font-title">
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

  return (
    <p className={`${styles[color]} md:text-lg max-w-measure`}>{children}</p>
  )
}

function Caret(props) {
  return (
    <svg {...props} viewBox="0 0 7 12">
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="stroke-current" strokeWidth="1.5">
          <polyline id="Path-5" points="1 1 6 6 1 11"></polyline>
        </g>
      </g>
    </svg>
  )
}
