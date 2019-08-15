import React from "react"

// TODO: Move presenter components from three-column-layout MDX components hash to here

// Lead text, used below <h1> but more prominent than normal <p> copy
export const Lead = ({ children }) => (
  <p className="font-light my-4 text-gray-900 text-lg md:text-xl leading-normal">
    {children}
  </p>
)
