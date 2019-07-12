import React, { useState } from "react"

function SignupForm() {
  let convertKitUrl = "https://app.convertkit.com/forms/987317/subscriptions"
  let [email, setEmail] = useState("")
  let [formState, setFormState] = useState("")

  let isSaving = formState === "saving"
  let didError = formState === "error"
  let didSignup = formState === "finished"

  let handleSubmit = async function(event) {
    event.preventDefault()
    if (!email) {
      setFormState("error")
    } else {
      setFormState("saving")

      let formData = new FormData(event.target)

      try {
        let response = await fetch(convertKitUrl, {
          method: "POST",
          body: formData,
        })

        let state = response.ok ? "finished" : "error"
        setFormState(state)
      } catch (e) {
        console.error(e)
        setFormState("error")
      }
    }
  }

  return (
    <div>
      {didSignup ? (
        <div className="text-gray-500 mt-4">
          Thanks <span className="text-gray-100">{email}</span>, you're all
          signed up!
        </div>
      ) : (
        <form onSubmit={handleSubmit} action={convertKitUrl} method="post">
          <div className="md:flex">
            <input
              type="text"
              name="email_address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-gray-900 w-full md:max-w-sm mr-4 rounded px-5 py-3 border-2 border-transparent focus:outline-none focus:border-green"
            />
            <button
              disabled={isSaving && "disabled"}
              className="mt-4 md:mt-0 w-full md:w-auto border-2 border-green p-3 md:px-6 rounded text-green hover:bg-green hover:text-white focus:outline-none focus:outline-shadow"
            >
              Get notified
            </button>
          </div>
          {didError && (
            <div className="mt-5">
              Yikes! It looks like there's something wrong with our signup form.
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default SignupForm
