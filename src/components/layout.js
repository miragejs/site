import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Highlight, { defaultProps } from "prism-react-renderer"

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

export default function({ children }) {
  return (
    <div className="antialiased text-gray-5 font-body font-light leading-normal ">
      <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  )
}
