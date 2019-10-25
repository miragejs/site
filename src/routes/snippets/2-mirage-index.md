```js{4,6,8-12}
import React from "react"
import ReactDOM from "react-dom"
import App from "./app"
import { Server } from "miragejs"

let server = new Server()

server.get("/users", () => [
  { id: "1", name: "Luke" },
  { id: "2", name: "Leah" },
  { id: "3", name: "Anakin" },
])

ReactDOM.render(<App />, document.getElementById("root"))
```
