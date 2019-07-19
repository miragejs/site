import React from "react"
import { render, act, waitForElementToBeRemoved } from "@testing-library/react"
import TodoApp from "miragejs/src/components/todo-app"
import server from "miragejs/src/server"

test("It renders the todo app", () => {
  let { getByTestId } = render(<TodoApp />)
  expect(getByTestId("todo-app")).toBeInTheDocument()
})

test("it fetches todos from the server", async () => {
  server.db.loadData({
    todos: [{ id: 1, text: "Write more tests!" }],
  })

  let { findByTestId, findByDisplayValue } = render(<TodoApp />)

  let todo = await findByTestId("todo-id-1")
  let input = await findByDisplayValue("Write more tests!")

  expect(todo).toBeInTheDocument()
  expect(input).toBeInTheDocument()
})

test("it shows a loading spinner while data is being fetched", () => {
  let respond

  // here we're going to tell our server to return a promise that
  // doesnt resolve. this will make the http request sit in a
  // a pending state, which means our react component will be
  // prementely showing its loading spinner.
  server.get("/todos", () => {
    return new Promise(resolve => {
      respond = resolve
    })
  })

  let { getByTestId } = render(<TodoApp />)

  expect(getByTestId("loading")).toBeInTheDocument()

  // ok now that we've asserted the loading spinner is showing we can
  // resolve the promise our mirage server returned
  respond()
})
