/*
  Todo:
    - Save button
    - Status (you have unsaved changes)
*/

import React, { useState, useEffect } from "react"
import * as Inspector from "../components/inspector"
import { useStaticQuery, graphql } from "gatsby"
import { useMachine } from "@xstate/react"
import { Machine, assign } from "xstate"
import useMeasure from "react-use-measure"
import { ResizeObserver } from "@juggle/resize-observer"
import CodeEditor from "../components/code-editor"
import { useMutation } from "urql"
import queryString from "query-string"
import { useDebounce } from "use-debounce"
import { escapeBackticks } from "../utils"
import { nanoid, customAlphabet } from "nanoid"

const shortNanoid = customAlphabet("1234567890abcdef", 10)

const inspectorMachine = Machine(
  {
    id: "inspector",
    context: {
      iframeRef: null,
      error: null,
      errorHandlingRequest: null,
      db: {},
      revision: 0,
    },
    initial: "loading",
    states: {
      loading: {
        entry: ["newRevision"],
        on: {
          CONFIG_CHANGE: "loading",
          SUCCESS: "ready",
          ERROR: {
            target: "error",
            actions: assign({
              error: (context, event) => event.message,
            }),
          },
        },
      },
      error: {
        on: {
          CONFIG_CHANGE: "loading",
        },
      },
      ready: {
        entry: ["clearError", "updateDatabase"],
        on: {
          CONFIG_CHANGE: "loading",
        },
        initial: "idle",
        states: {
          idle: {
            on: {
              REQUEST: "pendingRequest",
            },
          },
          pendingRequest: {
            entry: "makeRequest",
            on: {
              RESPONSE: {
                target: "handledRequest",
                actions: ["updateResponse", "updateDatabase"],
              },
              ERROR: {
                target: "failedRequest",
                actions: assign({
                  errorHandlingRequest: (context, event) => event.message,
                }),
              },
            },
          },
          handledRequest: {
            on: {
              REQUEST: "pendingRequest",
            },
          },
          failedRequest: {
            on: {
              REQUEST: "pendingRequest",
            },
          },
        },
      },
    },
  },
  {
    actions: {
      makeRequest(context, { method, url, body }) {
        context.iframeRef.current.contentWindow.postMessage(
          {
            fromInspector: true,
            type: "mirage:request",
            message: {
              method,
              url,
              body: body ? JSON.stringify(body) : undefined,
            },
          },
          "*"
        )
      },
      updateResponse: assign({
        response: (context, event) => event.response,
      }),
      updateDatabase: assign({
        db: (context, event) => event.db,
      }),
      clearError: assign({
        error: null,
      }),
      log(context, event) {
        console.log({ context }, { event })
      },
      newRevision: assign({
        revision: (context) => context.revision + 1,
      }),
    },
  }
)

function useDefaultSandbox() {
  let defaultConfig = useTutorialSnippet("starting-input")

  return {
    configInput: defaultConfig,
    method: "GET",
    url: "/api/movies",
    requestBody: "",
  }
}

function useQueryParamsSandbox(queryParams) {
  let defaultConfig = useTutorialSnippet("starting-input")

  return {
    configInput: queryParams.config ? atob(queryParams.config) : defaultConfig,
    method: queryParams.method,
    url: queryParams.url || "",
    requestBody: queryParams.body,
  }
}

export default function ({ location, navigate }) {
  let queryParams = queryString.parse(location.search) ?? {}
  let source =
    queryParams.config ||
    queryParams.method ||
    queryParams.url ||
    queryParams.body
      ? "queryParams"
      : "default"

  let defaultSandbox = useDefaultSandbox()
  let queryParamsSandbox = useQueryParamsSandbox(queryParams)
  let sandboxSources = {
    default: defaultSandbox,
    queryParams: queryParamsSandbox,
  }

  let [configInput, setConfigInput] = useState(
    sandboxSources[source].configInput
  )
  let [method, setMethod] = useState(sandboxSources[source].method)
  let [url, setUrl] = useState(sandboxSources[source].url)
  let [requestBody, setRequestBody] = useState(
    sandboxSources[source].requestBody
  )

  // And if there are query params, navigate to root /repl
  useEffect(() => {
    if (location.search) {
      navigate("/repl")
    }
  })

  let iframeRef = React.useRef()
  let [inspectorState, send] = useMachine(inspectorMachine, {
    context: { iframeRef },
  })
  let [activeServerTab, setActiveServerTab] = React.useState("Config")
  let [activeResponseTab, setActiveResponseTab] = React.useState("JSON")
  let [errorMessageRef, errorMessagebounds] = useMeasure({
    polyfill: ResizeObserver,
  })

  function handleConfigInputChange(newConfigInput) {
    send("CONFIG_CHANGE")
    setConfigInput(newConfigInput)
  }

  function handleMessage({ data }) {
    if (data.fromSandbox) {
      let isValidMessage = data.revision === inspectorState.context.revision
      if (!isValidMessage) {
        // ignore stale message
      } else if (data.type === "mirage:db") {
        send("SUCCESS", { db: data.message.db })
      } else if (data.type === "mirage:response") {
        send("RESPONSE", {
          response: data.message.response,
          db: data.message.db,
        })
      } else if (data.type === "mirage:parse-error") {
        send("ERROR", {
          message: data.message.toString(),
        })
      } else if (data.type === "mirage:runtime-error") {
        send("ERROR", {
          message: data.message.toString(),
        })
      } else if (data.type === "mirage:unhandled-rejection") {
        send("ERROR", {
          message: data.message.message,
        })
      } else {
        // UNHANDLED MESSAGE
        console.log(
          `Unhandled REPL message (current state: ${inspectorState.value}): `
        )
        console.log({ data })

        // setSandboxIsReady(true)
        // setParseError(data.message.toString())
        // } else if (data.type === "runtimeError") {
        // setLastRuntimeError(data.message)
        // } else if (data.type === "success") {
        // setLastRuntimeError()
        // setLastError()
        // }
        // if (data.type === "log") {
        // setLogs(logs => [...logs, data.message])
        // }
        // } else {
        //   console.log("other message: ", data)
      }
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  })

  let shellLines = useTutorialSnippet("iframe-shell").split("\n")

  // Splice in the revision into the iframe shell
  let lineForRevision = shellLines.findIndex((line) =>
    line.match("const revision = 1")
  )
  shellLines[
    lineForRevision
  ] = `const revision = ${inspectorState.context.revision}`

  // Splice in the Input into the iframe shell
  let lineForApp = shellLines.findIndex((line) => line.match("App.js"))
  let escapedConfigInput = escapeBackticks(configInput)
  shellLines.splice(lineForApp + 1, 0, ...escapedConfigInput.split("\n"))
  let srcDoc = shellLines.join("\n")
  const [debouncedSrcDoc] = useDebounce(srcDoc, 225)

  const CreateSandbox = `
    mutation ($object: sandboxes_insert_input!) {
      insert_sandboxes_one(object: $object) {
        id2
      }
    }
  `
  const [, createSandbox] = useMutation(CreateSandbox)

  function handleCreateSandbox() {
    let editingToken = nanoid()
    let browserId = shortNanoid()

    localStorage.setItem("repl:editingToken", editingToken)
    localStorage.setItem("repl:browserId", browserId)

    let attrs = {
      id2: shortNanoid(),
      editing_token: editingToken,
      browser_id: browserId,
      config: configInput,
      method,
      url,
      request_body: requestBody,
    }

    createSandbox({ object: attrs }).then((res) => {
      let id2 = res.data.insert_sandboxes_one.id2
      navigate(`/repl/v2/${id2}`)
    })
  }

  let defaultConfig = useTutorialSnippet("starting-input")
  let hasEditedDefaultConfig = configInput !== defaultConfig

  return (
    <div
      className="flex flex-col mt-16"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="flex items-center px-6 py-1 text-sm bg-gray-100 border-t border-b border-gray-300">
        <p className="font-medium tracking-wide text-gray-500">REPL</p>
        <div className="flex items-center ml-6 space-x-1">
          <button
            className="px-3 py-1 text-gray-800 rounded hover:bg-gray-200"
            data-testid="save"
            onClick={handleCreateSandbox}
          >
            Save
          </button>
          {hasEditedDefaultConfig && (
            <p data-testid="status" className="pl-4 text-xs text-gray-500">
              You have unsaved changes.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col w-1/2 min-h-0">
            <div className="z-10 flex flex-col shadow h-28">
              <div className="flex items-center justify-between px-4 mt-6 md:px-6">
                <h2 className="text-gray-800 text-1-5xl">Server</h2>
                {inspectorState.matches("loading") ? (
                  <p
                    className="text-xs font-medium text-gray-500 uppercase"
                    data-testid="sandbox-loading"
                  >
                    Loading...
                  </p>
                ) : inspectorState.matches("ready") ? (
                  <p data-testid="sandbox-ready">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </p>
                ) : inspectorState.matches("error") ? (
                  <p data-testid="sandbox-error">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </p>
                ) : null}
              </div>

              <div className="px-4 py-3 mt-auto text-sm md:px-6">
                <button
                  onClick={() => setActiveServerTab("Config")}
                  className={`mr-4 text-sm font-medium focus:outline-none
                    ${
                      activeServerTab === "Config"
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                    }
                    `}
                >
                  Config
                </button>
                <button
                  onClick={() => setActiveServerTab("Database")}
                  data-testid="database"
                  className={`mr-4 text-sm font-medium focus:outline-none
                    ${
                      activeServerTab === "Database"
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                    }
                    `}
                >
                  Database
                </button>
              </div>
            </div>

            <div className="relative flex flex-col flex-1 min-h-0 overflow-y-auto">
              {activeServerTab === "Config" && (
                <div
                  className="flex-1 p-4 overflow-y-auto md:px-5"
                  style={{
                    paddingBottom: inspectorState.context.error
                      ? `${errorMessagebounds.height}px`
                      : null,
                  }}
                >
                  <CodeEditor
                    data-testid="config-input"
                    value={configInput}
                    onChange={handleConfigInputChange}
                  />
                </div>
              )}

              <div
                className={`h-full flex flex-col ${
                  activeServerTab !== "Database" ? "hidden" : null
                }`}
              >
                <Inspector.Database db={inspectorState.context.db} />
              </div>

              {inspectorState.matches("error") && (
                <div
                  ref={errorMessageRef}
                  data-testid="parse-error"
                  className="absolute inset-x-0 bottom-0 z-10 px-4 py-3 text-xs font-medium text-white bg-red-600"
                >
                  <pre className="whitespace-pre-wrap">
                    {inspectorState.context.error}
                  </pre>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-1/2 border-l-4 border-gray-200">
            <div className="flex flex-col border-b h-1/2">
              <div className="relative z-10 flex flex-col shadow h-28">
                <h2 className="px-4 mt-6 text-gray-800 text-1-5xl md:px-6">
                  Client
                </h2>
                <div className="px-4 py-3 mt-auto text-sm md:px-6">
                  <button className="mr-4 text-sm font-medium text-gray-800 focus:outline-none">
                    Request
                  </button>
                  <button className="hidden mr-4 text-sm font-medium text-gray-700 focus:outline-none">
                    UI
                  </button>
                </div>
              </div>
              <div className="relative z-0 flex-1 bg-gray-100">
                <Inspector.Request
                  method={method}
                  setMethod={setMethod}
                  url={url}
                  setUrl={setUrl}
                  requestBody={requestBody}
                  setRequestBody={setRequestBody}
                  onRequest={(request) => send("REQUEST", request)}
                />

                <Inspector.Sandbox
                  srcDoc={debouncedSrcDoc}
                  iframeRef={iframeRef}
                />
              </div>
            </div>
            <div className="overflow-y-auto bg-gray-100 h-1/2">
              <div className="flex px-4 py-2 bg-white shadow md:px-6">
                <button
                  onClick={() => setActiveResponseTab("JSON")}
                  className={`mr-4 text-sm font-medium focus:outline-none
                    ${
                      activeResponseTab === "JSON"
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                    }
                    `}
                >
                  JSON
                </button>
                {/* <button
                  onClick={() => setActiveResponseTab("Headers")}
                  data-testid="headers"
                  className={`mr-4 text-sm font-medium focus:outline-none
                    ${
                      activeResponseTab === "Headers"
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                    }
                    `}
                >
                  Headers
                </button> */}

                {inspectorState.matches("ready.handledRequest") && (
                  <span
                    data-testid="response-code"
                    className={`ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium leading-none 
                    ${
                      inspectorState.context.response.code
                        .toString()
                        .startsWith(2)
                        ? "bg-green-100 text-green-900"
                        : inspectorState.context.response.code
                            .toString()
                            .startsWith(3)
                        ? "bg-green-100 text-green-900"
                        : inspectorState.context.response.code
                            .toString()
                            .startsWith(4)
                        ? "bg-red-100 text-red-900"
                        : inspectorState.context.response.code
                            .toString()
                            .startsWith(5)
                        ? "bg-red-100 text-red-900"
                        : ""
                    }
                    `}
                  >
                    {inspectorState.context.response.code}
                  </span>
                )}
              </div>

              <div className="p-4 md:px-6">
                {inspectorState.matches("ready.pendingRequest") ? (
                  <p className="text-sm" data-testid="request-pending">
                    Pending...
                  </p>
                ) : inspectorState.matches("ready.handledRequest") ? (
                  <pre className="text-sm-" data-testid="response-body">
                    {JSON.stringify(
                      inspectorState.context.response.data,
                      null,
                      2
                    )}
                  </pre>
                ) : inspectorState.matches("ready.failedRequest") ? (
                  <div>
                    <p>The REPL threw an error.</p>
                    <p className="pt-2 font-medium text-red-600">
                      {inspectorState.context.errorHandlingRequest}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function useTutorialSnippet(name) {
  const data = useStaticQuery(graphql`
    query {
      allFile(
        filter: { absolutePath: { regex: "/tutorial-assets/snippets/" } }
      ) {
        nodes {
          name
          fields {
            content
          }
        }
      }
    }
  `)
  let snippets = data.allFile.nodes.reduce((memo, node) => {
    let [, ...lines] = node.fields.content.split("\n")
    let indexClosingTicks = lines.indexOf("```")
    lines = lines.filter((line, index) => index < indexClosingTicks)

    memo[node.name] = lines.join("\n")

    return memo
  }, {})

  return snippets[name]
}
