/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
<<<<<<< HEAD
const fs = require("fs")
const path = require("path")
=======
let fs = require("fs")
let crypto = require("crypto")
>>>>>>> put escode in graphql

// I think this was from an earlier strategy at getting the snippet contents, but
// we went back to remark because it supports line highlighting
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "File" && node.absolutePath.match(/snippets/)) {
    createNodeField({
      node,
      name: "content",
      value: fs.readFileSync(node.absolutePath, "utf8"),
    })
  }
}

// Avoid loading @miragejs/server in node, as it will fail the build. Can remove
// once Mirage works in node.
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@miragejs\/server/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.createPages = ({ actions }) => {
  const { createPage, createRedirect } = actions

  // createRedirect({
  //   fromPath: `/one`,
  //   toPath: `/one/two/three`,
  //   redirectInBrowser: true,
  // })

  const createPageForAdam = function(options) {
    return createPage({
      path: options.path,
      matchPath: "/*",
      component: path.resolve(`./src/routes/app.js`),
    })
  }

  createPageForAdam({ path: "/" })
  // createPageForAdam({ path: "/docs" })
  createPageForAdam({ path: "/docs/getting-started/introduction" })
}

const esdoc = require("esdoc").default
const ESDOC_CONFIG = {
  source: "./node_modules/@miragejs/server/lib",
  destination: "./esdoc",
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
}

exports.sourceNodes = ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  // esdoc.generate(ESDOC_CONFIG)
  // let result = esdoc.generate(esdocConfig)
  let index = fs.readFileSync("./esdoc/index.json")
  let json = JSON.parse(index)

  json.forEach(node => {
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

    if (node.kind === "class" && node.access === "public") {
      console.log("TODO create ssr page for", node.name)
      //   createPage({
      //     path: `/pokemon/${pokemon.name}/`,
      //     component: require.resolve("./src/templates/pokemon.js"),
      //     context: { pokemon },
      //   })
    }
  })
}
