import React, { useState } from "react"
import { ReactComponent as Replay } from "../assets/images/replay.svg"
import TodoApp from "./todo-app"
import { makeServer } from "../server"
import { addPersist, resetDb } from "../lib/persist"

export const server = makeServer()
addPersist(server)

export default function TodoAppWithReset() {
  let [refresh, setRefresh] = useState(0)

  function resetApp() {
    if (server) {
      resetDb(server)
      setRefresh(refresh + 1)
    }
  }

  return (
    <div className="my-12 lg:my-16">
      <TodoApp refresh={refresh} />
      <div className="mt-4">
        <button
          onClick={resetApp}
          className="flex items-center px-3 py-2 mx-auto text-sm text-blue-500 md:text-base focus:outline-none hover:underline"
        >
          Reset app
          <Replay className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}
