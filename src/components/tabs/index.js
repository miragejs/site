import React, { useState } from "react"

function Tab({ children }) {
  return children
}

function Tabs({ children }) {
  let [activeTab, setActiveTab] = useState(0)

  return (
    <div className="sm:bg-gray-1000 sm:rounded-lg sm:overflow-hidden sm:-mx-5 md:mx-auto md:w-5/6 md:shadow-lg">
      <div className="flex text-center sm:border-b sm:border-gray-700 sm:px-5 sm:pt-1">
        {children.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`w-1/2 sm:w-auto sm:px-4 hover:text-gray-1000 sm:hover:text-white sm:-mb-px focus:outline-none border-b py-2  ${
              activeTab === i
                ? "text-gray-1000 border-gray-1000 sm:text-white sm:border-white"
                : "text-gray-500 border-gray-400 sm:border-transparent"
            }`}
          >
            {tab.props.name}
          </button>
        ))}
      </div>

      <div className="-mx-5 mt-6 sm:mx-0 sm:mt-0">{children[activeTab]}</div>
    </div>
  )
}

export { Tabs, Tab }
