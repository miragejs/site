import React, { useState, useEffect } from "react"
import Button from "./button"

let isEmailValid = function(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

function SignupForm() {
  // configure
  let fadeOutInDelay = 0.4
  let feedbackDelay = 900

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
          className={`text-lg text-gray-8 ${
            isAnimatingFormOut ? "absolute" : ""
          } ${isShowingThankYou ? "opacity-100" : "opacity-0"}`}
          style={{
            height: `${thankYouHeight}px`,
            transition: `opacity ${fadeOutInDelay}s`,
          }}
        >
          Thanks <span className="text-white">{email}</span>, you're all signed
          up!
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
          <div className="md:flex md:justify-center">
            <input
              type="email"
              required
              name="email_address"
              value={email}
              disabled={isSaving}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input bg-white text-gray-600 w-full md:max-w-sm rounded px-5 py-3 border-2 border-transparent focus:shadow-none focus:border-green md:border-r-0 md:rounded-r-none"
            />
            <Button isRunning={didSignup || isSaving}>Get notified</Button>
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
      )}
    </div>
  )
}

export default SignupForm
