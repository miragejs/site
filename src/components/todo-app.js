import React, { useEffect, useState } from "react"

export default function TodoApp() {
  let [todos, setTodos] = useState([])
  useEffect(() => {
    fetch("/api/todos")
      .then(response => response.json())
      .then(json => setTodos(json))
  })

  return (
    <div className="rounded shadow-lg pt-3 pb-6 px-4 bg-white">
      <p className="text-2xl font-bold text-gray-900">Todos</p>

      <div className="mt-4">
        <ul>
          <li>
            <label>
              <input type="checkbox" className="mr-2" />
              Play with Legos
            </label>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <input type="text" placeholder="Enter a todo" className="ml-6" />
      </div>
    </div>
  )
}
