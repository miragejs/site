import React from "react"
import { Link } from "gatsby"

import SEO from "../components/seo"

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen text-gray-100 min-w-screen">
    <SEO title="404: Not found" />
    <div className="max-w-sm mx-4">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4">
        Looks like you've followed a broken link or entered a URL that doesn't
        exist on this site.
      </p>
      <p className="mt-8">
        <Link
          to="/"
          className="flex items-center font-semibold text-green-500 uppercase hover:underline hover:text-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="mr-2"
          >
            <path
              className="fill-current"
              d="M11.9998836,4.09370803 L8.55809517,7.43294953 C8.23531459,7.74611298 8.23531459,8.25388736 8.55809517,8.56693769 L12,11.9062921 L9.84187871,14 L4.24208544,8.56693751 C3.91930485,8.25388719 3.91930485,7.74611281 4.24208544,7.43294936 L9.84199531,2 L11.9998836,4.09370803 Z"
            ></path>
          </svg>{" "}
          Back to our site
        </Link>
      </p>
    </div>
  </div>
)

export default NotFound
