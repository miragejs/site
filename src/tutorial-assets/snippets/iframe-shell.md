```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="demo"></div>
    <script>
      // Fix for GraphQL (see https://github.com/graphql/graphql-js/issues/2676)
      window.process = window.process || { env: "production" }
    </script>
    <script src="https://unpkg.com/@plnkr/runtime@1.0.0-pre.9/dist/runtime.js"></script>
    <script>
      // current revision provided by parent component
      const revision = 1

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
      const plnkrInstantiate = PlnkrRuntime.Runtime.prototype[
        PlnkrRuntime.Runtime.instantiate
      ]

      // Monkey patch module loading for Mirage GraphQL
      PlnkrRuntime.Runtime.prototype[PlnkrRuntime.Runtime.instantiate] =
        function(key, processAnonRegister) {
          return plnkrInstantiate.call(
            this,
            key.replace(
              /https:\/\/dev\.jspm\.io\/@miragejs\/graphql(.*)/,
              'https://jspm.dev/@miragejs/graphql$1'
            ),
            processAnonRegister
          )
        }

      const runtime = new PlnkrRuntime.Runtime({ host })

      function sendMessage(type, message) {
        window.parent.postMessage(
          { fromSandbox: true, revision, type, message },
          "*"
        )
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

      runtime
        .import("./index.js")
        .then(() => {
          sendMessage("mirage:db", { db: server.db.dump() })
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
            sendMessage("mirage:parse-error", error.toString())
          }
        })
    </script>
  </body>
</html>
```
