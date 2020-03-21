import React from "react"
import * as Inspector from "../components/inspector"
import { useStaticQuery, graphql } from "gatsby"

export default function() {
  let [activeServerTab, setActiveServerTab] = React.useState("Database")
  let [configInput, setConfigInput] = React.useState(
    useTutorialSnippet("starting-input")
  )
  let [db, setDb] = React.useState({})

  function handleConfigInputChange(newConfigInput) {
    // clear errors
    setConfigInput(newConfigInput)
  }

  function handleMessage({ data }) {
    if (data.fromRepl) {
      if (data.type === "mirage:db") {
        setDb(data.message)
      } else if (data.type === "error") {
        // setLastError(data.message)
      } else if (data.type === "runtimeError") {
        // setLastRuntimeError(data.message)
      } else if (data.type === "success") {
        // setLastRuntimeError()
        // setLastError()
      }

      if (data.type === "log") {
        // setLogs(logs => [...logs, data.message])
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  })

  // Splice in the Input into the iframe shell
  let shellLines = useTutorialSnippet("iframe-shell").split("\n")
  let lineForApp = shellLines.findIndex(line => line.match("App.js"))
  shellLines.splice(lineForApp + 1, 0, ...configInput.split("\n"))
  let srcDoc = shellLines.join("\n")

  return (
    <div className="flex mt-16" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex flex-col w-1/2">
        <div className="z-0 z-10 flex flex-col shadow h-28">
          <h2 className="mx-auto mt-6 text-xl font-medium text-gray-600">
            Server
          </h2>

          <div className="px-4 py-3 mt-auto text-sm">
            {["Config", "Database"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveServerTab(tab)}
                className={`mr-4 text-sm font-medium focus:outline-none
                ${
                  tab === activeServerTab
                    ? "text-gray-700"
                    : "text-gray-400 hover:text-gray-900"
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
        </div>
      </div>
      <div className="flex flex-col w-1/2 border-l-4 border-gray-200">
        <div className="flex flex-col border-b h-1/2">
          <div className="flex flex-col shadow h-28">
            <h2 className="mx-auto mt-6 text-xl font-medium text-gray-600">
              Client
            </h2>
            <div className="px-4 py-3 mt-auto text-sm">
              <button className="mr-4 text-sm font-medium text-gray-700 focus:outline-none">
                Request
              </button>
              <button className="hidden mr-4 text-sm font-medium text-gray-700 focus:outline-none">
                UI
              </button>
            </div>
          </div>
          <div>
            <div className="p-4">Request maker</div>
            <Inspector.Sandbox srcDoc={srcDoc} />
          </div>
        </div>
        <div className="bg-gray-100 h-1/2">Response panel</div>
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
