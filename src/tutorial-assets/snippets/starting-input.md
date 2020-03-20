```js
import { Server, Model } from "miragejs"

export default new Server({
  models: {
    user: Model,
  },

  seeds(server) {
    server.create("user", { name: "Ryan" })
    server.create("user", { name: "Sam" })
  },

  routes() {
    this.resource("user")
  },
})
```
