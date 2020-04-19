import React from "react"

export default function ({ db }) {
  let tableNames = Object.keys(db)
  let [activeTableName, setActiveTableName] = React.useState()
  let records = []
  let rows = []
  let fields = []

  // Unset activeTableName if the tableNames have changed and
  // the previous activeTableName is no longer in the list
  if (activeTableName && !tableNames.includes(activeTableName)) {
    setActiveTableName(null)
    return
  }

  if (activeTableName) {
    records = db[activeTableName]
    fields = getFieldsFromRecords(records)
    rows = records.map((record) => {
      return { attrs: fields.map((field) => record[field]) }
    })
  }

  React.useEffect(() => {
    if (!activeTableName && tableNames) {
      setActiveTableName(tableNames[0])
    }
  }, [tableNames, activeTableName])

  return (
    <>
      {activeTableName ? (
        <>
          <nav className="p-4">
            {tableNames.map((tableName) => (
              <button
                key={tableName}
                onClick={() => setActiveTableName(tableName)}
                className={`
                mr-4 text-sm font-medium focus:outline-none
                ${
                  tableName === activeTableName
                    ? "text-gray-700"
                    : "text-gray-400 hover:text-gray-900"
                }
            `}
              >
                {capitalize(tableName)}
              </button>
            ))}
          </nav>
          <div className="flex flex-col flex-1 h-0 pb-2">
            {rows.length ? (
              <div className="py-3 -my-2 overflow-x-auto">
                <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {fields.map((field) => (
                          <th
                            key={field}
                            className="px-4 py-3 text-xs font-medium leading-4 text-left text-gray-700 border-b border-gray-200 bg-gray-50"
                          >
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={index}
                          className={index % 2 ? "bg-gray-50" : "bg-white"}
                        >
                          {row.attrs.map((attr, index) => (
                            <td
                              key={attr}
                              className={`px-4 py-4 text-sm leading-5 text-gray-700 truncate
                                ${
                                  index === row.attrs.length - 1
                                    ? "w-full"
                                    : null
                                }
                              `}
                            >
                              {attr}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="px-4 mt-2 text-sm text-gray-400">
                The {capitalize(activeTableName)} table has no records.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="px-4 mt-6 text-gray-400">The database is empty.</p>
      )}
    </>
  )
}

const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1)

function getFieldsFromRecords(records) {
  let fields = records && records[0] ? Object.keys(records[0]) : []

  return fields.sort((a, b) => {
    if (a === "id") {
      return -1
    }
    if (b === "id") {
      return -1
    }

    return 0
  })
}
