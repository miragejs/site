import React from "react"

export default function() {
  let [activeServerTab, setActiveServerTab] = React.useState("Config")

  return (
    <div className="flex mt-16" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex flex-col w-1/2">
        <div className="z-0 flex flex-col shadow h-28">
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

        <div className="flex flex-col flex-1 h-0 overflow-y-auto bg-gray-100">
          {activeServerTab === "Config" && <p>Config</p>}

          {activeServerTab === "Database" && <p>Db</p>}
        </div>
      </div>
      <div className="flex flex-col w-1/2 border-l-4 border-gray-200">
        <div className="flex flex-col border-b h-1/2">
          <div className="flex flex-col h-28">
            <h2 className="mx-auto mt-6 text-xl font-medium text-gray-600">
              Client
            </h2>
            {/* <Tabs as |t|>
        <div className="px-4 py-3 mt-auto text-sm">
          <t.Tab>Request</t.Tab>
        </div>
      </Tabs> */}
          </div>
          {/* <Inspector::Request @server={{@server}}
      @onRequest={{this.handleRequest}}
      @onError={{this.handleError}}
    /> */}
        </div>
        <div className="bg-gray-100 h-1/2">
          {/* <Inspector::Response @server={{@server}}
      @isRequesting={{this.isRequesting}}
      @onHandle={{this.handleResponse}} /> */}
        </div>
      </div>
    </div>
  )
}
