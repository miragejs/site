/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fs = require("fs")

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
  const { createRedirect } = actions

  createRedirect({
    fromPath: `/docs`,
    toPath: `/docs/getting-started/introduction`,
    isPermanent: true,
    redirectInBrowser: true,
  })
}

// const esdoc = require("esdoc").default
// const ESDOC_CONFIG = {
//   source: "./node_modules/@miragejs/server/lib",
//   destination: "./",
//   excludes: ["(node_modules|tests|tmp)"],
//   plugins: [
//     {
//       name: "esdoc-ecmascript-proposal-plugin",
//       option: {
//         classProperties: true,
//         objectRestSpread: true,
//         doExpressions: true,
//         functionBind: true,
//         functionSent: true,
//         asyncGenerators: true,
//         decorators: true,
//         exportExtensions: true,
//         dynamicImport: true,
//       },
//     },
//     { name: "esdoc-accessor-plugin" },
//   ],
// }
// exports.createPages = async ({ actions: { createPage } }) => {
//   esdoc.generate(ESDOC_CONFIG)
//   console.log(fs)
//   console.log(esdoc)
//   // debugger
//
//   // Example from Gatsby docs
//   // `getPokemonData` is a function that fetches our data
//   // const allPokemon = await getPokemonData(["pikachu", "charizard", "squirtle"])
//   // Create a page that lists all Pokémon.
//   // createPage({
//   //   path: `/`,
//   //   component: require.resolve("./src/templates/all-pokemon.js"),
//   //   context: { allPokemon },
//   // })
//   //
//   // // Create a page for each Pokémon.
//   // allPokemon.forEach(pokemon => {
//   //   createPage({
//   //     path: `/pokemon/${pokemon.name}/`,
//   //     component: require.resolve("./src/templates/pokemon.js"),
//   //     context: { pokemon },
//   //   })
//   // })
// }
