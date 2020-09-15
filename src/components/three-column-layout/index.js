import React, { useRef, useEffect, useState } from "react"
import { DesktopNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"
import { MDXProvider } from "@mdx-js/react"
import { Link } from "@reach/router"
import { Link as GatsbyLink } from "gatsby"
import {
  H1,
  H2,
  H3,
  P,
  UL,
  OL,
  LI,
  HR,
  InlineCode,
  Strong,
  Blockquote,
  A,
  Pre,
  Code,
} from "../../components/ui"
import { useWindowWidth } from "@react-hook/window-size"

export function ThreeColumnLayout({
  menuItems,
  previousPage,
  nextPage,
  children,
}) {
  return (
    <div className="pt-16 bg-white">
      <MobileNav menuItems={menuItems} />

      <div className="px-5 md:px-6">
        <div className="flex flex-1 max-w-6xl mx-auto">
          <DesktopNav menuItems={menuItems} />

          <div className="flex-1 w-full min-w-0 text-base font-normal text-gray-800 pt-7 lg:pl-8 leading-relaxed-sm sm:pt-8 md:leading-relaxed md:pt-8 lg:pt-10 xl:pt-12">
            <div className="max-w-md mx-auto md:text-lg md:max-w-2xl lg:max-w-2-5xl">
              <MDXProvider components={components}>{children}</MDXProvider>

              <div className="flex justify-between pt-4 pb-24 md:pt-8">
                <div>
                  {previousPage ? (
                    <Link
                      to={previousPage.url}
                      className="block focus:outline-none focus-visible:shadow-outline hover:opacity-75"
                    >
                      <div className="text-sm">Previous</div>
                      <div className="text-xl text-blue-500">
                        {previousPage.label}
                      </div>
                    </Link>
                  ) : null}
                </div>
                <div>
                  {nextPage ? (
                    <Link
                      to={nextPage.url}
                      className="block focus:outline-none focus-visible:shadow-outline hover:opacity-75"
                    >
                      <div className="text-sm text-right">Next</div>
                      <div className="text-xl text-blue-500">
                        {nextPage.label}
                      </div>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const components = {
  Link: (props) => (
    <GatsbyLink {...props} className="underline hover:text-blue-500" />
  ),
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ol: OL,
  ul: UL,
  li: LI,
  strong: Strong,
  blockquote: Blockquote,
  a: A,
  hr: HR,
  inlineCode: InlineCode,
  pre: Pre,

  // MDX assigns a className of something like `language-jsx{1,5-10}`
  code: ({ className, children }) => {
    let props = { children }
    let languageMatch = className && className.match("language-([^{]+)")
    if (languageMatch) {
      props.language = languageMatch[1]
    }
    let highlightedLinesMatch = className && className.match("{(.+)}")
    if (highlightedLinesMatch) {
      props.highlightedLines = highlightedLinesMatch[1]
    }

    return (
      <div className="my-8 -mx-5 overflow-hidden sm:rounded-lg md:mx-auto">
        <Code {...props} />
      </div>
    )
  },
}

export function CarbonAds() {
  let carbonAdsTargetRef = useRef()
  let didMoveAdRef = useRef()

  useEffect(() => {
    let ad = document.getElementById("carbonads")
    let placeholder = document.getElementById("carbon-placeholder")
    let adIsInPlaceholder = placeholder?.contains(ad)
    let shouldMoveAd = !didMoveAdRef.current && adIsInPlaceholder

    if (shouldMoveAd) {
      console.log("moving ad")
      carbonAdsTargetRef.current.appendChild(
        document.getElementById("carbonads")
      )
      didMoveAdRef.current = true
    }
  })

  useEffect(() => {
    return () => {
      if (didMoveAdRef.current) {
        console.log("putting ad back")
        document
          .getElementById("carbon-placeholder")
          .appendChild(document.getElementById("carbonads"))
      }
    }
  }, [])

  return <div ref={carbonAdsTargetRef} />
}
