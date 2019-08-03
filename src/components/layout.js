import React, { useContext } from "react"
import Logo from "../assets/images/logo.svg"
import { Link } from "gatsby"

const themeClasses = {
  light: {
    active: "text-gray-xx900",
    inactive: "text-gray-xx600 hover:text-gray-xx900",
  },
  dark: {
    active: "text-gray-xx100",
    inactive: "text-gray-xx500 hover:text-gray-xx100",
  },
}

function NavLink(props) {
  const theme = useContext(ThemeContext)
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    let state = isPartiallyCurrent ? "active" : "inactive"

    return {
      className: `ml-12 font-medium ${themeClasses[theme][state]}`,
    }
  }

  return <Link getProps={isPartiallyActive} {...props} />
}

const ThemeContext = React.createContext({ variant: "light" })

export default function({ children, theme = "light" }) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className="antialiased text-gray-xx700 font-body font-light leading-normal min-h-screen flex flex-col">
        <div className={`relative ${theme === "light" && "bg-white shadow"}`}>
          <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl px-5 md:px-8">
            <header className="py-2 flex items-center">
              <Link to="/">
                <Logo
                  className={`w-8 h-8 md:w-10 md:h-16 ${
                    theme === "dark" ? "text-green-500" : "text-gray-xx900"
                  }`}
                />
              </Link>

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
            </header>
          </div>
        </div>

        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </ThemeContext.Provider>
  )
}
