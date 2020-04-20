import React, { useState } from "react"
import * as Inspector from "../components/inspector"
import { useStaticQuery, graphql } from "gatsby"
import { useMachine } from "@xstate/react"
import { Machine, assign } from "xstate"
import queryString from "query-string"

const inspectorMachine = Machine(
  {
    id: "inspector",
    context: {
      error: null,
    },
    initial: "loading",
    states: {
      loading: {
        on: {
          READY: "running",
          ERROR: {
            target: "error",
            actions: assign({
              error: (context, event) => event.message,
            }),
          },
        },
      },
      running: {
        on: {
          CONFIG_CHANGE: "loading",
        },
      },
      error: {
        exit: "clearError",
        on: {
          CONFIG_CHANGE: "loading",
        },
      },
    },
  },
  {
    actions: {
      clearError: assign({
        error: null,
      }),
    },
  }
)

export default function ({ location, navigate }) {
  let queryParams = queryString.parse(location.search) ?? {}
  let configFromQueryParam = queryParams?.config
    ? atob(queryParams.config)
    : null
  let defaultStartingConfig = useTutorialSnippet("starting-input")

  let [currentInspectorState, send] = useMachine(inspectorMachine)
  let [activeServerTab, setActiveServerTab] = React.useState("Config")
  let [db, setDb] = React.useState({})
  let [response, setResponse] = React.useState({})
  let [localConfigInput, setLocalConfigInput] = useState()
  let [urlOverage, setUrlOverage] = useState(null)
  let configInput =
    configFromQueryParam ?? localConfigInput ?? defaultStartingConfig

  function handleConfigInputChange(newConfigInput) {
    send("CONFIG_CHANGE")
    queryParams.config = btoa(newConfigInput)
    let url = `/repl/?${queryString.stringify(queryParams)}`

    if (url.length > 2000) {
      setLocalConfigInput(newConfigInput)
      setUrlOverage(url.length - 2000)

      navigate("/repl", { replace: true })
    } else {
      setUrlOverage(null)
      navigate(url, { replace: true })
    }
  }

  function handleMessage({ data }) {
    if (data.fromSandbox) {
      if (data.type === "mirage:db") {
        setDb(data.message)
        send("READY")
      } else if (data.type === "mirage:response") {
        console.log("handing response")

        setResponse(data.message)

        // } else if (data.type === "error") {
        // setLastError(data.message)
      } else if (data.type === "mirage:parse-error") {
        send({
          type: "ERROR",
          message: data.message.toString(),
        })
      } else if (data.type === "mirage:runtime-error") {
        send({
          type: "ERROR",
          message: data.message.toString(),
        })
      } else {
        console.log("new message")
        console.log(data.message)

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

  let iframeRef = React.useRef()
  function handleRequest(method, url) {
    console.log({ method, url })

    iframeRef.current.contentWindow.postMessage(
      { fromInspector: true, type: "mirage:request", message: { method, url } },
      "*"
    )
  }

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
        <p className="px-6 py-1 text-sm text-white text-yellow-800 bg-yellow-200">
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
                {currentInspectorState.value === "loading" && (
                  <p
                    className="text-xs font-medium text-gray-500 uppercase"
                    data-testid="sandbox-loading"
                  >
                    Loading...
                  </p>
                )}
              </div>

              <div className="px-4 py-3 mt-auto text-sm md:px-6">
                {["Config", "Database"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveServerTab(tab)}
                    className={`mr-4 text-sm font-medium focus:outline-none
                    ${
                      tab === activeServerTab
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                    }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col flex-1 h-0 overflow-y-auto">
              {activeServerTab === "Config" && (
                <Inspector.ConfigEditor
                  value={configInput}
                  onChange={handleConfigInputChange}
                />
              )}

              <div
                className={`h-full flex flex-col ${
                  activeServerTab !== "Database" ? "hidden" : null
                }`}
              >
                <Inspector.Database db={db} />
              </div>

              {urlOverage && (
                <div
                  data-testid="config-length-warning"
                  className="px-4 py-3 text-xs font-medium text-gray-900 bg-yellow-400"
                >
                  <p>
                    <span className="font-semibold">Warning: </span>Your config
                    is too long and won't be serialized in the URL.
                  </p>
                </div>
              )}

              {currentInspectorState.value === "error" && (
                <div
                  data-testid="parse-error"
                  className="px-4 py-3 text-xs font-medium text-white bg-red-600"
                >
                  <pre>{currentInspectorState.context.error}</pre>
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
                  <button className="mr-4 text-sm font-medium text-gray-700 focus:outline-none">
                    Request
                  </button>
                  <button className="hidden mr-4 text-sm font-medium text-gray-700 focus:outline-none">
                    UI
                  </button>
                </div>
              </div>
              <div className="relative z-0 flex-1 bg-gray-100">
                <Inspector.Request onRequest={handleRequest} />
                <Inspector.Sandbox srcDoc={srcDoc} iframeRef={iframeRef} />
              </div>
            </div>
            <div className="p-4 overflow-y-auto bg-gray-100 md:px-6 h-1/2">
              <h2>
                Status code:{" "}
                <span data-testid="response-code">{response.code}</span>
              </h2>

              <pre className="mt-4 text-sm" data-testid="response-body">
                {JSON.stringify(response.data, null, 2)}
              </pre>
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
