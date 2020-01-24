```js
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { Server } from "miragejs"

new Server({
  routes() {
    this.namespace = 'api'

    this.get('/todos', ({ db }) => {
      return db.todos;
    }))
  }
})

ReactDOM.render(
  <App />,
  document.getElementById("root")
)
```
