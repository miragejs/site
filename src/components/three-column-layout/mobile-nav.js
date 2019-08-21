import React, { useState } from "react"
import { CaretDownWide } from "../icons"
import { Link } from "@reach/router"

export function MobileNav(props) {
  let [mobileSecondaryNavIsOpen, setMobileSecondaryNavIsOpen] = useState(false)

  return (
    <div className="md:px-20 lg:hidden">
      <div
        className="
          sm:max-w-md sm:mx-auto sm:pt-8
          md:max-w-2xl md:pt-12
        "
      >
        <div
          className="text-sm font-normal text-gray-500 bg-gray-100
          sm:border
        "
        >
          <button
            className="w-full px-5 py-3 flex items-center justify-between focus:outline-none"
            onClick={() =>
              setMobileSecondaryNavIsOpen(!mobileSecondaryNavIsOpen)
            }
          >
            <span>Contents</span>
            <span
              style={{
                transform: mobileSecondaryNavIsOpen ? "rotate(180deg)" : "",
              }}
            >
              <CaretDownWide className="w-4 h-4" />
            </span>
          </button>
          {mobileSecondaryNavIsOpen && (
            <div className="px-5 border-b border-gray-200 sm:border-none">
              <nav className="border-t border-gray-200 pt-5 pb-4 text-gray-700 text-base">
                <ul className="pt-2w">
                  {props.routes.map(route => (
                    <li className="mb-5" key={route.fullPath}>
                      <div className="uppercase text-gray-400 text-sm font-medium">
                        {route.label}
                      </div>
                      <ul>
                        {route.routes.map(route => (
                          <MobileNavLink
                            fullPath={route.fullPath}
                            key={route.fullPath}
                            onClick={() => setMobileSecondaryNavIsOpen(false)}
                          >
                            {route.label}
                          </MobileNavLink>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileNavLink({ fullPath, ...otherProps }) {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: `block py-1 ${isPartiallyCurrent ? "text-gray-400" : ""}`,
    }
  }

  return (
    <li key={fullPath}>
      <Link getProps={isPartiallyActive} to={fullPath} {...otherProps} />
    </li>
  )
}
