import React from "react"

function Container({ children }) {
  return (
    <div className="px-5 max-w-lg md:max-w-1-5xl lg:max-w-3xl lg:px-10 mx-auto">
      {children}
    </div>
  )
}

function Title({ children }) {
  return (
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
  )
}

function Text({ children }) {
  return (
    <p
      className="font-normal text-base leading-copy
        my-5 md:my-6
        md:text-xl md:leading-normal
      "
    >
      {children}
    </p>
  )
}

const Spacer = function({ children, size = "md" }) {
  let classes

  switch (size) {
    case "md":
      classes = "mt-5 md:mt-6"
      break

    case "lg":
      classes = "mt-8 md:mt-10 lg:mt-12"
      break

    case "xl":
      classes = "mt-12 lg:mt-16"
      break

    default:
  }

  return <div className={classes}>{children}</div>
}

export { Container, Spacer, Text, Title }
