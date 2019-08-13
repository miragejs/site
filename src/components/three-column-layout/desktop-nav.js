import React from "react"
import { Link } from "@reach/router"

const MAX_WIDTH = 1400
const MAIN_WIDTH = 870
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

export function DesktopLeftNav(props) {
  return (
    <div
      className="flex-shrink-0 bg-gray-100 border-r border-gray-200 hidden lg:block min-w-56"
      style={{
        width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
        paddingLeft: `calc((100% - ${MAX_WIDTH}px)/ 2)`,
      }}
    >
      <nav className="px-8 pt-8 xl:pt-14 sticky top-0 leading-none h-screen overflow-y-scroll">
        <ul className="mt-2">
          {props.routes.map(route => (
            <li className="mb-8" key={route.fullPath}>
              <span className="text-gray-800 text-base+ font-medium">
                {route.label}
              </span>
              <ul className="ml-2 mt-2 font-normal leading-snug">
                {route.routes.map(route => (
                  <DesktopLeftNavLink
                    fullPath={route.fullPath}
                    key={route.fullPath}
                  >
                    {route.label}
                  </DesktopLeftNavLink>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function DesktopLeftNavLink({ fullPath, ...props }) {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return {
      className: isPartiallyCurrent
        ? "text-gray-900"
        : "text-gray-600 hover:text-gray-900",
    }
  }

  return (
    <li className="py-1" key={props.route}>
      <Link getProps={isPartiallyActive} to={fullPath} {...props} />
    </li>
  )
}

export function DesktopRightNav(props) {
  return (
    <div
      className="hidden xl:block flex-shrink-0"
      style={{
        width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
        paddingRight: `calc((100% - 1408px)/ 2)`,
      }}
    >
      {props.currentPageTableOfContentsItems.length ? (
        <div className="pr-8">
          <nav className="mt-32 ml-8 sticky">
            <p className="uppercase text-xs text-gray-800 font-medium tracking-wider">
              On this page
            </p>

            <ul className="mt-2 font-normal text-sm">
              {props.currentPageTableOfContentsItems.map(item => (
                <li key={item.url} className="my-2 font-medium text-blue-500">
                  {item.title}

                  {item.items && (
                    <ul className="pl-4">
                      {item.items.map(item => (
                        <li
                          key={item.url}
                          className="my-2 font-medium text-blue-500"
                        >
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
