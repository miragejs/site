import React from "react"
import { graphql, useStaticQuery } from "gatsby"

export default function() {
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

  let startingInput = snippets["starting-input"]

  let [input, setInput] = React.useState(startingInput)
  let [logs, setLogs] = React.useState([])
  let [isLoaded, setIsLoaded] = React.useState(false)
  let [lastError, setLastError] = React.useState()
  let [lastRuntimeError, setLastRuntimeError] = React.useState()

  const handleMessage = ({ data }) => {
    if (data.fromRepl) {
      if (data.type === "error") {
        setLastError(data.message)
      } else if (data.type === "runtimeError") {
        setLastRuntimeError(data.message)
      } else if (data.type === "success") {
        setLastRuntimeError()
        setLastError()
      }

      if (data.type === "log") {
        setLogs(logs => [...logs, data.message])
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  })

  function handleInputChange(e) {
    setLastRuntimeError()
    setLastError()
    setLogs([])

    setInput(e.target.value)
  }

  // Splice in the Input into the iframe shell
  let shellLines = snippets["iframe-shell"].split("\n")
  let lineForApp = shellLines.findIndex(line => line.match("App.js"))
  shellLines.splice(lineForApp + 1, 0, ...input.split("\n"))
  let srcDoc = shellLines.join("\n")

  return (
    <div className="flex p-4 mt-16" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="w-1/2 h-full">
        <div className="flex flex-col h-full">
          <h1 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Editor
          </h1>
          <textarea
            className="w-full h-full p-3 mt-4 font-mono text-sm bg-gray-200 focus:outline-none"
            value={input}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
      <div className="w-1/2 h-full">
        <div className="flex flex-col px-4">
          <div style={{ height: "50vh" }}>
            <h1 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Output
            </h1>
            <iframe
              title="Output"
              sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
              onLoad={() => setIsLoaded(true)}
              srcDoc={srcDoc}
            ></iframe>

            <div className="mt-4" id="demo"></div>
          </div>
          <div style={{ height: "50vh" }}>
            <h1 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Console
            </h1>
            {lastError ? (
              <div className="px-4 py-3 mt-4 overflow-scroll text-sm font-medium text-white bg-red-600">
                <p className="uppercase">Error</p>
                <p className="mt-2">{lastError.message.split("\n")[0]}</p>
              </div>
            ) : lastRuntimeError ? (
              <div className="px-4 py-3 mt-4 overflow-scroll text-sm font-medium text-white bg-red-600">
                <p className="uppercase">Error</p>
                <p className="mt-2">
                  {lastRuntimeError.message.split("\n")[0]}
                </p>
              </div>
            ) : logs.length ? (
              <div className="py-3 mt-4 overflow-scroll text-sm">
                {logs.filter(Boolean).map((log, index) => {
                  // logs can be arrays
                  log = Array.isArray(log) ? log.join(" ") : log

                  return (
                    <p key={index} className="py-1 border-b">
                      {JSON.stringify(log, null, 2)}
                    </p>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
