import { useStaticQuery, graphql } from "gatsby"

// these two types are really the same, combine them once
// we finish the graphql query

type ClassNode = {
  name: string
  longname: string
  memberof: string
  slug: string
  description: string
}

type EsdocNode = {
  name: string
  longname: string
  memberof: string
  kind: string
  access: string
}

let byName = (a: { name: string }, b: { name: string }) =>
  a.name > b.name ? 1 : -1

class ClassDoc {
  node: ClassNode
  esdoc: EsdocNode[]

  readonly name: string
  readonly slug: string
  readonly description: string

  constructor(node: ClassNode, esdoc: EsdocNode[]) {
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

  get blocks(): EsdocNode[] {
    return this.esdoc
      .filter(node => node.memberof === this.node.longname)
      .sort(byName)
  }

  get fields(): EsdocNode[] {
    return this.blocks.filter(node => node.kind === "member")
  }

  get methods(): EsdocNode[] {
    return this.blocks.filter(node => node.kind === "method")
  }
}

interface IApiDocsHook {
  publicClasses: ClassDoc[]
}

export default function(): IApiDocsHook {
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

  let esdoc: EsdocNode[] = data.allNodes.nodes

  let publicClasses = data.publicClasses.nodes
    .sort(byName)
    .map((node: ClassNode) => new ClassDoc(node, esdoc))

  return {
    publicClasses,
  }
}
