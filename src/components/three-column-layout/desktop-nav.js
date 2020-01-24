import React from "react"
import { Link } from "@reach/router"

const MAX_WIDTH = 1280
const MAIN_WIDTH = 850
const SIDEBAR_WIDTH = (MAX_WIDTH - MAIN_WIDTH) / 2

export function DesktopLeftNav(props) {
  return (
    <div
      className="flex-shrink-0 hidden bg-gray-100 border-r border-gray-200 lg:block min-w-56"
      style={{
        width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
        paddingLeft: `calc((100% - 64px - ${MAX_WIDTH}px)/ 2)`,
      }}
    >
      <nav className="sticky top-0 h-screen px-8 pt-8 overflow-y-scroll leading-none xl:pt-12">
        <ul className="mt-2">
          {props.routes.map(route => (
            <li className="mb-8" key={route.fullPath}>
              <span className="text-gray-800 text-base+ font-medium">
                {route.label}
              </span>
              <ul className="mt-3 ml-2 font-normal leading-snug">
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
  const isPartiallyActive = ({ href, location }) => {
    let isCurrent =
      location.pathname === href || location.pathname === `${href}/`

    return {
      className: isCurrent
        ? "text-gray-900"
        : "text-gray-600 hover:text-gray-900",
    }
  }

  return (
    <li className="pt-1 pb-2" key={props.route}>
      <Link getProps={isPartiallyActive} to={fullPath} {...props} />
    </li>
  )
}

export function DesktopRightNav(props) {
  return (
    <div
      className="flex-shrink-0 hidden xl:block"
      style={{
        width: `calc(((100% - ${MAX_WIDTH}px)/ 2) + ${SIDEBAR_WIDTH}px)`,
        paddingRight: `calc((100% - ${MAX_WIDTH}px)/ 2)`,
      }}
    >
      {props.currentPageTableOfContentsItems.length ? (
        <div className="sticky top-0">
          <nav className="pt-12 mt-20">
            <p className="text-xs font-medium tracking-wider text-gray-800 uppercase">
              On this page
            </p>

            <ul className="mt-2 text-sm font-normal leading-snug">
              {props.currentPageTableOfContentsItems.map(item => (
                <li key={item.url} className="my-3 font-medium">
                  <a
                    className="text-blue-500 hover:text-blue-300"
                    href={item.url}
                  >
                    {item.title}
                  </a>

                  {item.items && (
                    <ul className="pl-4">
                      {item.items.map(item => (
                        <li key={item.url} className="my-3 font-medium">
                          <a
                            className="text-blue-500 hover:text-blue-300"
                            href={item.url}
                          >
                            {item.title}
                          </a>
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
