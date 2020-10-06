// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "@percy/cypress"

Cypress.Commands.add("screenshot", (name) => {
  // 375 - iphone
  // 768 - ipad
  // 1024 - ipad pro
  // 1440 - laptop
  // 2560 - big screen

  cy.percySnapshot(name, { widths: [375, 768, 1024, 1440] })
})

Cypress.Commands.add(
  "typeInCodemirror",
  { prevSubject: true },
  (elements, text) => {
    elements[0].CodeMirror.setValue(text)
  }
)

Cypress.Commands.add("getContent", { prevSubject: true }, (elements) => {
  return elements[0].CodeMirror.getValue()
})

// Were not able to configure delay :(
// cy.get(".CodeMirror textarea").type(
//   d`
//   import { createServer, Model, belongsTo } from "miragejs"

//    export default createServer({
//      models: {
//        user: Model,
//      },

//      seeds(server) {
//        server.create("user", { name: "Ryan" })
//        server.create("user", { name: "Sam" })
//      },

//      routes() {
//        this.resource("user")
//      },
//    })
// `,
//   { force: true, parseSpecialCharSequences: false }
// )
