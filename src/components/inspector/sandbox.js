import React from "react"

export default function({ srcDoc }) {
  return (
    <iframe
      title="Output"
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
      srcDoc={srcDoc}
    ></iframe>
  )
}
