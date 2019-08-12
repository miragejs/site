/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ title, description, image, lang, meta }) {
  const { site, allFile } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
        allFile(filter: { relativePath: { eq: "media-card.png" } }) {
          edges {
            node {
              childImageSharp {
                size19x10: resize(width: 1200, height: 630, quality: 100) {
                  src
                }
                size2x1: resize(width: 1200, height: 600, quality: 100) {
                  src
                }
              }
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  // twitter needs a absolute domain name for its image cards, so i'm hardcoding
  // miragejs.com
  let defaultImage = `https://miragejs.com${allFile.edges[0].node.childImageSharp.size2x1.src}`

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title ? title : site.siteMetadata.title}
      titleTemplate={
        title ? `%s | ${site.siteMetadata.title}` : site.siteMetadata.title
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title ? title : site.siteMetadata.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: image ? image : defaultImage,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:title`,
          content: title ? title : site.siteMetadata.title,
        },
        {
          name: `twitter:image`,
          content: image ? image : defaultImage,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
}

export default SEO
