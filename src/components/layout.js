import React from "react"
import { MDXProvider } from "@mdx-js/react"

const components = {
  h2: ({ children }) => (
    <h2
      className="text-gray-900 font-normal font-title
        mt-12 lg:mt-16
        mb-5 md:mb-6
        text-2-25xl leading-tight
        md:text-3-5xl
      "
    >
      {children}
    </h2>
  ),

  p: ({ children }) => (
    <p
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
      "
    >
      {children}
    </p>
  ),

  strong: ({ children }) => <strong className="font-medium">{children}</strong>,

  a: ({ href, children }) => (
    <a href={href} className="underline text-blue-500">
      {children}
    </a>
  ),
}

export default function({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
