const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Mirage JS • An API mocking library for frontend developers`,
    description: `Build, test and demo your JavaScript application without an API`,
    author: `@miragejs`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        generateMatchPathRewrites: false,
      },
    },
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/tutorial-assets/snippets`,
        name: "snippets",
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
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
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 720,
              wrapperStyle: (fluidResult) => {
                let [, name, ext] = fluidResult.originalName.match(
                  /(.+?)(\.[^.]*$|$)/
                )
                let borderColor = name.endsWith("-dark") ? "#52595D" : "#F7FAFC"

                return `margin: 50px 0; border: 8px solid ${borderColor};`
              },
            },
          },
        ],
      },
    },

    // Make sure this comes at the end!
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        extractors: [
          {
            extractor: (content) => {
              return content.match(/[\w-/:+]+(?<!:)/g) || []
            },
            extensions: ["js", "ts", "jsx", "tsx", "mdx"],
          },
        ],
        purgeOnly: ["/tailwind-utils.css"],
        /*
          This is needed because our focus-visible Tailwind plugin adds the
          [data-focus-visible-addded] attribute at runtime using JS, but the
          generated css file has it in the classname. So purge won't ever find 
          a match in our raw source. So we add it here to trick purge into thinking
          it matches the "data-focus-visible-added" string in every file.
        */
        whitelist: ["data-focus-visible-added"],
        content: [
          path.join(process.cwd(), "src/**/!(*.d).{ts,js,jsx,tsx,mdx}"),
        ],
      },
    },
  ],
}
