import React, { useState } from "react"
import Replay from "../assets/images/replay.svg"
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
          className="text-sm md:text-base text-blue-500 focus:outline-none px-3 py-2 mx-auto flex items-center hover:underline"
        >
          Reset app
          <Replay className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
