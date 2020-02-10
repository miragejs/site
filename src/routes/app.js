import React, { useState, useEffect, Fragment } from "react"
import { Router, Link, Match, navigate } from "@reach/router"
import { Helmet } from "react-helmet"
import { ReactComponent as LogoAndName } from "../assets/images/logo-and-name.svg"
import { ReactComponent as Logo } from "../assets/images/logo.svg"
import { ReactComponent as Github } from "../assets/images/github.svg"
import { ReactComponent as Twitter } from "../assets/images/twitter.svg"
import { ReactComponent as Discord } from "../assets/images/discord.svg"
import { Close, Menu } from "../components/icons"
import { ThemeProvider } from "../contexts/theme"
import { RouterProvider } from "../contexts/router"
import { useRouter } from "../hooks/use-router"
import { useTheme } from "../hooks/use-theme"
import SEO from "../components/seo"
import SignupForm from "../components/signup-form"
import ErrorBoundary from "../components/error-boundary"
import NotFound from "./not-found"

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

export default function(props) {
  return (
    <RouterProvider {...props}>
      <ThemeProvider {...props}>
        <AppInner {...props} />
      </ThemeProvider>
    </RouterProvider>
  )
}

function AppInner(props) {
  let { theme } = useTheme()
  let router = useRouter()
  // activePage is not set for /api routes, once we fix this we should be able
  // to remove this conditional logic.
  let showHeaderNav = true // default
  if (router.activePage && router.activePage.meta.showHeaderNav !== undefined) {
    showHeaderNav = router.activePage.meta.showHeaderNav
  }

  let title
  if (router.activePage && router.activePage.label) {
    title = router.activePage.label
  }

  return (
    <Fragment>
      <Helmet>
        <html className={`${theme === "dark" ? "bg-gray-1000" : "bg-white"}`} />
      </Helmet>

      <SEO title={title} />

      <div className="flex flex-col min-h-screen antialiased leading-normal text-gray-700 font-body">
        <Header showHeaderNav={showHeaderNav} />

        <main className="flex flex-col flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </Fragment>
  )
}

function Header({ showHeaderNav }) {
  const { theme } = useTheme()
  const [isShowingMobileNav, setIsShowingMobileNav] = useState(false)
  const router = useRouter()

  return (
    <div
      className={`relative z-50 ${
        theme === "dark" ? "bg-gray-1000" : "bg-white shadow"
      }`}
    >
      <div className="md:px-8">
        <div className="mx-auto max-w-7xl">
          <header
            className={`lg:py-2
              ${isShowingMobileNav && theme === "dark" ? "bg-gray-900" : ""}
            `}
          >
            <div className="flex items-center">
              <Link
                to="/"
                className={`px-5 py-2 md:px-0 flex items-center flex-shrink-0  ${
                  // theme === "dark" ? "text-green-500" : "text-gray-900"
                  theme === "dark" ? "text-green-500" : "text-green-500"
                }`}
                onClick={() => setIsShowingMobileNav(false)}
              >
                <LogoAndName
                  className={`
                  ${
                    theme === "dark"
                      ? "w-24 md:w-28 lg:w-34 py-3 text-gray-100"
                      : "w-24 md:w-28 py-2 lg:py-1 text-gray-900"
                  }
                `}
                />
              </Link>

              {/* Leaving out for now, but want to make this work. Just need to figure out a treatment for homepage. */}
              {/* <span
                style={{ marginLeft: "125px", marginRight: "50px" }}
                className={`hidden lg:block py-4 border-l ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "lg:block border-gray-200"
                }`}
              ></span> */}

              {/* Mobile nav button */}
              {showHeaderNav ? (
                <div className="ml-auto md:hidden">
                  <button
                    onClick={() => setIsShowingMobileNav(!isShowingMobileNav)}
                    className={`flex px-5 py-3 2xl:py-2 items-center focus:outline-none ${themeClasses[theme]["inactive"]} lg:hidden `}
                  >
                    {isShowingMobileNav ? (
                      <Close className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : null}

              {/* Desktop nav */}
              <div
                className={`hidden md:flex md:items-center md:ml-8 lg:ml-16
                  ${theme === "dark" ? "pt-1" : ""}`}
              >
                {showHeaderNav ? (
                  <Fragment>
                    <NavLink
                      to={router.routerFor("/docs").pages[0].fullPath}
                      activeFor="/docs/*"
                    >
                      Guides
                    </NavLink>
                    <NavLink to="/api/classes/association" activeFor="/api/*">
                      API
                    </NavLink>
                    <NavLink
                      to={router.routerFor("/quickstarts").pages[0].fullPath}
                      activeFor="/quickstarts/*"
                    >
                      Quickstarts
                    </NavLink>
                  </Fragment>
                ) : null}
              </div>

              <div className="hidden md:flex md:items-center md:ml-auto">
                <a
                  href="https://discord.gg/pPsdsrn"
                  className={`px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
                >
                  <Discord className="h-5 fill-current" />
                </a>
                <a
                  href="https://twitter.com/miragejs"
                  className={`px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
                >
                  <Twitter className="h-5 fill-current" />
                </a>
                <a
                  href="https://github.com/miragejs/miragejs"
                  className={`px-1 ${themeClasses[theme]["inactive"]}`}
                >
                  <Github className="h-5 fill-current" />
                </a>
              </div>
            </div>

            {/* Mobile nav */}
            {isShowingMobileNav && (
              <nav className="text-lg font-medium md:hidden">
                <div
                  className={`border-t ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <MobileNavLink
                    to="/docs/getting-started/introduction"
                    onClick={() => setIsShowingMobileNav(false)}
                  >
                    Guides
                  </MobileNavLink>
                </div>

                <div
                  className={`border-t ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <MobileNavLink
                    to="/api/classes/association"
                    onClick={() => setIsShowingMobileNav(false)}
                  >
                    API
                  </MobileNavLink>
                </div>

                <div
                  className={`border-t ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <MobileNavLink
                    to="https://github.com/miragejs/miragejs"
                    onClick={() => setIsShowingMobileNav(false)}
                  >
                    GitHub
                  </MobileNavLink>
                </div>
              </nav>
            )}
          </header>
        </div>
      </div>
    </div>
  )
}

function MobileNavLink(props) {
  const { theme } = useTheme()
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

function NavLink({ activeFor, ...props }) {
  const { theme } = useTheme()

  activeFor = activeFor || props.to

  return (
    <Match path={activeFor}>
      {({ match }) => {
        let state = match ? "active" : "inactive"

        return (
          <Link
            {...props}
            className={`mr-5 lg:mr-7 px-1 font-medium ${themeClasses[theme][state]}`}
          />
        )
      }}
    </Match>
  )
}

let memoizedOutlet

function renderRoutes(routes) {
  return (
    routes.length > 0 &&
    routes.map(route => {
      let explicitComponent =
        routeComponentsMap[`./${route.fullName.replace(/\./g, "/")}`]
      let EmptyComponent = props => <Fragment>{props.children}</Fragment>
      let Component = explicitComponent
        ? explicitComponent.default
        : EmptyComponent

      return (
        <Component path={route.path} key={route.fullName}>
          {renderRoutes(route.routes)}
        </Component>
      )
    })
  )
}

function Outlet() {
  let router = useRouter()

  if (!memoizedOutlet) {
    memoizedOutlet = renderRoutes(router.routes)
  }

  useEffect(() => {
    if (!router.activePage && router.activeRoute) {
      // we're not on a page, but we're somewhere in the router
      // lets jump to the first rendering page
      // tldr: /docs -> /docs/getting-started/introduction
      let bestPage = router.activeRoute.pages[0]
      if (!bestPage.isDynamic) {
        navigate(bestPage.fullPath, { replace: true })
      }
    }
  }, [router.activePage, router.activeRoute])

  return (
    <Router primary={false}>
      {memoizedOutlet}
      <NotFound default />
    </Router>
  )
}

function Footer() {
  let router = useRouter()

  return (
    <footer className="px-5 pt-16 pb-12 md:pb-20 bg-gray-1000 xl:px-16">
      <div className="max-w-lg mx-auto md:max-w-xl lg:max-w-3xl xl:max-w-5xl">
        <div className="">
          <div className="flex -mx-3 md:text-lg">
            <div className="w-1/2 px-3 xl:w-1/4">
              <p className="py-1 pl-3 text-sm tracking-wide text-gray-600 uppercase md:text-base md:pl-0">
                Docs
              </p>
              <div className="pl-3 mt-1 border-l border-gray-800 md:pl-0 md:border-none">
                <ul>
                  <li className="py-1 text-white">
                    <Link to={router.routerFor("/docs").pages[0].fullPath}>
                      Guides
                    </Link>
                  </li>
                  <li className="py-1 text-white">
                    <Link to="/api/classes/association">API</Link>
                  </li>
                  <li className="py-1 text-white">
                    <Link
                      to={router.routerFor("/quickstarts").pages[0].fullPath}
                    >
                      Quickstarts
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-1/2 px-3 xl:w-1/4">
              <p className="py-1 pl-3 text-sm tracking-wide text-gray-600 uppercase md:text-base md:pl-0">
                Community
              </p>
              <div className="pl-3 mt-1 border-l border-gray-800 md:pl-0 md:border-none">
                <ul>
                  <li className="py-1 text-white">
                    <a href="https://github.com/miragejs/miragejs">GitHub</a>
                  </li>
                  <li className="py-1 text-white">
                    <a href="https://discord.gg/pPsdsrn">Discord</a>
                  </li>
                  <li className="py-1 text-white">
                    <a href="https://twitter.com/miragejs">Twitter</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 md:py-12">
          <div className="md:border-t md:border-gray-800" />
        </div>

        <div className="md:flex">
          <div className="md:w-3/4 xl:w-1/2">
            <SignupForm />
          </div>

          <div className="flex justify-center mt-16 md:items-end md:w-1/4 md:mt-0 md:justify-end xl:ml-auto">
            <Link to="/" className="block p-1">
              <Logo className="w-8 md:w-10" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
