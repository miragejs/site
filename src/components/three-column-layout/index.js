import React from "react"
import { DesktopLeftNav, DesktopRightNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"
import { MDXProvider } from "@mdx-js/react"
import { Link } from "@reach/router"
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

export function ThreeColumnLayout(props) {
  let currentPageTableOfContentsItems =
    props.currentPageTableOfContentsItems || []

  return (
    <div className="bg-white">
      <MobileNav routes={props.routes} />

      <div className="flex flex-1">
        <DesktopLeftNav
          routes={props.routes}
          currentPageTableOfContentsItems={currentPageTableOfContentsItems}
        />

        <div className="flex-1 w-full min-w-0 px-5 text-base font-normal text-gray-800 pt-7 leading-relaxed-sm sm:pt-8 md:leading-relaxed md:pt-8 md:px-20 lg:pt-12 ">
          <div className="max-w-md mx-auto md:max-w-2xl md:text-lg lg:ml-0 xl:mx-auto ">
            <MDXProvider components={components}>{props.children}</MDXProvider>

            <div className="flex justify-between pt-4 pb-24 md:pt-8">
              <div>
                {props.previousPage ? (
                  <Link
                    to={props.previousPage.fullPath}
                    className="block hover:opacity-75"
                  >
                    <div className="text-sm">Previous</div>
                    <div className="text-xl text-blue-500">
                      {props.previousPage.label}
                    </div>
                  </Link>
                ) : null}
              </div>
              <div>
                {props.nextPage ? (
                  <Link
                    to={props.nextPage.fullPath}
                    className="block hover:opacity-75"
                  >
                    <div className="text-sm text-right">Next</div>
                    <div className="text-xl text-blue-500">
                      {props.nextPage.label}
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <DesktopRightNav
          currentPageTableOfContentsItems={currentPageTableOfContentsItems}
        />
      </div>
    </div>
  )
}

const components = {
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
