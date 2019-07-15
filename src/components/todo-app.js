import React, { useEffect, useState, useRef } from "react"

export default function TodoApp() {
  let [isLoading, setIsLoading] = useState(true)
  let [todos, setTodos] = useState([])
  let [isShowingNewTodo, setIsShowingNewTodo] = useState(false)
  let newTodoInputRef = useRef(null)

  useEffect(() => {
    fetch("/api/todos")
      .then(response => response.json())
      .then(json => {
        setTodos(json)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus()
    }
  }, [isShowingNewTodo])

  function saveTodo(e) {
    e.preventDefault()
    console.log("saving")
  }

  return (
    <div className="rounded shadow-lg pt-3 pb-6 px-5 bg-gray-50 border-t-4 border-green text-lg text-gray-600">
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-gray-700">Todos</p>
      </div>

      {isShowingNewTodo && (
        <form
          className="block bg-white mt-4 -mx-5 text-gray-900 flex items-center shadow px-5"
          onSubmit={saveTodo}
        >
          <input type="checkbox" disabled className="mr-2 form-checkbox" />
          <input
            type="text"
            ref={newTodoInputRef}
            placeholder="New Todo"
            className="block w-full py-2 focus:outline-none"
          />
        </form>
      )}

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {todos.map(todo => (
              <li key={todo.id} className="mt-1">
                <label className="block flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox mr-3 border-gray-100 text-green"
                  />
                  {todo.text}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsShowingNewTodo(true)}
          className="ml-auto focus:outline-none bg-green rounded-full text-white w-10 h-10 shadow-lg text-4xl font-light flex items-center justify-center leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}
