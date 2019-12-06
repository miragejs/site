/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
require("source-map-support").install()
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
  },
})

// require = require("esm")(module)
const fs = require("fs")
const path = require("path")
const Router = require("./src/lib/router").Router

let router = new Router()

// This is added so we can get the contents of the snippets files in our Snippet component
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "File" && node.absolutePath.match(/snippets/)) {
    createNodeField({
      node,
      name: "content",
      value: fs.readFileSync(node.absolutePath, "utf8"),
    })
  }
}

exports.createPages = ({ actions }) => {
  const { createPage, createRedirect } = actions

  const createAppPage = function(url) {
    createPage({
      path: url, // dont shadow path module with local path variable
      matchPath: "/*",
      component: path.resolve(`./src/routes/app.js`),
    })
  }

  router.pages
    .filter(page => !page.isDynamic)
    .forEach(page => {
      createAppPage(page.fullPath)
    })

  // TODO: Create all API docs pages dynamically
  createAppPage("/api/classes/association")
  createAppPage("/api/classes/collection")
  createAppPage("/api/classes/db")
  createAppPage("/api/classes/db-collection")
  createAppPage("/api/classes/identity-manager")
  createAppPage("/api/classes/jsonapi-serializer")
  createAppPage("/api/classes/model")
  createAppPage("/api/classes/response")
  createAppPage("/api/classes/schema")
  createAppPage("/api/classes/serializer")
  createAppPage("/api/classes/server")

  /*
    TODO: Create all redirects programatically. All non-page routes should
    redirect to nearest page? (More difficult with dynamic routes). Note that
    createRedirect has a redirectInBrowser option, but we don't want to use that.
  */
  createRedirect({
    fromPath: "/docs",
    toPath: "/docs/getting-started/introduction",
  })
  createRedirect({
    fromPath: "/docs/getting-started",
    toPath: "/docs/getting-started/introduction",
  })
  createRedirect({
    fromPath: "/api",
    toPath: "/api/classes/association",
  })
  createRedirect({
    fromPath: "/api/classes",
    toPath: "/api/classes/association",
  })
  createRedirect({
    fromPath: "/quickstarts",
    toPath: "/quickstarts/react/development",
  })
  createRedirect({
    fromPath: "/quickstarts/react",
    toPath: "/quickstarts/react/development",
  })
  createRedirect({
    fromPath: "/quickstarts/vue",
    toPath: "/quickstarts/vue/development",
  })
  createRedirect({
    fromPath: "/quickstarts/vue/cypress",
    toPath: "/quickstarts/cypress/setup",
  })
  createRedirect({
    fromPath: "/quickstarts/cypress",
    toPath: "/quickstarts/cypress/setup",
  })
}

// DOC STUFF TODO Extract

let esdoc = require("esdoc").default
let tmp = require("tmp")
let slugify = require("@sindresorhus/slugify")

let generateESDoc = function(config) {
  var tmpdir = tmp.dirSync()
  esdoc.generate({ ...config, ...{ destination: tmpdir.name } })
  let index = fs.readFileSync(`${tmpdir.name}/index.json`)
  let result = JSON.parse(index)
  tmpdir.removeCallback()

  return result
}

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  let docNodes = generateESDoc({
    source: "./node_modules/miragejs/lib",
    excludes: ["(node_modules|tests|tmp)"],
    plugins: [
      {
        name: "esdoc-ecmascript-proposal-plugin",
        option: {
          classProperties: true,
          objectRestSpread: true,
          doExpressions: true,
          functionBind: true,
          functionSent: true,
          asyncGenerators: true,
          decorators: true,
          exportExtensions: true,
          dynamicImport: true,
        },
      },
      { name: "esdoc-accessor-plugin" },
    ],
  })

  docNodes.forEach(docNode => {
    let node = {
      ...{ slug: slugify(docNode.name) },
      ...docNode,
    }

    let data = {
      ...node,
      ...{
        id: createNodeId(`esdoc-${node.__docId__}`),
        internal: {
          type: "ESDoc",
          contentDigest: createContentDigest(JSON.stringify(node)),
        },
      },
    }

    createNode(data)
  })
}
