import "./spinner.css"
import React from "react"

export default function Spinner({ className }) {
  return (
    <div className={`spinner ${className}`}>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  )
}
