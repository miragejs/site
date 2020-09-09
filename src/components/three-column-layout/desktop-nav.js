import React, { useEffect } from "react"
import { Link } from "@reach/router"
import { AnimatedCaret } from "../icons"
import { animated, useSpring } from "react-spring"
import useMeasure from "react-use-measure"
import { ResizeObserver } from "@juggle/resize-observer"
import OutsideClickHandler from "react-outside-click-handler"
import { useRouter } from "../../hooks/use-router"
import { urlsMatch } from "../../utils"
import "./styles.css"
import { useRef } from "react"

// This is used by the header in app.js
export const sidebarWidth = 280

export function DesktopNav({ menuItems }) {
  let router = useRouter()
  let activeUrl = router.activeUrl
  let previousActiveUrl = usePrevious(activeUrl)
  let defaultOpenSection = menuItems.findIndex(
    (menuItem) =>
      menuItem.links &&
      menuItem.links.find((link) => urlsMatch(link.url, activeUrl))
  )

  let [openSections, setOpenSections] = React.useState([defaultOpenSection])

  React.useLayoutEffect(() => {
    if (previousActiveUrl !== activeUrl) {
      setOpenSections([defaultOpenSection])
    }
  }, [activeUrl, previousActiveUrl, defaultOpenSection])

  function toggleSection(section) {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    )
  }

  let carbonAdsRef = useRef()
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "//cdn.carbonads.com/carbon.js?serve=CE7D42QY&placement=miragejscom"
    script.id = "_carbonads_js"

    carbonAdsRef.current.appendChild(script)
  }, [])

  return (
    <div
      className="relative flex-shrink-0 hidden lg:block"
      style={{ width: sidebarWidth }}
    >
      <div className="absolute inset-y-0 right-0 w-screen border-r border-gray-200 bg-gray-50"></div>
      <nav className="sticky top-0 h-screen -mt-16 overflow-y-scroll leading-snug">
        <div className="h-full pt-16">
          <div className="flex flex-col h-full pt-6 pr-8 xl:pt-8">
            <ul className="flex-1">
              {menuItems.map((menuItem, index) =>
                menuItem.url ? (
                  <div className="mt-6" key={index}>
                    <DesktopNavLink link={menuItem} />
                  </div>
                ) : (
                  <li className="mt-6" key={index}>
                    <CollapsibleMenu
                      section={menuItem}
                      isOpen={openSections.includes(index)}
                      toggleSection={() => toggleSection(index)}
                    />
                  </li>
                )
              )}
            </ul>
            <div className="pt-8 pb-6">
              <div ref={carbonAdsRef}></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

function CollapsibleMenu({ section, isOpen, toggleSection }) {
  let [shouldAnimate, setShouldAnimate] = React.useState(false)
  let [ref, bounds] = useMeasure({ polyfill: ResizeObserver })
  let [props, set] = useSpring(() => ({
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    height: isOpen ? bounds.height || "auto" : 0,
  }))

  let activeUrl = useRouter().activeUrl
  let sectionIsActive = section.links.find((link) =>
    urlsMatch(link.url, activeUrl)
  )

  React.useLayoutEffect(() => {
    set({
      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
      height: isOpen ? bounds.height || "auto" : 0,
      immediate: !shouldAnimate,
    })
    setShouldAnimate(false)
  }, [set, isOpen, bounds.height, shouldAnimate])

  function handleClick() {
    setShouldAnimate(true)
    toggleSection()
  }

  return (
    <>
      <button
        className={`flex items-center text-gray-900 focus:outline-none focus-visible:shadow-outline ${
          sectionIsActive ? "font-medium" : ""
        }
          `}
        onClick={handleClick}
      >
        <AnimatedCaret
          style={{
            transform: props.transform,
          }}
          className="inline-block w-4 h-4 text-gray-400"
        />
        <span className="ml-3">{section.label}</span>
      </button>
      <animated.div
        className="overflow-hidden"
        style={{ height: props.height }}
      >
        <div className="pt-1" ref={ref}>
          <ul
            style={{ marginLeft: "10px" }}
            className="pl-4 font-normal border-l border-gray-200"
          >
            {section.links.map((link, index) => (
              <DesktopNavLink link={link} key={index} />
            ))}
          </ul>
        </div>
      </animated.div>
    </>
  )
}

function DesktopNavLink({ link }) {
  let router = useRouter()
  let isActiveRoute = urlsMatch(link.url, router.activeUrl)

  let [, setScrollHeight] = useSpring(() => ({
    scrollHeight: 0,
  }))
  let shouldScroll = true

  function stopScrolling() {
    // The stop() function is broken in v8, it works in v9 but that version breaks other things...
    // stop()
    shouldScroll = false
  }

  React.useEffect(() => {
    document.addEventListener("wheel", stopScrolling)

    return () => {
      document.removeEventListener("wheel", stopScrolling)
    }
  })

  function scrollOrNavigate(e) {
    // TODO: This is a proxy for route.isActive, is this going to be added to the router?
    if (isActiveRoute) {
      e.preventDefault()
      scrollTo(0)
    }
  }

  function scrollToSection(elementId) {
    let element = document.querySelector(elementId)

    scrollTo(element.getBoundingClientRect().top + window.scrollY)
  }

  function scrollTo(scrollHeight) {
    // The stop() function is broken in v8, it works in v9 but that version breaks other things...
    // If we get stop() back we can remove this line and the guard below
    // https://github.com/react-spring/react-spring/issues/544#issuecomment-540661109
    // Hopefully we'll have switched off React Spring by then -_-
    shouldScroll = true

    setScrollHeight({
      from: { scrollHeight: window.scrollY },
      to: { scrollHeight },
      reset: true,
      onFrame(props) {
        if (shouldScroll) {
          window.scroll(0, props.scrollHeight)
        }
      },
    })
  }

  return (
    <li className="mt-4">
      <div className="flex items-center">
        <span className="pr-3 text-gray-300">
          <svg
            viewBox="0 0 100 100"
            className="inline-block w-4 h-4 fill-current"
          >
            <circle r="14" cx="50" cy="50" />
          </svg>
        </span>{" "}
        <Link
          onClick={scrollOrNavigate}
          to={link.url}
          className={`focus:outline-none focus-visible:shadow-outline ${
            isActiveRoute
              ? "text-gray-900 font-medium"
              : "text-gray-800 hover:text-gray-900"
          }`}
        >
          {link.label}
        </Link>
      </div>
      {isActiveRoute && link.headings && (
        <div className="ml-12">
          <OutsideClickHandler onOutsideClick={stopScrolling}>
            <ul>
              {link.headings.map((heading, index) => (
                <li className="pt-3 text-base-" key={index}>
                  <a
                    href={heading.anchor}
                    className="inline-block focus:outline-none focus-visible:shadow-outline"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(heading.anchor)
                    }}
                  >
                    {heading.label}
                  </a>
                  {heading.headings && (
                    <ul className="pt-1 ml-3">
                      {heading.headings.map((heading, index) => (
                        <li className="py-1 truncate" key={index}>
                          <a
                            href={heading.anchor}
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToSection(heading.anchor)
                            }}
                          >
                            <code className="text-xs">{heading.label}</code>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </OutsideClickHandler>
        </div>
      )}
    </li>
  )
}

function usePrevious(value) {
  const ref = React.useRef()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
