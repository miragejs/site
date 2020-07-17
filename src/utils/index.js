export function escapeBackticks(str) {
  return str.replace(/`/g, "\\`")
}

export function urlsMatch(url1, url2) {
  return url1.replace(/\/+$/, "") === url2.replace(/\/+$/, "")
}
