```jsx{4,7-15}
import React from "react"
import ReactDOM from "react-dom"
import App from "./app"
import { Server } from "miragejs"

if (process.env.NODE_ENV === "development") {
  new Server({
    routes() {
      this.get("/users", () => [
        { id: "1", name: "Luke" },
        { id: "2", name: "Leah" },
        { id: "3", name: "Anakin" },
      ])
    },
  })
}

ReactDOM.render(<App />, document.getElementById("root"))
```
