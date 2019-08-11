import { useStaticQuery, graphql } from "gatsby"

let byName = (a, b) => (a.name > b.name ? 1 : -1)

class ClassDoc {
  constructor(node, esdoc) {
    this.node = node
    this.esdoc = esdoc

    let fwd = ["name", "slug", "description"]
    fwd.forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return node[key]
        },
      })
    })
  }

  get name() {
    return this.node.name
  }

  get slug() {
    return this.node.slug
  }

  get blocks() {
    return this.esdoc
      .filter(node => node.memberof === this.node.longname)
      .sort(byName)
  }

  get fields() {
    return this.blocks.filter(node => node.kind === "member")
  }

  get methods() {
    return this.blocks.filter(node => node.kind === "method")
  }
}

export default function() {
  let data = useStaticQuery(graphql`
    query DocsQuery {
      publicClasses: allEsDoc(
        filter: { access: { eq: "public" }, kind: { eq: "class" } }
      ) {
        nodes {
          name
          longname
          memberof
          slug
          description
        }
      }
      allNodes: allEsDoc {
        nodes {
          name
          longname
          memberof
          kind
          access
        }
      }
    }
  `)

  let esdoc = data.allNodes.nodes

  let publicClasses = data.publicClasses.nodes
    .sort(byName)
    .map(node => new ClassDoc(node, esdoc))

  return {
    publicClasses,
  }
}
