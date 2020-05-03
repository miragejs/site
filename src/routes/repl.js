import React, { useState } from "react"
import * as Inspector from "../components/inspector"
import { useStaticQuery, graphql } from "gatsby"
import { useMachine } from "@xstate/react"
import { Machine, assign } from "xstate"
import { useQueryParam } from "../hooks/use-query-param"
import useMeasure from "react-use-measure"
import { ResizeObserver } from "@juggle/resize-observer"
import CodeEditor from "../components/code-editor"

const inspectorMachine = Machine(
  {
    id: "inspector",
    context: {
      iframeRef: null,
      error: null,
      errorHandlingRequest: null,
      db: {},
    },
    initial: "loading",
    states: {
      loading: {
        on: {
          SUCCESS: "running",
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
      running: {
        entry: ["clearError", "updateDatabase"],
        on: {
          CONFIG_CHANGE: "loading",
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
          CONFIG_CHANGE: "loading",
          REQUEST: "pendingRequest",
        },
      },
      failedRequest: {
        on: {
          CONFIG_CHANGE: "loading",
          REQUEST: "pendingRequest",
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
    },
  }
)

export default function () {
  let [queryParamConfig, setQueryParamConfig] = useQueryParam("config", {
    type: "binary",
  })
  let defaultConfig = useTutorialSnippet("starting-input")

  let iframeRef = React.useRef()
  let [inspectorState, send] = useMachine(inspectorMachine, {
    context: { iframeRef },
  })
  let [activeServerTab, setActiveServerTab] = React.useState("Config")
  let [activeResponseTab, setActiveResponseTab] = React.useState("JSON")
  let [localConfig, setLocalConfig] = useState(null)
  let [errorMessageRef, errorMessagebounds] = useMeasure({
    polyfill: ResizeObserver,
  })
  let configInput = queryParamConfig ?? localConfig ?? defaultConfig
  let configIsTooLargeForURL = localConfig !== null

  function handleConfigInputChange(newConfigInput) {
    send("CONFIG_CHANGE")

    if (btoa(newConfigInput).length < 2000) {
      setQueryParamConfig(newConfigInput)
      setLocalConfig(null)
    } else {
      setQueryParamConfig(null)
      setLocalConfig(newConfigInput)
    }
  }

  function handleMessage({ data }) {
    if (data.fromSandbox) {
      if (data.type === "mirage:db") {
        send("SUCCESS", { db: data.message })
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
        console.log("new message")
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

  React.useEffect(() => {
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  })

  // Splice in the Input into the iframe shell
  let shellLines = useTutorialSnippet("iframe-shell").split("\n")
  let lineForApp = shellLines.findIndex((line) => line.match("App.js"))
  shellLines.splice(lineForApp + 1, 0, ...configInput.split("\n"))
  let srcDoc = shellLines.join("\n")

  return (
    <div
      className="flex flex-col mt-16"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* This will be the title bar */}
      {/* <div className="flex items-center px-6 py-1 text-sm bg-gray-200">
        <p className="font-semibold text-gray-900">REPL</p>
        <button className="ml-5 text-gray-700">Share</button>
      </div> */}
      <div className="flex flex-col flex-1">
        <p className="px-6 py-2 text-xs font-medium text-gray-900 bg-yellow-400">
          <span className="font-semibold">Hello!</span> You've landed on the
          Mirage REPL, which is under active development. Please{" "}
          <a
            href="https://github.com/miragejs/site/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            report any bugs you find
          </a>
          .
        </p>
        <div className="flex flex-1">
          <div className="flex flex-col w-1/2">
            <div className="z-0 z-10 flex flex-col shadow h-28">
              <div className="flex items-center justify-between px-4 mt-6 md:px-6">
                <h2 className="text-gray-800 text-1-5xl">Server</h2>
                {inspectorState.value === "loading" && (
                  <p
                    className="text-xs font-medium text-gray-500 uppercase"
                    data-test-id="sandbox-loading"
                  >
                    Loading...
                  </p>
                )}
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
                  data-test-id="database"
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

            <div className="relative flex flex-col flex-1 h-0 overflow-y-auto">
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
                    data-test-id="config-input"
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

              {configIsTooLargeForURL && (
                <div
                  data-test-id="config-length-warning"
                  className="px-4 py-3 text-xs font-medium text-gray-900 bg-yellow-400"
                >
                  <p>
                    <span className="font-semibold">Warning: </span>Your config
                    is too long and won't be serialized in the URL.
                  </p>
                </div>
              )}

              {inspectorState.context.error && (
                <div
                  ref={errorMessageRef}
                  data-test-id="parse-error"
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
                  onRequest={(request) => send("REQUEST", request)}
                />

                <Inspector.Sandbox srcDoc={srcDoc} iframeRef={iframeRef} />
              </div>
            </div>
            <div className="overflow-y-auto bg-gray-100 h-1/2">
              <div className="bg-white py-2 px-4 md:px-6 shadow flex">
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
                  data-test-id="headers"
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

                {inspectorState.value === "handledRequest" && (
                  <span
                    data-test-id="response-code"
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
                {inspectorState.value === "pendingRequest" ? (
                  <p className="text-sm" data-test-id="request-pending">
                    Pending...
                  </p>
                ) : inspectorState.value === "handledRequest" ? (
                  <pre className="text-sm-" data-test-id="response-body">
                    {JSON.stringify(
                      inspectorState.context.response.data,
                      null,
                      2
                    )}
                  </pre>
                ) : inspectorState.value === "failedRequest" ? (
                  <div>
                    <p>The REPL threw an error.</p>
                    <p className="pt-2 text-red-600 font-medium">
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
