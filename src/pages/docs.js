import React from "react"
import Layout from "../components/layout"
import DocsCopy from "./docs-copy"
import Logo from "../assets/images/logo.svg"
import { Link } from 'gatsby'

function Container(props) {
  return (
    <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl px-5 md:px-8">
      {props.children}
    </div>
  )
}

export default function DocsPage() {
  return (
    <Layout>
      <Container>
        <header className="py-4">
          <Link to="/">
            <Logo className="w-8 h-8 md:w-10 md:h-16" />
          </Link>
        </header>
      </Container>

      <main className="bg-white py-4">
        <Container>
          <DocsCopy />
        </Container>
      </main>
    </Layout>
  )
}
