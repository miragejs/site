import React, { useEffect } from "react"
import "codemirror/lib/codemirror.css"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  .CodeMirror {
    height: 100%;
  }
  .CodeMirror-lines {
    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.6;
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
  }
`

export default function CodeEditor({
  value = "",
  onChange = () => {},
  extraKeys,
  "data-testid": dataTestId,
}) {
  let editorDivRef = React.useRef()
  let editorRef = React.useRef()
  let handlerRef = React.useRef()

  // CodeEditor can't handle nulls or undefineds
  value = value ?? ""

  handlerRef.current = onChange

  useEffect(() => {
    // Load CodeMirror + its plugins using dynamic import, since they
    // only work in the browser.
    const f = async () => {
      if (!editorRef.current) {
        let CodeMirror = (await import("codemirror")).default
        await import("codemirror/mode/javascript/javascript")

        editorRef.current = new CodeMirror(editorDivRef.current, {
          value,
          mode: "javascript",
        })

        editorRef.current.on("change", (cm) => {
          handlerRef.current(cm.getValue())
        })
      }

      if (dataTestId) {
        editorRef.current
          .getWrapperElement()
          .setAttribute("data-testid", dataTestId)
      }

      // If the parent passes in a new value after the editor has been initialized, we may need to update it
      if (value !== editorRef.current.getValue()) {
        editorRef.current.setValue(value)
      }

      editorRef.current.setOption("extraKeys", extraKeys)
    }

    f()
  }, [value, dataTestId, extraKeys])

  // let previousValue = usePrevious(value)
  // useEffect(() => {
  //   console.log({ value })
  //   console.log({ previousValue })
  //   if (editorRef.current?.getValue() && previousValue !== value) {
  //     console.log("codemirror setValue")
  //     editorRef.current.setValue(value)
  //   }
  // }, [previousValue, value])

  return (
    <>
      <GlobalStyle />
      <div className="h-full" ref={editorDivRef}></div>
    </>
  )
}
