import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import Spinner from "../assets/images/loading-spinner.svg"

let isEmailValid = function(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
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
  let [isShowingSpinner, setIsShowingSpinner] = useState(isRunning)
  let [buttonPadding, setButtonPadding] = useState(0)

  // this grabs the size of the spinner
  // we need to render at least once before we know what spinnerWidth
  // actually is. so we'll useLayoutEffect to  make the re-render sync
  // before the browser paints the button
  useLayoutEffect(() => {
    let spinnerSize = spinnerEl.current.offsetWidth
    setSpinnerWidth(spinnerSize)

    // if we started off in a running state we'll make our button
    // have the spinner padding
    if (isRunning) {
      setButtonPadding(spinnerSize)
    }
  }, [])

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

    // The declarative bit, yay?
    if (isRunning) {
      buttonPadding === 0
        ? setButtonPadding(spinnerWidth)
        : setIsShowingSpinner(true)
    } else {
      isShowingSpinner ? setIsShowingSpinner(false) : setButtonPadding(0)
    }
  }, [isRunning, spinnerWidth])

  let handleTransitionEnd = function(e) {
    setButtonPadding(isRunning ? spinnerWidth : 0)
    setIsShowingSpinner(isRunning)
  }

  return (
    <button
      disabled={isRunning}
      className={`p-3 md:px-6 ${
        buttonPadding > 0 ? "bg-green text-white" : "text-green"
      } relative mt-4 md:mt-0 w-full md:w-auto border-2 border-green rounded hover:bg-green hover:text-white focus:outline-none focus:outline-shadow`}
      style={{
        transition: shouldUseTransitions ? `all ${buttonExpandDuration}s` : "",
      }}
    >
      <div
        onTransitionEnd={e => handleTransitionEnd(e)}
        style={{
          paddingRight: buttonPadding,
          transition: shouldUseTransitions
            ? `padding ${buttonExpandDuration}s`
            : "",
        }}
      >
        {children}
      </div>
      <span
        ref={spinnerEl}
        onTransitionEnd={e => handleTransitionEnd(e)}
        className={`absolute m-3 pt-px right-0 top-0 ${
          isShowingSpinner ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: shouldUseTransitions
            ? `opacity ${spinnerOpacityDuration}s`
            : "",
        }}
      >
        <Spinner className="h-5 w-5 loading" />
      </span>
    </button>
  )
}

function SignupForm() {
  // configure
  let fadeOutInDelay = 0.4

  // state
  let convertKitUrl = "https://app.convertkit.com/forms/987317/subscriptions"
  let [email, setEmail] = useState("")
  let [error, _setError] = useState("")
  let [formState, setFormState] = useState("")
  let [isShowingThankYou, setIsShowingThankYou] = useState(false)
  let [thankYouHeight, setThankYouHeight] = useState(0)

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

  useEffect(() => {
    if (isError && error === "invalidEmail" && isEmailValid(email)) {
      // user corrected the invalid email, so lets reset the form state
      resetForm()
    }

    if (isError && error === "noEmail" && email) {
      // user started typing after submitting an empty form, lets reset the form state
      resetForm()
    }
  }, [isError, error, email])

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

        let feedbackDelay = new Promise(resolve => {
          setTimeout(resolve, 750)
        })

        let [response] = await Promise.all([postData, feedbackDelay])

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

  let handleTransitionEnd = function(e) {
    // not really sure how to best do this
    if (!isShowingThankYou && e.target.tagName === "FORM") {
      setIsShowingThankYou(true)
      setThankYouHeight(e.target.offsetHeight)
    }
  }

  let isAnimatingFormOut = didSignup && !isShowingThankYou

  return (
    <div className="relative">
      {didSignup && (
        <div
          className={`text-gray-500 ${isAnimatingFormOut ? "absolute" : ""} ${
            isShowingThankYou ? "opacity-100" : "opacity-0"
          }`}
          style={{
            height: `${thankYouHeight}px`,
            transition: `opacity ${fadeOutInDelay}s`,
          }}
        >
          Thanks <span className="text-gray-100">{email}</span>, you're all
          signed up!
        </div>
      )}

      {(!didSignup || isAnimatingFormOut) && (
        <form
          onSubmit={handleSubmit}
          action={convertKitUrl}
          method="post"
          className={didSignup ? "opacity-0" : "opacity-100"}
          style={{
            transition: `opacity ${fadeOutInDelay}s`,
          }}
          onTransitionEnd={e => handleTransitionEnd(e)}
        >
          <div className="md:flex">
            <input
              type="text"
              name="email_address"
              value={email}
              disabled={isSaving}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-gray-900 w-full md:max-w-sm mr-4 rounded px-5 py-3 border-2 border-transparent focus:outline-none focus:border-green"
            />
            <Button isRunning={didSignup || isSaving}>Get notified</Button>
          </div>
          {isError && (
            <div className="mt-5">
              {error === "serverError" &&
                "Yikes! It looks like there's something wrong with our signup form."}
              {error === "invalidEmail" &&
                "Opps! It looks like you've entered an invalid email."}
              {error === "noEmail" &&
                "Opps! It looks like you forgot to enter your email."}
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default SignupForm
