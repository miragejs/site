import React from "react"
import { DesktopLeftNav, DesktopRightNav } from "./desktop-nav"
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

export function ThreeColumnLayout({
  routes,
  routesContent,
  previousPage,
  nextPage,
  children,
}) {
  return (
    <div className="pt-16 bg-white">
      <MobileNav routes={routes} />

      <div className="flex flex-1">
        <DesktopLeftNav routes={routes} routesContent={routesContent} />

        <div className="flex-1 w-full min-w-0 px-5 text-base font-normal text-gray-800 pt-7 leading-relaxed-sm sm:pt-8 md:leading-relaxed md:pt-8 md:px-20 lg:pr-8 lg:pt-10">
          <div className="max-w-md mx-auto md:max-w-full md:text-lg">
            <MDXProvider components={components}>{children}</MDXProvider>

            <div className="flex justify-between pt-4 pb-24 md:pt-8">
              <div>
                {previousPage ? (
                  <Link
                    to={previousPage.fullPath}
                    className="block hover:opacity-75"
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
                    to={nextPage.fullPath}
                    className="block hover:opacity-75"
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

        <DesktopRightNav currentPageTableOfContentsItems={[]} />
      </div>
    </div>
  )
}

const components = {
  Link: props => (
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
