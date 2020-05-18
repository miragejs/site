/* eslint-disable no-eval */
import React, { useState } from "react"
import { useQueryParam } from "../../hooks/use-query-param"
import CodeEditor from "../code-editor"

export default function ({ onRequest }) {
  let [method, setMethod] = useQueryParam("method", { initialValue: "GET" })
  let [url, setUrl] = useQueryParam("url")
  let [body, setBody] = useQueryParam("body")
  let [urlIsValid, setUrlIsValid] = useState(true)

  function handleUrlChange(e) {
    setUrlIsValid(true)
    setUrl(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    submit()
  }

  function submit() {
    if (!url) {
      setUrlIsValid(false)
      return
    }

    let parsedBody
    if (method !== "GET" && body) {
      try {
        parsedBody = eval("(" + body + ")")
      } catch (error) {
        console.warn("The request body could not be parsed")
      }
    }

    onRequest({
      method,
      url,
      body: parsedBody,
    })
  }

  return (
    <div className="h-full p-4 md:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                aria-label="Method"
                data-testid="request-method"
                className="h-full py-0 pl-3 text-gray-600 bg-transparent border-transparent rounded-md form-select pr-7 sm:text-sm sm:leading-5"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <input
              value={url ?? ""}
              onChange={handleUrlChange}
              className={`block w-full transition duration-150 ease-in-out rounded-none pl-26 form-input rounded-l-md sm:text-sm sm:leading-5
                ${urlIsValid ? "border-gray-300" : null}
                ${
                  !urlIsValid
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : null
                }
                `}
              placeholder="e.g. /users"
              data-testid="request-url"
            />
          </div>
          <button
            className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out border border-gray-300 rounded-r-md bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline focus:border-blue-300 active:bg-gray-100 active:text-gray-500"
            type="submit"
            data-testid="send-request"
          >
            <span className="px-1">Send</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M13.5956 10.774L7.23294 14.8757C6.69297 15.2234 6 14.8023 6 14.1013V5.89804C6 5.19814 6.69197 4.77597 7.23294 5.12481L13.5956 9.22646C13.7185 9.30436 13.8206 9.41697 13.8916 9.55287C13.9626 9.68876 14 9.8431 14 10.0002C14 10.1574 13.9626 10.3117 13.8916 10.4476C13.8206 10.5835 13.7185 10.6961 13.5956 10.774V10.774Z"></path>
            </svg>
          </button>
        </div>
        {!urlIsValid && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            The URL cannot be blank.
          </p>
        )}
        {method !== "GET" && (
          <>
            <label className="mt-4 text-sm text-gray-600">Request body</label>
            <div className="relative flex-1 p-3 mt-1 overflow-hidden bg-white border border-gray-300 rounded-md shadow-sm">
              <CodeEditor
                data-testid="request-body-input"
                value={body}
                onChange={setBody}
                extraKeys={{
                  "Cmd-Enter": submit,
                }}
              />
              <span className="absolute bottom-0 right-0 pb-2 pr-3 text-xs text-gray-400 pointer-events-none">
                Cmd+Enter to Send
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
