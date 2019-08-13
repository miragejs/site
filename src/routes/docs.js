import React, { useState } from "react"
import { MDXProvider } from "@mdx-js/react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "@reach/router"
import Code from "../components/code"
import { CaretDownWide } from "../components/icons"
import RoutesService from "../lib/routes-service"

const MAX_WIDTH = 1400
const MAIN_WIDTH = 870
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

const routesService = new RoutesService()

export default function DocsPage(props) {
  const data = useStaticQuery(graphql`
    query OnThisPageQuery {
      allMdx {
        nodes {
          tableOfContents
          fileAbsolutePath
        }
      }
    }
  `)
  let mdxPage = data.allMdx.nodes.find(node => {
    let didMatch = false
    let match = node.fileAbsolutePath.match(/(\/docs\/.+)\.md[x]?/)

    if (match) {
      let regexp = new RegExp(`${match[1]}/?`)
      didMatch = match && regexp.test(props.location.pathname)
    }

    return didMatch
  })
  let tableOfContentsItems = mdxPage && mdxPage.tableOfContents.items[0].items

  return (
    <div className="bg-white">
      <MobileNav />

      <div className="flex-1 flex">
        <DesktopNav />

        <div
          className="flex-1 w-full max-w-lg mx-auto px-5 pt-7 font-normal text-gray-700
            text-base leading-copy
            sm:pt-8
            md:text-lg md:leading-relaxed md:px-20 md:pt-8
            md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl
            "
        >
          <MDXProvider components={components}>{props.children}</MDXProvider>
        </div>

        <div
          className="hidden 2xl:block flex-shrink-0"
          style={{
            width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
            paddingRight: `calc((100% - 1408px)/ 2)`,
          }}
        >
          <div className="pr-8">
            <nav className="mt-32 ml-8 pl-6 sticky">
              {tableOfContentsItems && (
                <>
                  <p className="uppercase text-xs text-gray-800 font-medium tracking-wider">
                    On this page
                  </p>

                  <ul className="mt-2 font-normal text-sm">
                    {tableOfContentsItems.map(item => (
                      <li
                        key={item.url}
                        className="my-2 font-medium text-blue-500"
                      >
                        {item.title}

                        {item.items && (
                          <ul className="pl-4">
                            {item.items.map(item => (
                              <li
                                key={item.url}
                                className="my-2 font-medium text-blue-500"
                              >
                                {item.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileNav() {
  let [mobileSecondaryNavIsOpen, setMobileSecondaryNavIsOpen] = useState(false)

  return (
    <div
      className="
      sm:max-w-lg sm:mx-auto sm:px-5 sm:pt-8
      md:max-w-3xl md:px-20 md:pt-12
      2xl:hidden
    "
    >
      <div
        className="text-sm font-normal text-gray-500 bg-gray-100
          sm:border
        "
      >
        <button
          className="w-full px-5 py-3 flex items-center justify-between focus:outline-none"
          onClick={() => setMobileSecondaryNavIsOpen(!mobileSecondaryNavIsOpen)}
        >
          <span>Contents</span>
          <span
            style={{
              transform: mobileSecondaryNavIsOpen ? "rotate(180deg)" : "",
            }}
          >
            <CaretDownWide className="w-4 h-4" />
          </span>
        </button>
        {mobileSecondaryNavIsOpen && (
          <div className="px-5 border-b border-gray-200 sm:border-none">
            <nav className="border-t border-gray-200 pt-5 pb-4 text-gray-700 text-base">
              <ul className="pt-2w">
                {routesService.routesForFullPath("/docs").map(route => (
                  <li className="mb-5" key={route.fullPath}>
                    <div className="uppercase text-gray-400 text-sm font-medium">
                      {route.label}
                    </div>
                    <ul>
                      {route.routes.map(route => (
                        <MobileNavLink
                          fullPath={route.fullPath}
                          key={route.fullPath}
                          onClick={() => setMobileSecondaryNavIsOpen(false)}
                        >
                          {route.label}
                        </MobileNavLink>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

function MobileNavLink({ fullPath, ...otherProps }) {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: `block py-1 ${isPartiallyCurrent ? "text-gray-400" : ""}`,
    }
  }

  return (
    <li key={fullPath}>
      <Link getProps={isPartiallyActive} to={fullPath} {...otherProps} />
    </li>
  )
}

function DesktopNav() {
  return (
    <div
      className="flex-shrink-0 bg-gray-100 border-r border-gray-200 hidden 2xl:block"
      style={{
        width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
        paddingLeft: `calc((100% - ${MAX_WIDTH}px)/ 2)`,
      }}
    >
      <nav className="pl-7 pt-14 pr-6 sticky top-0 leading-none h-screen overflow-y-scroll">
        <ul className="mt-2">
          {routesService.routesForFullPath("/docs").map(route => (
            <li className="mb-8" key={route.fullPath}>
              <span className="text-gray-800 text-base+ font-medium">
                {route.label}
              </span>
              <ul className="ml-2 mt-2 font-normal leading-snug">
                {route.routes.map(route => (
                  <DesktopNavLink
                    fullPath={route.fullPath}
                    key={route.fullPath}
                  >
                    {route.label}
                  </DesktopNavLink>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function DesktopNavLink({ fullPath, ...props }) {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: isPartiallyCurrent
        ? "text-gray-900"
        : "text-gray-600 hover:text-gray-900",
    }
  }

  return (
    <li className="py-1" key={props.route}>
      <Link getProps={isPartiallyActive} to={fullPath} {...props} />
    </li>
  )
}

const components = {
  h1: props => (
    <h1
      {...props}
      className="text-gray-900 font-title font-normal leading-tight
        mb-6 text-4xl
        md:mb-8 md:text-5xl
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
    <h2
      {...props}
      className="text-gray-900 font-normal font-title
        text-2xl leading-tight mt-10 mb-4
        md:text-3xl md:mt-14 md:mb-6
      "
    >
      {props.children}
    </h2>
  ),

  h3: props => (
    <h3
      {...props}
      className="text-gray-900 font-normal font-title
        mt-12
        mb-5 md:mb-6
        text-2-25xl leading-normal
      "
    >
      {props.children}
    </h3>
  ),

  p: props => (
    <p {...props} className="my-5">
      {props.children}
    </p>
  ),

  ol: props => (
    <ol {...props} className="ml-8 list-decimal">
      {props.children}
    </ol>
  ),

  ul: props => (
    <ul {...props} className="ml-8 list-disc">
      {props.children}
    </ul>
  ),

  li: props => (
    <li {...props} className="md:pl-2">
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

  hr: props => (
    <hr {...props} className="border-t border-gray-300 mt-6 mb-8 md:my-8" />
  ),

  inlineCode: props => (
    <code
      {...props}
      className="font-mono text-base px-1"
      style={{ backgroundColor: "rgba(255, 229, 100, 0.2)" }}
    >
      {props.children}
    </code>
  ),

  pre: props => <div {...props} />,

  code: props => (
    <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-0 my-8 md:my-10">
      <Code {...props} />
    </div>
  ),
}

export const Lead = ({ children }) => (
  <p className="font-light my-4 text-gray-900 text-lg md:text-xl leading-normal">
    {children}
  </p>
)
