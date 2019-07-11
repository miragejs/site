import React, { useEffect, useState } from "react"

export default function TodoApp() {
  let [isLoading, setIsLoading] = useState(true)
  let [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("/api/todos")
      .then(response => response.json())
      .then(json => {
        setTodos(json)
        setIsLoading(false)
      })
  }, [])

  function saveTodo() {}

  return (
    <div className="rounded shadow-lg pt-3 pb-6 px-5 bg-white">
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-gray-900">My todos</p>
        <button className="text-sm uppercase px-2 text-gray-500">
          Reset app
        </button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {todos.map(todo => (
              <li key={todo.id} className="mt-1">
                <label>
                  <input type="checkbox" className="mr-2" />
                  {todo.text}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <form onSubmit={saveTodo}>
          <input type="text" placeholder="Enter a todo" className="ml-6" />
        </form>
      </div>
    </div>
  )
}
