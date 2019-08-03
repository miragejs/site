import React from "react"
import Layout from "../components/layout"
import Code from "../components/code"
import { MDXProvider } from "@mdx-js/react"
import DocsCopy from "./docs-copy"
import { graphql } from "gatsby"

const MAX_WIDTH = 1400
const MAIN_WIDTH = 870
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

export default function DocsPage({ data }) {
  let nav = [
    { title: "Getting started", children: [{ title: "Introduction" }] },
    { title: "Examples", children: [{ title: "React" }, { title: "Vue" }] },
    {
      title: "API",
      children: [
        { title: "Association" },
        { title: "Collection" },
        { title: "Db" },
        { title: "DbCollection" },
        { title: "IdentityManager" },
        { title: "JSONAPISerializer" },
        { title: "Model" },
        { title: "Response" },
        { title: "Schema" },
        { title: "Serializer" },
        { title: "Server" },
      ],
    },
  ]

  return (
    <Layout>
      <div className="flex-1 bg-white flex">
        <div
          className="flex-shrink-0 pt-4 bg-gray-xx100 pt-14"
          style={{
            width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
            paddingLeft: `calc((100% - ${MAX_WIDTH}px)/ 2)`,
          }}
        >
          <div className="pl-7">
            <nav className="pr-6 sticky top-0 leading-none">
              <ul className="mt-2">
                {nav.map(item => (
                  <li className="mb-8" key={item.title}>
                    <span className="text-gray-600 text-base+ font-medium">
                      {item.title}
                    </span>
                    <ul className="text-gray-xx600 ml-2 mt-2 font-normal leading-snug">
                      {item.children.map(child => (
                        <li className="py-1" key={child.title}>
                          {child.title}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="px-20 pt-12 text-lg leading-relaxed font-normal text-gray-600">
          <MDXProvider components={components}>
            <DocsCopy />
          </MDXProvider>
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
              {data.mdx.tableOfContents.items[0].items && (
                <>
                  <p className="uppercase text-xs text-gray-600 font-medium tracking-wider">
                    On this page
                  </p>

                  <ul className="mt-2 font-normal text-sm">
                    {data.mdx.tableOfContents.items[0].items.map(item => (
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
      className="text-gray-700 font-title
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
      className="text-gray-700 font-normal font-title
        mt-14
        mb-6
        text-2-25xl leading-tight
        md:text-2-75xl
      "
    >
      {props.children}
    </h2>
  ),

  h3: props => (
    <h3
      {...props}
      className="text-gray-700 font-normal font-title
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

  hr: props => <hr {...props} className="border-t border-gray-xx300 my-8" />,

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
  <p className="font-light my-3 text-xl leading-normal text-gray-700">
    {children}
  </p>
)

export const query = graphql`
  query MyQuery {
    mdx(fileAbsolutePath: { regex: "/docs-copy/" }) {
      tableOfContents
    }
  }
`
