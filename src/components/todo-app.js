import React, { useEffect, useState, useRef } from "react"
import Spinner from "./spinner"

export default function TodoApp({ refresh }) {
  let [isLoading, setIsLoading] = useState(false)
  let [todos, setTodos] = useState([])
  let [newTodo, setNewTodo] = useState(null)

  useEffect(() => {
    let isLatestAndMounted = true
    setIsLoading(true)

    fetch("/api/todos")
      .then(res => res.json())
      .then(json => {
        if (isLatestAndMounted) {
          setTodos(json)
          setIsLoading(false)
        }
      })
      .catch(e => {
        console.log("there was an error!")
        console.log(e, e.message)
      })

    // If this effect is rerun or the component is unmounted, dont run the callback
    return () => {
      isLatestAndMounted = false
    }
  }, [refresh])

  function addTodo(todo) {
    setNewTodo(null)
    setTodos(todos => [todo, ...todos])
  }

  function updateTodo(todo) {
    setTodos(todos => [
      ...todos.map(globalTodo =>
        globalTodo.id === todo.id ? todo : globalTodo
      ),
    ])
  }

  function removeTodo(todo) {
    setTodos(todos => [
      ...todos.filter(globalTodo => globalTodo.id !== todo.id),
    ])
  }

  return (
    <>
      <div className="max-w-sm mx-auto">
        <div
          className="px-5 pt-3 pb-6 text-lg text-white border-t-8 border-green-500 rounded-lg shadow-lg bg-gray-1000"
          data-testid="todo-app"
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-100">Todos</p>
            <p className="text-base font-medium text-gray-500">
              {!isLoading &&
                (todos.length ? (
                  <span>{todos.length} left</span>
                ) : (
                  <span>All done!</span>
                ))}
            </p>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <p data-testid="loading">Loading...</p>
            ) : (
              <ul data-testid="todo-list">
                {newTodo && (
                  <TodoItem
                    todo={newTodo}
                    didCreate={addTodo}
                    autofocus={true}
                  />
                )}

                {todos
                  .sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1))
                  .reverse()
                  .map(todo => (
                    <TodoItem
                      todo={todo}
                      didSave={updateTodo}
                      didDestroy={removeTodo}
                      key={todo.id}
                    />
                  ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            {!isLoading && (
              <button
                onClick={() => setNewTodo({ text: "" })}
                className="flex items-center justify-center w-10 h-10 ml-auto text-4xl font-light leading-none text-white bg-green-500 rounded-full shadow-lg focus:outline-none"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function TodoItem({ todo, didCreate, didSave, didDestroy, autofocus }) {
  let inputRef = useRef(null)
  let [text, setText] = useState(todo.text)
  let [isSaving, setIsSaving] = useState(false)
  let [isChecked, setIsChecked] = useState(false)

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
    todo.createdAt = new Date().getTime()

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

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked)
  }

  useEffect(() => {
    function destroyTodo() {
      setIsSaving(true)

      fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      }).then(() => {
        setIsSaving(false)
        didDestroy(todo)
      })
    }

    if (isChecked) {
      let id = setTimeout(() => {
        destroyTodo()
      }, 1250)

      return () => clearTimeout(id)
    }
  }, [isChecked, didDestroy, todo])

  return (
    <li key={todo.id} data-testid={`todo-id-${todo.id}`} className="mt-1">
      <div
        className={`w-full flex items-center transition ${isSaving &&
          "opacity-50"}`}
      >
        <input
          type="checkbox"
          className={`form-checkbox cursor-pointer w-5 h-5 rounded-sm mr-2 bg-transparent border-gray-600 text-green-500 ${!todo.id &&
            "opacity-0"}`}
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={isSaving}
        />
        <form onSubmit={handleSubmit} className="w-full">
          <input
            className="w-full py-1 pl-1 text-lg font-light bg-transparent border-transparent rounded form-input focus:border-transparent focus:shadow-none focus:bg-gray-900 hover:bg-gray-900"
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
