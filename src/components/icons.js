import React from "react"

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

export const Caret = props => (
  <svg
    {...props}
    viewBox="0 0 70 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="Artboard"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <polyline
        id="Path"
        className="stroke-current"
        strokeWidth="6"
        points="25 56 46 35 25 14"
      ></polyline>
    </g>
  </svg>
)

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
