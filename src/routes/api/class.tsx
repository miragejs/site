import React from "react"
import useApiDocs from "../../hooks/use-api-docs"

export default function(props) {
  let classSlug = props.classSlug
  let { publicClasses } = useApiDocs()
  let classDoc = publicClasses.find(doc => doc.slug === classSlug)

  return (
    <div>
      <h1 className="text-3xl">{classDoc.name}</h1>
      <p className="italic">API docs coming soon!</p>

      {/*
      <div className="pt-2">{classDoc.description}</div>
      <div className="pt-4">
        <h2 className="font-semibold">Fields</h2>
        {classDoc.fields.map(field => (
          <div key={field.longname}>{field.name}</div>
        ))}
      </div>
      <div className="pt-4">
        <h2 className="font-semibold">Methods</h2>
        {classDoc.methods.map(method => (
          <div key={method.longname}>{method.name}</div>
        ))}
      </div>
      */}
    </div>
  )
}
