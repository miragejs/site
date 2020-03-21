import React from "react"
import "codemirror/lib/codemirror.css"
import CodeMirror from "codemirror"
import "codemirror/mode/javascript/javascript"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  .CodeMirror {
    height: 100%;
  }
`

export default function({ value, onChange }) {
  let editorDivRef = React.useRef()
  let editorRef = React.useRef()
  React.useEffect(() => {
    if (!editorRef.current) {
      console.log("instantiating codemirror")
      editorRef.current = new CodeMirror(editorDivRef.current, {
        value,
        mode: "javascript",
      })

      editorRef.current.on("change", cm => {
        onChange(cm.getValue())
      })
    }
  })

  return (
    <>
      <GlobalStyle />
      <div className="flex-1 p-4" ref={editorDivRef}></div>
    </>
  )
}
