import React, { createContext, useContext } from "react"
import Layout from "./layout"
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
    <Layout>
      <div className="flex-1 bg-white flex">
        <div
          className="flex-shrink-0 pt-4 bg-gray-100 pt-14 border-r border-gray-200"
          style={{
            width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
            paddingLeft: `calc((100% - ${MAX_WIDTH}px)/ 2)`,
          }}
        >
          <div className="pl-7">
            <nav className="pr-6 sticky top-0 leading-none">
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
        </div>

        <div className="flex-1 px-20 pt-12 text-lg leading-relaxed font-normal text-gray-700">
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>

        <div
          className="flex-shrink-0"
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
    </Layout>
  )
}

const components = {
  h1: props => (
    <h1
      {...props}
      className="text-gray-900 font-title
        mb-8
        font-normal
        text-5xl leading-tight
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
    <h2
      {...props}
      className="text-gray-900 font-normal font-title
        mt-14
        mb-6
        text-3xl leading-tight
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
    <p {...props} className="my-4">
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
    <li {...props} className="pl-2">
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

  hr: props => <hr {...props} className="border-t border-gray-300 my-8" />,

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
    <div className="sm:rounded-lg overflow-hidden my-8">
      <Code {...props} />
    </div>
  ),
}

export const Lead = ({ children }) => (
  <p className="font-light my-3 text-xl leading-normal text-gray-900">
    {children}
  </p>
)

// export const query = graphql`
//   query MyQuery {
//     # mdx {
//     #   tableOfContents
//     # }
//     allMdx {
//       nodes {
//         tableOfContents
//         fileAbsolutePath
//       }
//     }
//   }
// `
