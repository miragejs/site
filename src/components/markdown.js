import React from "react"
import ReactMarkdown from "react-markdown"
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
  EM,
  A,
  Code,
} from "./ui"

const levelMappings = {
  1: H1,
  2: H2,
  3: H3,
}

const renderers = {
  heading: props => {
    let Component = levelMappings[props.level]
    if (!Component) {
      throw new Error(`Cannot use h${props.level} in doc comment. Use H1-3.`)
    }
    return <Component children={props.children} />
  },
  paragraph: P,
  list: props => {
    let Component = props.ordered ? OL : UL
    return <Component children={props.children} />
  },
  listItem: props => <LI children={props.children} />,
  strong: Strong,
  emphasis: EM,
  link: A,
  thematicBreak: HR,
  inlineCode: props => <InlineCode children={props.children} />,
  code: props => <Code children={props.value} language={props.language} />,
}

export function Markdown(props) {
  return <ReactMarkdown renderers={renderers}>{props.children}</ReactMarkdown>
}
