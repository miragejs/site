import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import Spinner from "../assets/images/loading-spinner.svg"

function useWindowWidth() {
  let isBrowser = typeof window !== "undefined"
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    if (isBrowser) {
      window.addEventListener("resize", handleResize)
    }

    return () => {
      isBrowser && window.removeEventListener("resize", handleResize)
    }
  }, [])

  return width
}

function Button({ isRunning = false, children }) {
  // configure
  let buttonExpandDuration = 0.25
  let spinnerOpacityDuration = 0.25

  // state
  let spinnerEl = useRef(null)
  let windowWidth = useWindowWidth()

  let [shouldUseTransitions, setShouldUseTransitions] = useState(false)
  let [spinnerWidth, setSpinnerWidth] = useState(0)
  let [spinnerTop, setSpinnerTop] = useState(0)
  let [isNudged, setIsNudged] = useState(isRunning)
  let [isShowingSpinner, setIsShowingSpinner] = useState(isRunning)
  let [isWideButton, setIsWideButton] = useState(false)

  let nudgeAmount = isWideButton ? 0 : spinnerWidth * 0.75
  let spinnerOffset = isWideButton ? spinnerWidth * 0.75 : nudgeAmount + 1

  // this grabs the size of the spinner
  // we need to render at least once before we know what spinnerWidth
  // actually is. so we'll useLayoutEffect to  make the re-render sync
  // before the browser paints the button
  useLayoutEffect(() => {
    let verticalSpacing =
      spinnerEl.current.parentElement.offsetHeight -
      spinnerEl.current.offsetHeight
    setSpinnerWidth(spinnerEl.current.offsetWidth)
    setSpinnerTop(verticalSpacing / 2 - 2)
    setIsWideButton(windowWidth < 768)
  }, [windowWidth])

  useEffect(() => {
    // we'll start animating things here as state changes.
    // if we dont know the spinnerWidth we're going to exit,
    // because without that we can really animate.
    if (!spinnerWidth) {
      return
    }

    // if we have the spinnerWidth we know we've done at least
    // one render. that means that we can start animating, so we'll
    // enable transitions
    setShouldUseTransitions(true)
  }, [spinnerWidth])

  // For smaller buttons we'll stagger the animation so the next
  // nudges and then the spinner comes in
  useEffect(() => {
    if (!isWideButton) {
      if (isRunning) {
        isNudged ? setIsShowingSpinner(true) : setIsNudged(true)
      } else {
        isShowingSpinner ? setIsShowingSpinner(false) : setIsNudged(false)
      }
    }
  }, [isRunning, isWideButton])

  // for large buttons we don't need to nudge, so we wont stagger
  // the animation
  useEffect(() => {
    if (isWideButton) {
      setIsShowingSpinner(isRunning)
      setIsNudged(isRunning)
    }
  }, [isRunning])

  let handleTransitionEnd = function(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsNudged(isRunning)
    setIsShowingSpinner(isRunning)
  }

  return (
    <button
      disabled={isRunning}
      onTransitionEnd={e => handleTransitionEnd(e)}
      className={`p-3 md:px-8 text-white ${
        isNudged ? "bg-green-dark opacity-50" : "bg-green"
      } ${isRunning && "cursor-not-allowed"}
      relative mt-4 md:mt-0 w-full md:w-auto rounded bg-green hover:bg-green-dark focus:outline-none focus:outline-shadow md:rounded-l-none`}
      style={{
        transition: shouldUseTransitions
          ? `background-color ${buttonExpandDuration}s, color ${buttonExpandDuration}s`
          : "",
      }}
    >
      <div
        onTransitionEnd={e => handleTransitionEnd(e)}
        style={{
          transform: isNudged
            ? `translateX(${-nudgeAmount}px)`
            : `translateX(0)`,
          transition: shouldUseTransitions
            ? `transform ${buttonExpandDuration}s`
            : "",
        }}
      >
        {children}
      </div>
      <span
        ref={spinnerEl}
        onTransitionEnd={e => handleTransitionEnd(e)}
        className={`absolute ${isShowingSpinner ? "opacity-100" : "opacity-0"}`}
        style={{
          transition: shouldUseTransitions
            ? `opacity ${spinnerOpacityDuration}s`
            : "",
          right: `${spinnerOffset}px`,
          top: `${spinnerTop}px`,
        }}
      >
        <Spinner className="h-5 w-5 loading" />
      </span>
    </button>
  )
}

export default Button
