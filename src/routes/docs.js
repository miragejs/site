import React, { useState } from "react"
import { MDXProvider } from "@mdx-js/react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Code from "../components/code"
import { CaretDownWide } from "../components/icons"
import RoutesService from "../lib/routes-service"

const MAX_WIDTH = 1400
const MAIN_WIDTH = 870
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

function NavLink({ fullPath, ...props }) {
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

function MobileNav({ routesService }) {
  let [mobileSecondaryNavIsOpen, setMobileSecondaryNavIsOpen] = useState(false)

  return (
    <div className="text-sm font-normal pl-5 py-1 text-gray-500 bg-gray-100 2xl:hidden">
      <div className="flex items-center">
        Documentation
        <div className="ml-auto flex items-center">
          <button
            onClick={() =>
              setMobileSecondaryNavIsOpen(!mobileSecondaryNavIsOpen)
            }
            className="flex items-center px-5 py-3 focus:outline-none"
          >
            <span
              style={{
                transform: mobileSecondaryNavIsOpen ? "rotate(180deg)" : "",
              }}
            >
              <CaretDownWide className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
      {mobileSecondaryNavIsOpen && (
        <div className="pt-1 pr-5">
          <nav className="border-t border-gray-200 pt-5 pb-4 text-gray-700 text-base">
            <ul className="pt-2w">
              {routesService.routesForFullPath("/docs").map(route => (
                <li className="mb-5" key={route.fullPath}>
                  <div className="uppercase text-gray-400 text-sm font-medium">
                    {route.name}
                  </div>
                  <ul>
                    {route.routes.map(route => (
                      <MobileNavLink
                        fullPath={route.fullPath}
                        key={route.fullPath}
                        onClick={() => setMobileSecondaryNavIsOpen(false)}
                      >
                        {route.name}
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
  )
}

export default function DocsPage({ path, children }) {
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
    let match = node.fileAbsolutePath.match(/(\/docs\/.+)\.md[x]?/)

    return match && `${match[1]}/` === path
  })
  let tableOfContentsItems = mdxPage && mdxPage.tableOfContents.items[0].items

  let routesService = new RoutesService(path)

  return (
    <div className="bg-white">
      <MobileNav routesService={routesService} />

      <div className="flex-1 flex">
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
                    {route.name}
                  </span>
                  <ul className="ml-2 mt-2 font-normal leading-snug">
                    {route.routes.map(route => (
                      <NavLink fullPath={route.fullPath} key={route.fullPath}>
                        {route.name}
                      </NavLink>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="flex-1 max-w-full px-5 md:px-20 pt-7 md:pt-12 font-normal text-gray-700
          text-base leading-copy
          md:text-lg md:leading-relaxed"
        >
          <MDXProvider components={components}>{children}</MDXProvider>
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
    <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-auto md:w-5/6 md:shadow-lg my-8 md:my-10 lg:my-12">
      <Code {...props} />
    </div>
  ),
}

export const Lead = ({ children }) => (
  <p className="font-light my-4 text-gray-900 text-lg md:text-xl leading-normal">
    {children}
  </p>
)
