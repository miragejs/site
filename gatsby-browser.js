/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import "./src/styles/global.css"
import "./src/styles/tailwind-utils.css"
import "./src/fonts/Ginto/ginto.css"
import "./src/fonts/GTAmerica/gt-america.css"

import { createServer, Response } from "miragejs"

if (window.Cypress) {
  let otherDomains = ["https://miragejs-site-backend.herokuapp.com/"]
  let methods = ["get", "put", "patch", "post", "delete"]

  createServer({
    environment: "test",
    routes() {
      for (const domain of ["/", ...otherDomains]) {
        for (const method of methods) {
          this[method](`${domain}*`, async (schema, request) => {
            let [status, headers, body] = await window.handleFromCypress(
              request
            )
            return new Response(status, headers, body)
          })
        }
      }
    },
  })
}
