const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Mirage JS • Build, test and demo your JavaScript application without an API`,
    description: `Sign up to hear when Mirage is ready`,
    author: `@miragejs`,
  },
  plugins: [
    `gatsby-plugin-netlify`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets/images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/routes`,
        name: "pages",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/snippets`,
        name: "snippets",
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mirage JS`,
        short_name: `Mirage JS`,
        start_url: `/`,
        background_color: `#1A1C1D`,
        theme_color: `#1A1C1D`,
        display: `standalone`,
        icon: `src/assets/images/mirage-favicon.svg`,
      },
    },

    `gatsby-plugin-postcss`,

    //       filters: [
    //         function(value) {
    //           if (value.tagname === "feGaussianBlur") {
    //             let newNode = { ...this.node }

    //             // Set color-interpolation-filters for Safari
    //             // https://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
    //             newNode.props.colorInterpolationFilters = "sRGB"

    //             this.update(newNode)
    //           }
    //         },
    //       ],
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        prettier: false,
        svgo: true, // Use the .svgo.yml file to config SVGO
      },
    },

    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        remarkPlugins: [require("remark-slug")],
      },
    },

    // Make sure this comes at the end!
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        extractors: [
          {
            extractor: class {
              /**
               * @param {object} content
               */
              static extract(content) {
                return content.match(/[\w-/:+]+(?<!:)/g) || []
              }
            },
            extensions: ["js", "ts", "jsx", "tsx", "mdx"],
          },
        ],
        purgeOnly: ["/tailwind-utils.css"],
        content: [
          path.join(process.cwd(), "src/**/!(*.d).{ts,js,jsx,tsx,mdx}"),
        ],
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
  ],
}
