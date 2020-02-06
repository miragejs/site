import React from "react"
import { Link } from "gatsby"
import SEO from "../components/seo"
import { SectionWithLines } from "../components/ui"

function NotFound() {
  return (
    <div className="relative">
      <div className="relative z-10">
        <SEO />

        <SectionWithLines>
          <div className="relative z-10 max-w-xl px-5 mx-auto md:px-8 2xl:max-w-2xl">
            <section className="pt-12 pb-20 lg:pt-16 2xl:pt-24 md:pb-32 xl:pb-40 2xl:pb-48">
              <h1 className="text-3xl leading-tight tracking-tight text-white font-title md:text-4-75xl md:leading-tighter lg:text-5xl 2xl:text-5-5xl ">
                Page not found
              </h1>
              <div className="max-w-3xl mt-8 md:mt-10 2xl:mt-12 2xl:max-w-4xl">
                <p className="text-lg leading-normal text-gray-500 md:text-xl">
                  Looks like you've followed a broken link or entered a URL that
                  doesn't exist on this site.
                </p>
                <div className="mt-8 md:mt-10 2xl:mt-12">
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
                </div>
              </div>
            </section>
          </div>
        </SectionWithLines>
      </div>
    </div>
  )
}

export default NotFound
