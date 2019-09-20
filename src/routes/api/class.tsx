import React from "react"
import useApiDocs from "../../hooks/use-api-docs"
import {
  H1,
  H2,
  H3,
  P,
  UL,
  LI,
  Strong,
  A,
  Pre,
  Code,
} from "../../components/ui"

import { Markdown } from "../../components/markdown"

let humanizeType = type => (type === "*" ? "any" : type)
let toJSXCommaList = (prev, curr) => [prev, ", ", curr]

const Params = function({ esdoc }) {
  return esdoc.params
    ? esdoc.params
        .map((param, index) => (
          <span key={index}>
            <span className="font-semibold">{param.name}: </span>
            <Types types={param.types} />
          </span>
        ))
        .reduce(toJSXCommaList)
    : null
}

const Returns = function({ esdoc }) {
  return <Types types={esdoc.return ? esdoc.return.types : ["any"]} />
}

const Type = function({ esdoc }) {
  return <Types types={esdoc.type ? esdoc.type.types : ["any"]} />
}

let Types = function({ types }) {
  return (
    <span className="italic">
      {types.map(humanizeType).reduce(toJSXCommaList)}
    </span>
  )
}

export default function(props) {
  let classSlug = props.classSlug
  let { publicClasses } = useApiDocs()
  let publicClass = publicClasses.find(doc => doc.slug === classSlug)

  return (
    <div>
      <H1>{publicClass.name}</H1>
      <div className="pt-2">
        <Markdown>{publicClass.description}</Markdown>
      </div>
      {publicClass.fields.length > 0 ? (
        <div>
          <h2
            id="Fields"
            className="font-semibold text-2xl leading-tight pt-12 pb-4"
          >
            Fields
          </h2>
          {publicClass.fields.map(field => (
            <div key={field.longname} className="pb-4">
              <h3 id={field.slug} className="font-mono text-xl pt-6">
                <a href={`#${field.slug}`} className="block">
                  <span className="font-semibold">{field.name}:</span>{" "}
                  <Type esdoc={field} />
                </a>
              </h3>
              <div className="text-base">
                <Markdown>{field.description}</Markdown>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {publicClass.accessors.length > 0 ? (
        <div>
          <h2
            id="Accessors"
            className="font-semibold text-2xl leading-tight pt-12 pb-4"
          >
            Accessors
          </h2>
          {publicClass.accessors.map(accessor => (
            <div key={accessor.longname} className="pb-4">
              <h3 id={accessor.slug} className="font-mono text-xl pt-6">
                <a href={`#${accessor.slug}`} className="block">
                  {accessor.kind}{" "}
                  <span className="font-semibold">{accessor.name}:</span>{" "}
                  <Type esdoc={accessor} />
                </a>
              </h3>
              <div className="text-base">
                <Markdown>{accessor.description}</Markdown>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {publicClass.methods.length > 0 ? (
        <div>
          <h2
            id="Methods"
            className="font-semibold text-2xl leading-tight pt-12 pb-4"
          >
            Methods
          </h2>
          {publicClass.methods.map(method => (
            <div key={method.longname} className="pb-4">
              <h3 id={method.slug} className="font-mono text-xl pt-6">
                <a href={`#${method.slug}`} className="block">
                  <span className="font-semibold">{method.name}</span>
                  (
                  <Params esdoc={method} />
                  ): <Returns esdoc={method} />
                </a>
              </h3>
              <div className="text-base">
                <Markdown>{method.description}</Markdown>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
