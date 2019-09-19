import React from "react"
import CodeComponent from "../code"

// More prominent than P but not a Heading
export const Lead = ({ children }) => (
  <p className="font-light my-4 text-gray-900 text-lg md:text-xl leading-normal">
    {children}
  </p>
)

export const H1 = props => (
  <h1
    {...props}
    className="text-gray-900 font-title font-normal leading-tight
      mb-6 text-4xl
      md:mb-8 md:text-5xl
    "
  >
    {props.children}
  </h1>
)

export const H2 = props => (
  <h2
    {...props}
    className="text-gray-900 font-normal font-title
      text-2xl leading-tight mt-10 mb-4
      md:text-3xl md:mt-14 md:mb-6
      before-h-8 xl:before-h-12
    "
  >
    <a href={`#${props.id}`}>{props.children}</a>
  </h2>
)

export const H3 = props => (
  <h3
    {...props}
    className="text-gray-900 font-normal font-title
      mt-12
      mb-5 md:mb-6
      text-2-25xl leading-normal
      before-h-8 xl:before-h-12
    "
  >
    <a href={`#${props.id}`}>{props.children}</a>
  </h3>
)

export const P = props => (
  <p {...props} className="my-5">
    {props.children}
  </p>
)

export const OL = props => (
  <ol {...props} className="ml-8 my-5 list-decimal">
    {props.children}
  </ol>
)

export const UL = props => (
  <ul {...props} className="ml-8 my-5 list-disc">
    {props.children}
  </ul>
)

export const LI = props => (
  <li {...props} className="md:pl-2">
    {props.children}
  </li>
)

export const Strong = props => (
  <strong {...props} className="font-medium">
    {props.children}
  </strong>
)

export const Blockquote = props => (
  <blockquote
    {...props}
    className="border-l-4 border-gray-200 my-6 ml-4 pl-4 italic"
  >
    {props.children}
  </blockquote>
)

export const EM = props => (
  <em {...props} className="italic">
    {props.children}
  </em>
)

export const A = props => (
  <a {...props} className="underline hover:text-blue-500">
    {props.children}
  </a>
)

export const HR = props => (
  <hr {...props} className="border-t border-gray-300 mt-6 mb-8 md:my-8" />
)

export const InlineCode = props => (
  <code
    {...props}
    className="font-mono px-1"
    style={{ backgroundColor: "rgba(255, 229, 100, 0.2)", fontSize: "0.9em" }}
  >
    {props.children}
  </code>
)

export const Pre = props => <div {...props} />

export const Code = props => (
  <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-0 my-8">
    <CodeComponent {...props} />
  </div>
)
