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

          <div className="px-5 md:px-8 max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl mx-auto z-10 relative">
            <section className="pt-12 lg:pt-16 2xl:pt-24 pb-20 md:pb-32 xl:pb-40 2xl:pb-48">
              <h1
                className="mt-32 font-title text-white
                    text-3-5xl tracking-tight leading-tight
                    md:text-4-75xl md:leading-tighter
                    lg:text-5xl
                    2xl:text-5-5xl
                  "
              >
                Thanks for signing up!
              </h1>

              <div className="mt-8 md:mt-10 2xl:mt-12 max-w-3xl 2xl:max-w-4xl">
                <p className="text-gray-500 leading-normal text-lg md:text-xl 2xl:text-2xl">
                  You should hear from us soon.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
