import React, { useEffect, useState, useRef } from "react"
import Spinner from "./spinner"

export default function TodoApp() {
  let [isLoading, setIsLoading] = useState(true)
  let [todos, setTodos] = useState([])
  let [newTodo, setNewTodo] = useState(null)
  let [isShowingNewTodo, setIsShowingNewTodo] = useState(false)

  useEffect(() => {
    fetch("/api/todos")
      .then(response => response.json())
      .then(json => {
        setTodos(json)
        setIsLoading(false)
      })
  }, [])

  function addTodo(todo) {
    setNewTodo(null)
    setTodos([todo, ...todos])
  }

  function updateTodo(todo) {
    setTodos([
      ...todos.map(globalTodo =>
        globalTodo.id === todo.id ? todo : globalTodo
      ),
    ])
  }

  return (
    <div className="rounded-lg shadow-black pt-3 pb-6 px-5 bg-gray-800 border-t-8 border-green text-lg text-white">
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-gray-50">Todos</p>
        <p className="text-2xl font-bold text-gray-50">{todos.length}</p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {newTodo && (
              <TodoItem todo={newTodo} didCreate={addTodo} autofocus={true} />
            )}

            {todos.map(todo => (
              <TodoItem todo={todo} didSave={updateTodo} key={todo.id} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setNewTodo({ text: "" })}
          className="ml-auto focus:outline-none bg-green rounded-full text-white w-10 h-10 shadow-lg text-4xl font-light flex items-center justify-center leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

function TodoItem({ todo, didCreate, didSave, autofocus }) {
  let inputRef = useRef(null)
  let [text, setText] = useState(todo.text)
  let [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (inputRef.current && autofocus) {
      inputRef.current.focus()
    }
  }, [autofocus])

  function handleSubmit(e) {
    e.preventDefault()

    if (!todo.id) {
      createTodo()
    } else if (todo.text !== text) {
      saveTodo()
    }
  }

  function createTodo() {
    setIsSaving(true)
    todo.text = text

    fetch(`/api/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
    })
      .then(res => res.json())
      .then(todo => {
        setIsSaving(false)
        didCreate(todo)
      })
  }

  function saveTodo() {
    setIsSaving(true)
    todo.text = text

    fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify(todo),
    })
      .then(res => res.json())
      .then(todo => {
        setIsSaving(false)
        didSave(todo)
      })
  }

  return (
    <li key={todo.id} className="mt-1">
      <div
        className={`w-full flex items-center transition ${isSaving &&
          "opacity-50"}`}
      >
        <input
          type="checkbox"
          className="form-checkbox w-4 h-4 rounded-sm mr-2 bg-transparent border-gray-525 text-green"
          disabled={isSaving}
        />
        <form onSubmit={handleSubmit} className="w-full">
          <input
            className="form-input border-transparent w-full rounded bg-transparent focus:border-transparent focus:shadow-none focus:bg-gray-700 hover:bg-gray-700 font-light text-lg pl-1 py-1"
            value={text}
            ref={inputRef}
            onChange={e => setText(e.target.value)}
            onBlur={handleSubmit}
            disabled={isSaving}
            placeholder="New To-Do"
          />
        </form>
        {isSaving && <Spinner className="flex-no-shrink" />}
      </div>
    </li>
  )
}
