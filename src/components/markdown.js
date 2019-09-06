import React from "react"
import { MDXProvider } from "@mdx-js/react"
import {
  H1,
  H2,
  H3,
  P,
  UL,
  OL,
  LI,
  HR,
  InlineCode,
  Strong,
  A,
  Pre,
  Code,
} from "./ui"

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ol: OL,
  ul: UL,
  li: LI,
  strong: Strong,
  a: A,
  hr: HR,
  inlineCode: InlineCode,
  pre: Pre,
  code: Code,
}

export function Markdown(props) {
  return <MDXProvider components={components}>{props.children}</MDXProvider>
}
