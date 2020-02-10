import React, { Component } from "react"
import NotFound from "../routes/not-found"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    return this.state.hasError ? (
      this.state.error.message === "Route not found" ? (
        <NotFound />
      ) : (
        this.props.children // generic error here
      )
    ) : (
      this.props.children
    )
  }
}
