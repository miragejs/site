import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Highlight, { defaultProps } from "prism-react-renderer"
import Logo from "../assets/images/logo.svg"
import { Link } from "gatsby"

const components = {
  h1: props => (
    <h1
      {...props}
      className="text-gray-900 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-3xl leading-tight
        md:text-5xl
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
    <h2
      {...props}
      className="text-gray-900 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-2-25xl leading-tight
        md:text-3-5xl
      "
    >
      {props.children}
    </h2>
  ),

  h3: props => (
    <h3
      {...props}
      className="text-gray-900 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-1-2xl leading-tight
        md:text-2xl
      "
    >
      {props.children}
    </h3>
  ),

  p: props => (
    <p
      {...props}
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
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
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
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

  pre: props => <div {...props} />,

  code: ({ children, className }) => {
    const language = className.replace(/language-/, "")

    return (
      <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-auto md:w-5/6 md:shadow-lg my-8 md:my-10 lg:my-12">
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

const isPartiallyActive = ({ isPartiallyCurrent }) => {
  let className = "ml-12 font-medium"

  if (isPartiallyCurrent) {
    className += " text-gray-50"
  } else {
    className += " text-gray-300 hover:text-gray-50"
  }

  return { className }
}

function NavLink(props) {
  return <Link getProps={isPartiallyActive} {...props} />
}

export default function({ children }) {
  return (
    <div className="antialiased text-gray-5 font-body font-light leading-normal min-h-screen flex flex-col">
      <div className="relative">
        <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl px-5 md:px-8">
          <header className="py-2 flex items-center">
            <Link to="/">
              <Logo className="w-8 h-8 md:w-10 md:h-16" />
            </Link>

            <NavLink to="/docs">Documentation</NavLink>

            <div className="ml-auto">
              <a
                href="https://github.com/miragejs/server"
                className="text-gray-300 hover:text-gray-50"
              >
                <svg
                  class="fill-current h-7"
                  viewBox="0 0 16 16"
                  version="1.1"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </svg>
              </a>
            </div>
          </header>
        </div>
      </div>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
