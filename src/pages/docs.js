import React from "react"
import Layout from "../components/layout"
import DocsCopy from "./docs-copy"

export default function DocsPage() {
  return (
    <Layout>
      <header></header>
      <main className="bg-white">
        <div className="px-5 max-w-lg md:max-w-1-5xl lg:max-w-3xl lg:px-10 mx-auto">
          <DocsCopy />
        </div>
      </main>
    </Layout>
  )
}
