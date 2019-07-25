import React from "react"
import Layout from "../components/layout"
import { MDXProvider } from "@mdx-js/react"
import Highlight, { defaultProps } from "prism-react-renderer"
import DocsCopy from "./docs-copy"
import { graphql } from "gatsby"

function Container(props) {
  return (
    <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl px-5 md:px-8">
      {props.children}
    </div>
  )
}

export default function DocsPage({ data }) {
  // let items = data.mdx.tableOfContents.items

  return (
    <Layout>
      <div className="flex-1 bg-white pt-6">
        <div className="flex">
          <div
            className="flex-shrink-0 pt-4"
            style={{
              width: `calc(((100% - 1400px)/ 2) + 288px)`,
              paddingLeft: `calc((100% - 1400px)/ 2)`,
            }}
          >
            {/* <div className="pl-8">
              <nav className="pr-6 sticky">
                <ul className="mt-2 text-lg font-normal">
                  <li>Overview</li>
                </ul>
              </nav>
            </div> */}
          </div>

          <div className="px-12 pt-8">
            <MDXProvider components={components}>
              <DocsCopy />
            </MDXProvider>
          </div>

          <div
            className="flex-shrink-0"
            style={{
              width: `calc(((100% - 1408px)/ 2) + 288px)`,
              paddingRight: `calc((100% - 1408px)/ 2)`,
            }}
          >
            {/* <div className="pr-8">
              <nav className="mt-8 ml-8 pl-6 sticky">
                <p className="uppercase text-xs text-gray-600 font-medium tracking-wider">
                  On this page
                </p>

                <ul className="mt-2 font-normal text-gray-400 text-sm">
                  {data.mdx.tableOfContents.items.map(item => (
                    <li key={item.url} className="my-2 text-blue-500">
                      {item.title}

                      {item.items && (
                        <ul className="pl-4">
                          {item.items.map(item => (
                            <li key={item.url} className="my-2 text-blue-500">
                              {item.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div> */}
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
        text-5xl leading-tight border-b border-gray-100 pb-2
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
    <h2
      {...props}
      className="text-gray-900 font-normal font-title
        mt-12
        mb-4
        text-2-25xl leading-tight
        md:text-3xl
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
        text-2xl leading-normal
      "
    >
      {props.children}
    </h3>
  ),

  p: props => (
    <p
      {...props}
      className="font-normal
        my-3
        text-base+ leading-normal

      "
    >
      {props.children}
    </p>
  ),

  ul: props => (
    <ul {...props} className="ml-8 list-disc">
      {props.children}
    </ul>
  ),

  li: props => (
    <li
      {...props}
      className="font-normal
        my-5
        text-base+ leading-copy
      "
    >
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

  hr: props => <hr {...props} className="border-t border-gray-100 pb-3" />,

  inlineCode: props => (
    <code {...props} className="font-mono text-base bg-gray-50 px-1">
      {props.children}
    </code>
  ),

  pre: props => <div {...props} />,

  code: ({ children, className }) => {
    const language = className.replace(/language-/, "")

    return (
      <div className="sm:rounded-lg overflow-hidden my-8">
        <Highlight
          {...defaultProps}
          code={children}
          language={language}
          theme={undefined}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    )
  },
}

export const query = graphql`
  query MyQuery {
    mdx(fileAbsolutePath: { regex: "/docs-copy/" }) {
      tableOfContents
    }
  }
`
