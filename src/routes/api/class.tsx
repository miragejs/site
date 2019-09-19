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

const ReturnType = function({ esdoc }) {
  return (
    <div className="italic inline-block">
      {esdoc.return ? (
        esdoc.return.types.map((type, index) => <span key={index}>{type}</span>)
      ) : (
        <span className="em">any</span>
      )}
    </div>
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
        <div className="pt-12">
          <h2 className="font-semibold text-2xl leading-tight">Fields</h2>
          {publicClass.fields.map(field => (
            <div key={field.longname} className="pt-6">
              <h3 id={field.name} className="font-mono">
                <a href={`#${field.name}`} className="block">
                  {field.kind}{" "}
                  <span className="font-semibold">{field.name}:</span>{" "}
                  <ReturnType esdoc={field} />
                </a>
              </h3>
              {/* probably need markdown doc block for accessors here */}
            </div>
          ))}
        </div>
      ) : null}
      {publicClass.accessors.length > 0 ? (
        <div className="pt-12">
          <h2 className="font-semibold text-2xl leading-tight">Accessors</h2>
          {publicClass.accessors.map(accessor => (
            <div key={accessor.longname} className="pt-6">
              <h3 id={accessor.name} className="font-mono">
                <a href={`#${accessor.name}`} className="block">
                  {accessor.kind}{" "}
                  <span className="font-semibold">{accessor.name}:</span>{" "}
                  <ReturnType esdoc={accessor} />
                </a>
              </h3>
              {/* probably need markdown doc block for accessors here */}
            </div>
          ))}
        </div>
      ) : null}
      {publicClass.accessors.length > 0 ? (
        <div className="pt-16">
          <h2 className="font-semibold text-2xl leading-tight">Methods</h2>
          {publicClass.methods.map(method => (
            <div key={method.longname} className="pt-6">
              <h3 id={method.name} className="font-mono">
                <a href={`#${method.name}`} className="block">
                  <span className="font-semibold">{method.name}</span>():{" "}
                  <ReturnType esdoc={method} />
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
