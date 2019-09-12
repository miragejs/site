import React from "react"
import BackgroundLines from "../assets/images/background-lines.svg"
import BackgroundLinesLg from "../assets/images/background-lines-lg.svg"
import SEO from "../components/seo"

export default function({ children }) {
  return (
    <div className="relative">
      <div className="relative z-10">
        <SEO />

        <div className="bg-gray-1000">
          <div className="absolute -top-16 xl:top-0 inset-x-0 overflow-hidden max-w-full flex justify-center">
            <BackgroundLines className="flex-shrink-0 2xl:hidden" />
            <BackgroundLinesLg className="flex-shrink-0 hidden 2xl:block" />
          </div>

          <div className="px-5 md:px-8  mx-auto z-10 relative max-w-xl 2xl:max-w-2xl">
            <section className="pt-12 lg:pt-16 2xl:pt-24 pb-20 md:pb-32 xl:pb-40 2xl:pb-48">
              <h1
                className="font-title text-white
                    text-3xl tracking-tight leading-tight
                    md:text-4-75xl md:leading-tighter
                    lg:text-5xl
                    2xl:text-5-5xl
                  "
              >
                Your email is confirmed!
              </h1>

              <div className="mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl">
                <p className="text-gray-500 leading-normal text-lg md:text-xl">
                  You'll now receive new updates via email.
                </p>
                <p className="mt-4 text-gray-500 leading-normal text-lg md:text-xl">
                  Here's what you've missed so far:
                </p>
                <ul className="mt-8 text-lg">
                  <li className="my-6">
                    <span className="block text-gray-500 text-sm">
                      Sep 9, 2019
                    </span>
                    <a
                      className="text-blue-500"
                      href="https://ckarchive.com/b/e5uph7h0m9x7"
                    >
                      <span
                        role="img"
                        aria-label="book"
                        className="inline-block"
                      >
                        📖
                      </span>{" "}
                      New guides for Mirage JS
                    </a>
                  </li>
                  <li className="my-6">
                    <span className="block text-gray-500 text-sm">
                      Aug 21, 2019
                    </span>
                    <a
                      className="text-blue-500"
                      href="https://ckarchive.com/b/5quvh7hmmzqq"
                    >
                      Mirage.js – First update!
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
