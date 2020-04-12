import React from "react"
import bg from "../../assets/images/background-lines2.png"
import CodeComponent from "../code"
import { Link } from "@reach/router"

// More prominent than P but not a Heading
export const Lead = ({ children }) => (
  <p className="my-4 text-lg font-light leading-normal text-gray-900 md:text-xl">
    {children}
  </p>
)

export const H1 = ({ id, ...rest }) => (
  <h1
    {...rest}
    className="mb-6 text-4xl font-normal leading-tight text-gray-900 font-title md:mb-8 md:text-4-5xl before-h-8 xl:before-h-12"
  >
    {rest.children}
  </h1>
)

export const H2 = (props) => (
  <h2
    {...props}
    className="mt-10 mb-4 text-2xl font-normal leading-tight text-gray-900 font-title md:text-3xl md:mt-14 md:mb-6 before-h-8 xl:before-h-12"
  >
    <a
      href={`#${props.id}`}
      className="inline-block focus:outline-none focus-visible:shadow-outline"
    >
      {props.children}
    </a>
  </h2>
)

export const H3 = (props) => (
  <h3
    {...props}
    className="mt-12 mb-5 font-normal leading-normal text-gray-900 font-title md:mb-6 text-2-25xl before-h-8 xl:before-h-12"
  >
    <a
      href={`#${props.id}`}
      className="inline-block focus:outline-none focus-visible:shadow-outline"
    >
      {props.children}
    </a>
  </h3>
)

export const P = (props) => (
  <p {...props} className="my-5">
    {props.children}
  </p>
)

export const OL = (props) => (
  <ol {...props} className="my-5 ml-8 list-decimal">
    {props.children}
  </ol>
)

export const UL = (props) => (
  <ul {...props} className="my-5 ml-8 list-disc">
    {props.children}
  </ul>
)

export const LI = (props) => (
  <li {...props} className="md:pl-2">
    {props.children}
  </li>
)

export const Strong = (props) => (
  <strong {...props} className="font-medium">
    {props.children}
  </strong>
)

export const Blockquote = (props) => (
  <blockquote
    {...props}
    className="pl-4 my-6 ml-4 italic border-l-4 border-gray-200"
  >
    {props.children}
  </blockquote>
)

export const EM = (props) => (
  <em {...props} className="italic">
    {props.children}
  </em>
)

export function A({ href, children, ...rest }) {
  let Component = href.startsWith("/")
    ? (p) => (
        <Link to={href} {...p}>
          {children}
        </Link>
      )
    : (p) => (
        <a href={href} {...p}>
          {children}
        </a>
      )

  return (
    <Component
      {...rest}
      className="underline hover:text-blue-500 focus:outline-none focus-visible:shadow-outline"
    />
  )
}

export const HR = (props) => (
  <hr {...props} className="mt-6 mb-8 border-t border-gray-300 md:my-8" />
)

export const InlineCode = (props) => (
  <code
    {...props}
    className="px-1 font-mono"
    style={{ backgroundColor: "rgba(255, 229, 100, 0.2)", fontSize: "0.9em" }}
  >
    {props.children}
  </code>
)

export const Pre = (props) => <div {...props} />

export const Code = ({ className, ...rest }) => (
  <CodeComponent
    className={`sm:rounded-lg overflow-hidden -mx-5 md:mx-0 my-8 ${className}`}
    {...rest}
  />
)
export function AspectRatio({ ratio, children }) {
  return (
    <div
      className="relative"
      style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
    >
      <div className="absolute inset-0 w-full h-full">{children}</div>
    </div>
  )
}

export const SectionWithLines = ({ children }) => (
  <section
    className="bg-no-repeat bg-gray-1000"
    style={{
      backgroundSize: "100% 620px, 2300px",
      backgroundPosition: "center top, calc(50% + 225px) -9px",
      backgroundImage: `linear-gradient(45deg, rgb(26, 28, 29) 39%, rgba(26, 28, 29, 0) 65%, rgba(26, 28, 29, 0) 68%, rgba(26, 28, 29) 100%), url(${bg})`,
    }}
  >
    {children}
  </section>
)
