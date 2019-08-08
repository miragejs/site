import React, { createContext, useContext } from "react"
import Code from "./code"
import { MDXProvider } from "@mdx-js/react"
import { useStaticQuery, graphql, Link } from "gatsby"

const MAX_WIDTH = 1400
const MAIN_WIDTH = 870
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

const NavSectionContext = createContext()

function NavSection({ route, label, children }) {
  return (
    <li className="mb-8" key={route}>
      <span className="text-gray-800 text-base+ font-medium">{label}</span>
      <ul className="ml-2 mt-2 font-normal leading-snug">
        <NavSectionContext.Provider value={route}>
          {children}
        </NavSectionContext.Provider>
      </ul>
    </li>
  )
}

function NavLink(props) {
  const sectionRoute = useContext(NavSectionContext)

  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: `${
        isPartiallyCurrent
          ? "text-gray-900"
          : "text-gray-600 hover:text-gray-900"
      }`,
    }
  }

  return (
    <li className="py-1" key={props.route}>
      <Link
        getProps={isPartiallyActive}
        to={`/docs/${sectionRoute}/${props.route}`}
        {...props}
      />
    </li>
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

  return (
    <div className="bg-white">
      <div className="flex items-center text-sm font-medium px-5 py-3 border-b-2 border-gray-100 bg-gray-100 text-gray-500 2xl:hidden">
        Documentation
        <Caret className="w-3 h-3 mx-2 " />
        {/* Getting started */}
        {/* <Ellipsis className="w-3 h-3 mx-2" /> */}
        {/* <Caret className="w-3 h-3 mx-2 " /> */}
        Introduction
      </div>

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
              <NavSection route="getting-started" label="Getting started">
                <NavLink route="introduction">Introduction</NavLink>
                <NavLink route="installation">Installation</NavLink>
                <NavLink route="usage">Usage</NavLink>
              </NavSection>

              <NavSection route="examples" label="Examples">
                <NavLink route="react">React</NavLink>
                <NavLink route="vue">Vue</NavLink>
              </NavSection>

              <NavSection route="api" label="API">
                <NavLink route="Association">Association</NavLink>
                <NavLink route="Collection">Collection</NavLink>
                <NavLink route="Db">Db</NavLink>
                <NavLink route="DbCollection">DbCollection</NavLink>
                <NavLink route="IdentityManager">IdentityManager</NavLink>
                <NavLink route="JSONAPISerializer">JSONAPISerializer</NavLink>
                <NavLink route="Model">Model</NavLink>
                <NavLink route="Response">Response</NavLink>
                <NavLink route="Schema">Schema</NavLink>
                <NavLink route="Serializer">Serializer</NavLink>
                <NavLink route="Server">Server</NavLink>
              </NavSection>
            </ul>
          </nav>
        </div>

        <div
          className="flex-1 max-w-full px-5 md:px-20 pt-8 md:pt-12 font-normal text-gray-700
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

const Caret = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="Artboard"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <polyline
        id="Path"
        stroke="#979797"
        strokeWidth="6"
        points="25 56 46 35 25 14"
      ></polyline>
    </g>
  </svg>
)

const Ellipsis = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Artboard-Copy" className="fill-current">
        <circle id="Oval" cx="35.5" cy="55.5" r="4.5"></circle>
        <circle id="Oval-Copy" cx="15.5" cy="55.5" r="4.5"></circle>
        <circle id="Oval-Copy-2" cx="55.5" cy="55.5" r="4.5"></circle>
      </g>
    </g>
  </svg>
)
