import React, { useState } from "react"
import { CaretDownWide } from "../icons"
import { Link } from "@reach/router"
import { CarbonAds } from "./"

export function MobileNav({ menuItems }) {
  let [mobileSecondaryNavIsOpen, setMobileSecondaryNavIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <div className="sm:max-w-md sm:mx-auto sm:pt-8 md:max-w-2xl md:pt-12">
        <div className="text-sm font-normal text-gray-500 bg-gray-100 sm:border">
          <button
            className="flex items-center justify-between w-full px-5 py-3 focus:outline-none"
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
              <nav className="pt-2 pb-8 text-base text-gray-700 border-t border-gray-200">
                <ul className="pt-2w">
                  {menuItems.map((menuItem, index) =>
                    menuItem.url ? (
                      <li key={index}>
                        <MobileNavLink
                          url={menuItem.url}
                          key={index}
                          onClick={() => setMobileSecondaryNavIsOpen(false)}
                        >
                          {menuItem.label}
                        </MobileNavLink>
                      </li>
                    ) : (
                      <li className="mt-5" key={index}>
                        <div className="font-medium text-gray-500 uppercase text-base-">
                          {menuItem.label}
                        </div>
                        <ul className="ml-4">
                          {menuItem.links.map((link, index) => (
                            <MobileNavLink
                              url={link.url}
                              key={index}
                              onClick={() => setMobileSecondaryNavIsOpen(false)}
                            >
                              {link.label}
                            </MobileNavLink>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>

        <div className="mt-4">{/* <CarbonAds /> */}</div>
      </div>
    </div>
  )
}

function MobileNavLink({ url, ...otherProps }) {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: `block py-1 mt-2 ${
        isPartiallyCurrent ? "font-medium text-gray-900" : ""
      }`,
    }
  }

  return <Link getProps={isPartiallyActive} to={url} {...otherProps} />
}
