import React, { useState, useContext } from "react"
import { Router, Link } from "@reach/router"
import Helmet from "react-helmet"
import Logo from "../assets/images/logo.svg"
import RoutesService from "../lib/routes-service"

// Glob import all components in the route directory
const routeComponentsMap = {}
function importAll(r) {
  r.keys().forEach(key => {
    let keyWithoutExtension = key.substr(0, key.lastIndexOf(".")) || key

    routeComponentsMap[keyWithoutExtension] = r(key)
  })
}
importAll(require.context("./", true, /\.(js|jsx|mdx|tx|tsx)$/))

const themeClasses = {
  light: {
    active: "text-gray-900",
    inactive: "text-gray-600 hover:text-gray-900",
  },
  dark: {
    active: "text-gray-100",
    inactive: "text-gray-500 hover:text-gray-100",
  },
}

const routesService = new RoutesService()

export const ThemeContext = React.createContext()

export default function(props) {
  let [theme, setTheme] = useState("light")

  routesService.activePath = props.location.pathname

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Helmet>
        <html className={`${theme === "dark" ? "bg-gray-1000" : "bg-white"}`} />
      </Helmet>

      <div className="antialiased text-gray-700 font-body font-light leading-normal min-h-screen flex flex-col">
        <div
          className={`relative z-10 ${
            theme === "light" ? "bg-white shadow" : ""
          }`}
        >
          <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl md:px-8">
            <Header />
          </div>
        </div>

        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

function Header() {
  let { theme } = useContext(ThemeContext)
  let [isShowingMobileNav, setIsShowingMobileNav] = useState(false)

  return (
    <header
      className={`
        ${isShowingMobileNav && theme === "dark" ? "bg-gray-900" : ""}
      `}
    >
      <div className="flex items-center">
        <Link
          to="/"
          className="px-5 py-3 2xl:py-2 2xl:px-0"
          onClick={() => setIsShowingMobileNav(false)}
        >
          <Logo
            className={`w-8 h-8 md:w-10 md:h-16 ${
              theme === "dark" ? "text-green-500" : "text-gray-900"
            }`}
          />
        </Link>

        {/* Mobile nav button */}
        <div className="ml-auto md:hidden">
          <button
            onClick={() => setIsShowingMobileNav(!isShowingMobileNav)}
            className={`flex px-5 py-3 2xl:py-2 items-center focus:outline-none ${
              themeClasses[theme]["inactive"]
            } lg:hidden `}
          >
            {isShowingMobileNav ? (
              <svg
                className="fill-current w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path>
              </svg>
            ) : (
              <svg
                className="fill-current w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex md:w-full">
          <NavLink to="/docs">Documentation</NavLink>

          <div className="ml-auto">
            <a
              href="https://github.com/miragejs/server"
              className={themeClasses[theme]["inactive"]}
            >
              <svg
                className="fill-current h-7"
                viewBox="0 0 16 16"
                version="1.1"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {isShowingMobileNav && (
        <nav className="font-medium text-lg">
          <div
            className={`border-t border-b ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <MobileNavLink
              to="/docs"
              onClick={() => setIsShowingMobileNav(false)}
            >
              Documentation
            </MobileNavLink>
          </div>

          <div>
            <MobileNavLink
              to="https://github.com/miragejs/server"
              onClick={() => setIsShowingMobileNav(false)}
            >
              GitHub
            </MobileNavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

function MobileNavLink(props) {
  const { theme } = useContext(ThemeContext)
  const baseClasses = `block px-5 py-4`
  const isExternal = props.to.indexOf("http") === 0
  const linkClasses = {
    light: {
      active: "text-gray-900",
      inactive: "text-gray-600 hover:text-gray-900",
    },
    dark: {
      active: "text-gray-100",
      inactive: "text-gray-100 hover:text-gray-100",
    },
  }

  let link

  if (isExternal) {
    link = (
      <a
        href={props.to}
        {...props}
        className={`${baseClasses} ${linkClasses[theme]["inactive"]}`}
      >
        {props.children}
      </a>
    )
  } else {
    const isPartiallyActive = ({ isPartiallyCurrent }) => {
      let state = isPartiallyCurrent ? "active" : "inactive"

      return {
        className: `${baseClasses} ${linkClasses[theme][state]}`,
      }
    }

    link = <Link {...props} getProps={isPartiallyActive} />
  }

  return link
}

function NavLink(props) {
  const { theme } = useContext(ThemeContext)
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    let state = isPartiallyCurrent ? "active" : "inactive"

    return {
      className: `ml-12 font-medium ${themeClasses[theme][state]}`,
    }
  }

  return <Link getProps={isPartiallyActive} {...props} />
}

function Outlet() {
  function renderRoutes(routes) {
    return routes.map(route => {
      let explicitComponent =
        routeComponentsMap[`./${route.fullName.replace(/\./g, "/")}`]
      let EmptyComponent = props => props.children
      let Component = explicitComponent
        ? explicitComponent.default
        : EmptyComponent

      return (
        <Component path={route.path} key={route.fullName}>
          {renderRoutes(route.routes)}
        </Component>
      )
    })
  }

  return <Router>{renderRoutes(routesService.routes)}</Router>
}
