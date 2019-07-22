import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Text, Title } from "./presenters"

const components = {
  h2: Title,
  p: Text,
  strong: function({ children }) {
    return <strong className="font-medium">{children}</strong>
  },
  a: function({ href, children }) {
    return (
      <a href={href} className="underline text-blue-500">
        {children}
      </a>
    )
  },
}

export default function({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
