import React from "react"
import { render } from "@testing-library/react"

const Title = () => <h1 data-testid="hero-title">Gatsby is awesome!</h1>

test("Displays the correct title", () => {
  const { getByTestId } = render(<Title />)
  expect(getByTestId("hero-title")).toHaveTextContent("Gatsby is awesome!")
})
