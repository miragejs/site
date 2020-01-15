import { ReactComponent as Spinner } from "../assets/images/loading-spinner.svg"
import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import { animated, useSpring, useTransition } from "react-spring"
import useMeasure from "react-use-measure"

let isEmailValid = function(email) {
  // eslint-disable-next-line
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const SPRING_CONFIG = { tension: 275, clamp: true }
// const SPRING_CONFIG = { duration: 500 }

export default function() {
  // configure
  let feedbackDelay = 900

  // state
  let convertKitUrl = "https://app.convertkit.com/forms/987317/subscriptions"
  let [email, setEmail] = useState("")
  let [error, _setError] = useState("")
  let [formState, setFormState] = useState("")

  let setError = function(type) {
    _setError(type)
    setFormState("error")
  }

  let resetForm = function() {
    _setError("")
    setFormState("")
  }

  let isSaving = formState === "saving"
  let isError = formState === "error"
  let didSignup = formState === "finished"

  React.useEffect(() => {
    window.toggle = () => {
      setFormState(formState === "finished" ? "" : "finished")
    }
  })

  // const [trueBlockRef, trueBlockBounds] = useMeasure()
  // const [falseBlockRef, falseBlockBounds] = useMeasure()

  // let falseBlockShowing = {
  //   height: falseBlockBounds.height || "auto",
  //   falseBlockOpacity: 1,
  //   trueBlockOpacity: 0,
  // }

  // let trueBlockShowing = {
  //   height: trueBlockBounds.height || "auto",
  //   falseBlockOpacity: 0,
  //   trueBlockOpacity: 1,
  // }

  // let from = didSignup ? trueBlockShowing : falseBlockShowing

  // let falseToTrue = [{ falseBlockOpacity: 0 }, trueBlockShowing]
  // let trueToFalse = [
  //   { trueBlockOpacity: 0, height: falseBlockBounds.height || "auto" },
  //   falseBlockShowing,
  // ]
  // let to = didSignup ? falseToTrue : trueToFalse

  // let { height, falseBlockOpacity, trueBlockOpacity } = useSpring({
  //   from,
  //   to,
  //   config: SPRING_CONFIG,
  // })

  function handleChange(event) {
    event.preventDefault()

    setEmail(event.target.value)

    if (isError && error === "invalidEmail" && isEmailValid(email)) {
      // user corrected the invalid email, so lets reset the form state
      resetForm()
    }

    if (isError && error === "noEmail" && email) {
      // user started typing after submitting an empty form, lets reset the form state
      resetForm()
    }
  }

  let handleSubmit = async function(event) {
    event.preventDefault()

    if (!email) {
      setError("noEmail")
    } else if (!isEmailValid(email)) {
      setError("invalidEmail")
    } else {
      setFormState("saving")

      let formData = new FormData(event.target)

      try {
        let postData = fetch(convertKitUrl, {
          method: "POST",
          body: formData,
        })

        let waitForFeedback = new Promise(resolve => {
          setTimeout(resolve, feedbackDelay)
        })

        let [response] = await Promise.all([postData, waitForFeedback])

        if (response.ok) {
          setFormState("finished")
        } else {
          setError("serverError")
        }
      } catch (e) {
        console.error(e)
        setError("serverError")
      }
    }
  }

  return (
    <FadeBetweenValues value={didSignup}>
      {value =>
        value ? (
          <p>hi its true</p>
        ) : (
          <p>
            nope its false. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Dicta voluptatibus perspiciatis, vitae eos vel ab debitis
            mollitia, saepe, et ad sunt laborum! Soluta ratione quam voluptas
            atque necessitatibus. Perspiciatis, voluptatum!
          </p>
        )
      }
    </FadeBetweenValues>
  )

  return (
    <animated.div style={{ height }} className="relative overflow-hidden">
      <animated.div
        style={{ opacity: falseBlockOpacity }}
        ref={falseBlockRef}
        className="absolute w-full"
      >
        <p className="text-sm text-white md:text-base">
          Sign up for occasional project updates:
        </p>
        <div className="mt-3">
          <form onSubmit={handleSubmit}>
            <div className="flex shadow-black">
              <input
                type="email"
                required
                name="email_address"
                value={email}
                disabled={isSaving}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border-2 border-r-0 border-transparent rounded rounded-r-none form-input focus:shadow-none focus:border-green-700"
              />
              <Button isRunning={isSaving}>Subscribe</Button>
            </div>
            {isError && (
              <div className="mt-5">
                {error === "serverError" &&
                  "Woops — something's wrong with our signup form 😔. Please try again."}
                {error === "invalidEmail" &&
                  "Oops — that's an invalid email address!"}
                {error === "noEmail" && "Please fill out your email address!"}
              </div>
            )}
          </form>
        </div>
      </animated.div>

      <animated.div
        ref={trueBlockRef}
        className="absolute w-full"
        style={{ opacity: trueBlockOpacity }}
      >
        <p className="text-gray-500">
          Thanks <span className="text-white">{email}</span>! Check your email
          soon to confirm your address.
        </p>
      </animated.div>
    </animated.div>
  )
}

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
  }, [isBrowser])

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
  let isWideButton = false

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
    setSpinnerTop(verticalSpacing / 2)
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
  }, [isRunning, isWideButton, isNudged, isShowingSpinner])

  // for large buttons we don't need to nudge, so we wont stagger
  // the animation
  useEffect(() => {
    if (isWideButton) {
      setIsShowingSpinner(isRunning)
      setIsNudged(isRunning)
    }
  }, [isRunning, isWideButton])

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
      className={`px-6 py-2 md:px-8 text-white ${
        isNudged ? "bg-green-900 opacity-50" : "bg-green-700"
      } ${isRunning && "cursor-not-allowed"}
      relative rounded bg-green-700 hover:bg-green-900 focus:outline-none focus:outline-shadow rounded-l-none`}
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
        <Spinner className="w-4 h-4 loading" />
      </span>
    </button>
  )
}

function FadeBetweenValues({ value, children }) {
  const [trueBlockRef, trueBlockBounds] = useMeasure()
  const [falseBlockRef, falseBlockBounds] = useMeasure()
  let falseBlockShowing = {
    height: falseBlockBounds.height || "auto",
    falseBlockOpacity: 1,
    trueBlockOpacity: 0,
  }
  let trueBlockShowing = {
    height: trueBlockBounds.height || "auto",
    falseBlockOpacity: 0,
    trueBlockOpacity: 1,
  }
  let from = value ? trueBlockShowing : falseBlockShowing
  let falseToTrue = [{ falseBlockOpacity: 0 }, trueBlockShowing]
  let trueToFalse = [
    { trueBlockOpacity: 0, height: falseBlockBounds.height || "auto" },
    falseBlockShowing,
  ]
  let to = value ? falseToTrue : trueToFalse
  let { height, falseBlockOpacity, trueBlockOpacity } = useSpring({
    from,
    to,
    config: SPRING_CONFIG,
  })

  return (
    <animated.div style={{ height }} className="relative overflow-hidden">
      <animated.div
        ref={falseBlockRef}
        style={{ opacity: falseBlockOpacity }}
        className="absolute w-full"
      >
        {children(true)}
      </animated.div>
      <animated.div
        ref={trueBlockRef}
        style={{ opacity: trueBlockOpacity }}
        className="absolute w-full"
      >
        {children(false)}
      </animated.div>
    </animated.div>
  )
}
