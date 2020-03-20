import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import "codemirror/lib/codemirror.css"
import CodeMirror from "codemirror"
import "codemirror/mode/javascript/javascript"

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

  let [db, setDb] = React.useState({})
  let [input, setInput] = React.useState(startingInput)
  let [logs, setLogs] = React.useState([])
  let [lastError, setLastError] = React.useState()
  let [lastRuntimeError, setLastRuntimeError] = React.useState()

  const handleMessage = ({ data }) => {
    if (data.fromRepl) {
      if (data.type === "mirage:db") {
        setDb(data.message)
      } else if (data.type === "error") {
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

  let textareaRef = React.useRef()
  React.useEffect(() => {
    let cm = CodeMirror.fromTextArea(textareaRef.current, {
      // value: input,
      // lineNumbers: true,
      mode: "javascript",
    })
    cm.on("change", cm => {
      handleInputChange(cm.getValue())
    })

    return () => {
      cm.toTextArea()
    }
  }, [])

  function handleInputChange(value) {
    setLastRuntimeError()
    setLastError()
    setLogs([])

    setInput(value)
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
            readOnly
            value={input}
            className="w-full h-full p-3 mt-4 font-mono text-sm bg-gray-200 focus:outline-none"
            ref={textareaRef}
          ></textarea>
          <div className="mt-4">
            {Object.keys(db).map(table => (
              <>
                <p key={table}>table: {table}</p>
                <div>
                  {db[table].map(row => (
                    <>
                      {Object.keys(row).map(field => (
                        <p>
                          {field}: {row[field]}
                        </p>
                      ))}
                    </>
                  ))}
                </div>
              </>
            ))}
          </div>
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
