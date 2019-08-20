import React from "react"
import { DesktopLeftNav, DesktopRightNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"
import { MDXProvider } from "@mdx-js/react"
import { Link } from "@reach/router"
import Code from "../code"

export function ThreeColumnLayout(props) {
  let currentPageTableOfContentsItems =
    props.currentPageTableOfContentsItems || []

  return (
    <div className="bg-white">
      <MobileNav routes={props.routes} />

      <div className="flex-1 flex">
        <DesktopLeftNav
          routes={props.routes}
          currentPageTableOfContentsItems={currentPageTableOfContentsItems}
        />

        <div
          className="flex-1 w-full px-5 pt-7 font-normal text-gray-800
            text-base leading-copy
            sm:pt-8
            md:leading-relaxed md:pt-8 md:px-20
            lg:pt-12
          "
        >
          <div
            className="max-w-md mx-auto
            md:max-w-2-5xl md:text-lg
            lg:ml-0
            xl:mx-auto
          "
          >
            <MDXProvider components={components}>{props.children}</MDXProvider>

            <div className="flex justify-between pt-4 pb-24 md:pt-8">
              <div>
                {props.previousPage ? (
                  <Link
                    to={props.previousPage.fullPath}
                    className="block hover:opacity-75"
                  >
                    <div className="text-sm">Previous</div>
                    <div className="text-blue-500 text-xl">
                      {props.previousPage.label}
                    </div>
                  </Link>
                ) : null}
              </div>
              <div>
                {props.nextPage ? (
                  <Link
                    to={props.nextPage.fullPath}
                    className="block hover:opacity-75"
                  >
                    <div className="text-sm text-right">Next</div>
                    <div className="text-blue-500 text-xl">
                      {props.nextPage.label}
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <DesktopRightNav
          currentPageTableOfContentsItems={currentPageTableOfContentsItems}
        />
      </div>
    </div>
  )
}

const components = {
  h1: props => (
    <h1
      {...props}
      className="text-gray-900 font-title font-normal leading-tight
        mb-6 text-4xl
        md:mb-8 md:text-5xl
      "
    >
      {props.children}
    </h1>
  ),

  h2: props => (
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
  ),

  h3: props => (
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
  ),

  p: props => (
    <p {...props} className="my-5">
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
    <li {...props} className="md:pl-2">
      {props.children}
    </li>
  ),

  strong: props => (
    <strong {...props} className="font-medium">
      {props.children}
    </strong>
  ),

  a: props => (
    <a {...props} className="underline hover:text-blue-500">
      {props.children}
    </a>
  ),

  hr: props => (
    <hr {...props} className="border-t border-gray-300 mt-6 mb-8 md:my-8" />
  ),

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
    <div className="sm:rounded-lg overflow-hidden -mx-5 md:mx-0 my-8">
      <Code {...props} />
    </div>
  ),
}
