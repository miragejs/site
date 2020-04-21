import queryString from "query-string"
import { useLocation, useNavigate } from "@reach/router"

export function useQueryParam(key, options = { type: "string" }) {
  let navigate = useNavigate()
  let location = useLocation()
  let queryParams = queryString.parse(location.search) ?? {}

  let value
  if (options.type === "binary") {
    value = queryParams[key] ? atob(queryParams[key]) : null
  } else {
    value = queryParams[key]
  }

  function setter(newValue) {
    if (options.type === "binary") {
      newValue = newValue ? btoa(newValue) : undefined
    } else {
      newValue = newValue || undefined
    }
    queryParams[key] = newValue
    let serializedQueryString = queryString.stringify(queryParams)
    let url = `${location.pathname}${
      serializedQueryString ? `?${serializedQueryString}` : ""
    }`
    navigate(url, { replace: true })
  }

  return [value, setter]
}
