import React, { useState, useEffect, Fragment, useRef } from "react"
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
import { sidebarWidth } from "../components/three-column-layout/desktop-nav"
import "docsearch.js/dist/cdn/docsearch.min.css"
import "@reach/dialog/styles.css"
import { DialogOverlay, DialogContent } from "@reach/dialog"
import useKeyboardShortcut from "../hooks/use-keyboard-shortcut"
import { createGlobalStyle } from "styled-components"
import "focus-visible/dist/focus-visible.min.js"

// Glob import all components in the route directory
const routeComponentsMap = {}
function importAll(r) {
  r.keys().forEach((key) => {
    let keyWithoutExtension = key.substr(0, key.lastIndexOf(".")) || key

    routeComponentsMap[keyWithoutExtension] = r(key)
  })
}
importAll(require.context("./", true, /\.(js|jsx|mdx|tx|tsx)$/))

const themeClasses = {
  light: {
    active: "text-gray-900",
    inactive: "text-gray-600 hover:text-gray-900",
    divider: "border-gray-300",
  },
  dark: {
    active: "text-gray-100",
    inactive: "text-gray-500 hover:text-gray-100",
    divider: "border-gray-700",
  },
}

export default function (props) {
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
    <div className="relative z-0">
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
    </div>
  )
}

function Header({ showHeaderNav }) {
  const { theme } = useTheme()
  const [isShowingMobileNav, setIsShowingMobileNav] = useState(false)
  const [isShowingSearch, setIsShowingSearch] = useState(false)
  const router = useRouter()

  useKeyboardShortcut("/", () => setIsShowingSearch(true))

  function handleSearchSelect(url) {
    setIsShowingSearch(false)
    navigate(new URL(url).pathname)
  }

  return (
    <div
      className={`z-50 ${
        theme === "dark"
          ? "relative bg-gray-1000"
          : "bg-white shadow fixed top-0 inset-x-0"
      }`}
    >
      <div className="md:px-8">
        <div className="max-w-6xl mx-auto">
          <header
            className={`
              ${isShowingMobileNav && theme === "dark" ? "bg-gray-900" : ""}
            `}
          >
            <div
              className={`flex items-center ${
                theme === "dark" ? "h-24" : "h-16"
              }`}
            >
              <div
                className={`flex items-center ${
                  theme === "light" ? "lg:border-r lg:border-gray-200" : ""
                }`}
                css={`
                  @media (min-width: 1024px) {
                    width: ${theme === "dark" ? "auto" : `${sidebarWidth}px`};
                  }
                `}
              >
                <Link
                  to="/"
                  className="px-5 md:px-0 focus:outline-none focus-visible:shadow-outline"
                  onClick={() => setIsShowingMobileNav(false)}
                >
                  <LogoAndName
                    className={`
                    ${
                      theme === "dark"
                        ? "w-24 md:w-28 lg:w-34 py-3 text-gray-100"
                        : "w-24 md:w-28 text-gray-900"
                    }
                  `}
                  />
                </Link>
              </div>

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
              {showHeaderNav ? (
                <>
                  <div
                    className={`hidden md:flex md:items-center md:ml-8
                      ${theme === "dark" ? "pt-1" : ""}
                    `}
                    css={
                      theme === "light"
                        ? `
                      /*
                        here be dragons...

                        The next one is easier to read, read that first.

                        ...welcome back. This one depends on the viewport width. 100vw - 64px is
                        now the total space reserved for the <main> area. Minus 280px for the sidebar,
                        and then the rest is the same. The only other difference is we use the max()
                        function because 2rem (the padding) will win when the content area starts
                        getting less than 720px.
                      */
                      @media (min-width: 1024px) {
                        margin-left: max(
                          2rem,
                          2rem + ((100vw - 64px - 280px - 2rem - 720px) / 2)
                        );
                      }

                      /*
                        This is a magic number for screens 1220px and above. The sidebar is 280px,
                        leaving 1152px - 280px room for the main area. There's 2rem of padding, and
                        above @media(1220px) the main text area will be 720px. That leaves 

                          (1152px - 280px - 2rem - 720px)

                        space left on either side of it for the dynamic margin value. Divid by 2
                        to get the dynamic margin-left value, then add back in the padding.
                      */
                      @media (min-width: 1220px) {
                        margin-left: calc(
                          ((1152px - 280px - 2rem - 720px) / 2) + 2rem
                        );
                      }
                    `
                        : `
                      @media (min-width: 1024px) {
                        margin-left: 4rem;
                      }
                      `
                    }
                  >
                    {/* adjust for vertical border on light screens */}
                    <div className={theme === "light" ? "-ml-1" : ""}>
                      <NavLink
                        to={router.routerFor("/docs").pages[0].url}
                        activeFor="/docs/*"
                      >
                        Guides
                      </NavLink>
                      <NavLink
                        to="/api/classes/association/"
                        activeFor="/api/*"
                      >
                        API
                      </NavLink>
                      <NavLink
                        to={router.routerFor("/quickstarts").pages[0].url}
                        activeFor="/quickstarts/*"
                      >
                        Quickstarts
                      </NavLink>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="hidden md:flex md:items-center md:ml-auto">
                <button
                  onClick={() => setIsShowingSearch(!isShowingSearch)}
                  className={`focus:outline-none focus-visible:shadow-outline px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
                >
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
                    <title>Search</title>
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {/* <div
                  className={`w-px h-5 mr-8 border-l ${themeClasses[theme]["divider"]}`}
                /> */}
                <a
                  href="https://discord.gg/pPsdsrn"
                  className={`focus:outline-none focus-visible:shadow-outline px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
                >
                  <Discord className="h-5 fill-current" />
                </a>
                <a
                  href="https://twitter.com/miragejs"
                  className={`focus:outline-none focus-visible:shadow-outline px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
                >
                  <Twitter className="h-5 fill-current" />
                </a>
                <a
                  href="https://github.com/miragejs/miragejs"
                  className={`focus:outline-none focus-visible:shadow-outline px-1 ${themeClasses[theme]["inactive"]}`}
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
                    to="/docs/getting-started/introduction/"
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
                    to="/api/classes/association/"
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
                    to={router.routerFor("/quickstarts").pages[0].url}
                    onClick={() => setIsShowingMobileNav(false)}
                  >
                    Quickstarts
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

      {isShowingSearch && (
        <DialogOverlay
          className="bg-gray-900.50"
          onDismiss={() => setIsShowingSearch(false)}
        >
          <DialogContent
            aria-label="search"
            style={{
              margin: 0,
              padding: 0,
              width: "auto",
              background: "transparent",
            }}
          >
            <Search onSelect={handleSearchSelect} />
          </DialogContent>
        </DialogOverlay>
      )}
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
            className={`focus:outline-none focus-visible:shadow-outline mr-5 lg:mr-7 px-1 font-medium ${themeClasses[theme][state]}`}
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
    routes.map((route) => {
      let explicitComponent =
        routeComponentsMap[`./${route.fullName.replace(/\./g, "/")}`]
      let EmptyComponent = (props) => <Fragment>{props.children}</Fragment>
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
        navigate(bestPage.url, { replace: true })
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
    <footer className="px-5 pt-16 pb-12 md:px-8 md:pb-20 bg-gray-1000 xl:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="">
          <div className="flex -mx-3 md:text-lg">
            <div className="w-1/2 px-3 md:w-1/4">
              <p className="py-1 text-sm tracking-wide text-gray-600 uppercase md:text-base">
                Docs
              </p>
              <div className="mt-1">
                <ul>
                  <li className="py-1 text-white">
                    <Link to={router.routerFor("/docs").pages[0].url}>
                      Guides
                    </Link>
                  </li>
                  <li className="py-1 text-white">
                    <Link to="/api/classes/association/">API</Link>
                  </li>
                  <li className="py-1 text-white">
                    <Link to={router.routerFor("/quickstarts").pages[0].url}>
                      Quickstarts
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-1/2 px-3 md:w-1/4">
              <p className="py-1 text-sm tracking-wide text-gray-600 uppercase md:text-base">
                Community
              </p>
              <div className="mt-1">
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

        <div className="py-10 sm:py-12">
          <div className="sm:border-t sm:border-gray-800" />
        </div>

        <div className="sm:flex">
          <div className="w-full max-w-xl">
            <SignupForm />
          </div>

          <div className="flex justify-center mt-16 sm:items-end sm:pl-32 sm:mt-0 sm:justify-end sm:ml-auto">
            <Link to="/" className="block p-1">
              <Logo className="w-8 sm:w-10" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

const AlgoliaStyles = createGlobalStyle`
  .algolia-autocomplete {
    display: block !important;
  }
  .algolia-autocomplete .ds-dropdown-menu {
    width: 100%;
  }
  .algolia-autocomplete .suggestion-layout-simple .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight{
    color: red;
  }
  .algolia-autocomplete .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion:not(.suggestion-layout-simple) .algolia-docsearch-suggestion--content {
    background-color: rgba(5, 199, 126, .10)
  }
  .algolia-autocomplete .algolia-docsearch-suggestion--highlight {
    color: rgba(3, 166, 103);
  }
  .algolia-autocomplete .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight,.algolia-autocomplete .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl1 .algolia-docsearch-suggestion--highlight,.algolia-autocomplete .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight{
    box-shadow: inset 0 -2px 0 0 rgba(3, 166, 103, .8);
  }
`

function Search({ onSelect }) {
  let inputRef = useRef()
  useEffect(() => {
    import("docsearch.js").then((module) => {
      if (document.querySelector("#mirage-algolia-search-input")) {
        module.default({
          apiKey: "4df96bd592d6cdcc40aae9c4a76adc64",
          indexName: "miragejs",
          inputSelector: "#mirage-algolia-search-input",
          debug: false, // Set debug to true to inspect the dropdown
          handleSelected: function (
            input,
            event,
            suggestion,
            datasetNumber,
            context
          ) {
            onSelect(suggestion.url)
          },
        })

        inputRef.current.focus()
      }
    })
  })

  // Seems like aloglia stops keys from propagating. Would like to make ctrl+n/p navigate list.
  // useKeyboardShortcut("ctrl+n", () => {
  //   console.log("hi")
  // })

  return (
    <>
      <AlgoliaStyles />
      <div className="flex items-center mt-24">
        <div className="relative flex-1 max-w-xl mx-auto rounded-md shadow-xl">
          <input
            id="mirage-algolia-search-input"
            ref={inputRef}
            className="block w-full px-5 py-4 text-lg rounded-lg focus:outline-none"
            placeholder={`Search the docs (press "/" to focus)`}
          />
        </div>
      </div>
    </>
  )
}
