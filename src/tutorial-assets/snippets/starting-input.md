```js
import React from "react"
import { Server } from "miragejs"
console.log("hi")

// console.log(Server)

// new Server({
//   routes() {
//     this.get("/some-endpoint", { text: "Hello from Mirage!" })
//   },
// })

export default function() {
  let [result, setResult] = React.useState({ text: "static" })

  React.useEffect(() => {
    fetch("/some-endpoint")
      .then(res => res.json())
      .then(setResult)
  }, [])

  return <p>Result: {result.text}</p>
}
```
