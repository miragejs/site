```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="demo"></div>
    <script src="https://unpkg.com/@plnkr/runtime@1.0.0-pre.9/dist/runtime.js"></script>
    <script>
      const files = {
        "package.json": JSON.stringify({
          dependencies: {
            miragejs: "*",
          },
        }),

        "index.js": `
          import { Server } from 'miragejs';
          import server from './App';

          let didExportServer = server instanceof Server
          if (!didExportServer) {
            throw Object.assign(new Error(), { type: 'no-server-export' })
          }

          window.parent.postMessage(
            {
              fromSandbox: true,
              type: "mirage:db",
              message: server.db.dump(),
            },
            "*"
          )
          window.server = server

          // let originalHandler = server.pretender.handledRequest.bind(
          //   server.pretender
          // );

          // server.pretender.handledRequest = (verb, path, request) => {
          //   originalHandler(verb, path, request);
          // }
        `,

        "App.js": `
        `,
      }
      const host = {
        getCanonicalPath(path) {
          if (files[path]) return path
          if (files[`${path}.js`]) return `${path}.js`
          return Promise.reject(new Error(`File not found ${path}`))
        },
        getFileContents(canonicalPath) {
          return files[canonicalPath]
        },
      }
      const PlnkrRuntime = window.PlnkrRuntime
      const runtime = new PlnkrRuntime.Runtime({ host })

      function sendMessage(type, message) {
        window.parent.postMessage({ fromSandbox: true, type, message }, "*")
      }

      window.myOnError = function (e) {
        console.log("runtime error?")

        sendMessage("mirage:runtimeError", e)
      }

      window.addEventListener("unhandledrejection", function (e) {
        e.stopImmediatePropagation()
        e.preventDefault()

        sendMessage("mirage:unhandled-rejection", e.reason)
      })

      window.addEventListener("message", async function ({ data }) {
        if (data.fromInspector) {
          switch (data.type) {
            case "mirage:request":
              let { method, url, body } = data.message

              let res = await fetch(url, { method, body })
              let text = await res.text()
              let json
              try {
                json = JSON.parse(text)
              } catch (error) {}

              sendMessage("mirage:response", {
                response: {
                  data: json || text,
                  code: res.status,
                  headers: res.headers.map,
                },
                db: window.server.db.dump(),
              })
              break

            default:
              console.log("this is iframe receiving message, over")
              break
          }
        }
      })

      // const log = console.log.bind(console)
      // console.log = (...args) => {
      //   log(...args)
      //   window.parent.postMessage(
      //     {
      //       fromSandbox: true,
      //       type: "log",
      //       message: args,
      //     },
      //     "*"
      //   )
      // }

      // const groupCollapsed = console.groupCollapsed.bind(console)
      // console.groupCollapsed = (...args) => {
      //   groupCollapsed(...args)
      //   window.parent.postMessage(
      //     {
      //       fromSandbox: true,
      //       type: "log",
      //       message: args,
      //     },
      //     "*"
      //   )
      // }

      runtime
        .import("./index.js")
        .then(() => {
          console.log("SENDING MESSAGE")

          sendMessage("mirage:success")
        })
        .catch((error) => {
          if (
            error.originalErr &&
            error.originalErr.type === "no-server-export"
          ) {
            sendMessage(
              "mirage:runtime-error",
              "A Mirage Server instance must be the default export from your config."
            )
          } else {
            console.log(error)

            sendMessage("mirage:parse-error", error)
          }
        })
    </script>
  </body>
</html>
```
