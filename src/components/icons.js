import React from "react"
import { animated } from "react-spring"

export const Ellipsis = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Artboard-Copy" className="fill-current">
        <circle id="Oval" cx="35.5" cy="55.5" r="4.5"></circle>
        <circle id="Oval-Copy" cx="15.5" cy="55.5" r="4.5"></circle>
        <circle id="Oval-Copy-2" cx="55.5" cy="55.5" r="4.5"></circle>
      </g>
    </g>
  </svg>
)

const caretInner = (
  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <polyline
      className="stroke-current"
      strokeWidth="6"
      points="25 56 46 35 25 14"
    ></polyline>
  </g>
)

export function Caret(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 70 70"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {caretInner}
    </svg>
  )
}
export function AnimatedCaret(props) {
  return (
    <animated.svg
      {...props}
      viewBox="0 0 70 70"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {caretInner}
    </animated.svg>
  )
}

export const CaretDown = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="caret-down" className="stroke-current" strokeWidth="6">
        <polyline
          id="Path"
          transform="translate(35.500000, 35.000000) rotate(-270.000000) translate(-35.500000, -35.000000) "
          points="25 56 46 35 25 14"
        ></polyline>
      </g>
    </g>
  </svg>
)

export const CaretDownWide = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="caret-down-wide" className="stroke-current" strokeWidth="5">
        <polyline
          id="Path"
          transform="translate(35.000000, 35.500000) rotate(-270.000000) translate(-35.000000, -35.500000) "
          points="24.9607843 67.5 45.0392157 35.5 24.9607843 3.5"
        ></polyline>
      </g>
    </g>
  </svg>
)

export const Close = props => (
  <svg
    className={`fill-current ${props.className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path>
  </svg>
)

export const Menu = props => (
  <svg
    className={`fill-current ${props.className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
  </svg>
)
