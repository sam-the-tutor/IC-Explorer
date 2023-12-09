import Moralis from "moralis"

Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0MDEwMzQ5LWRjMTgtNDNiMi05ZDNhLWE0MTkzYzE3Nzk2NCIsIm9yZ0lkIjoiMzU1NjM3IiwidXNlcklkIjoiMzY1NTIxIiwidHlwZUlkIjoiZWZiMmQ5ZTUtZjMyYS00Y2M1LWJiOTYtZDgyYTc0NmJhZmY3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTM2OTA3NTQsImV4cCI6NDg0OTQ1MDc1NH0.FdijLhAXeKo7cXOFmcMXvBAtXlTCaIu5S7oVUMNbeHU",
})

console.log("Moralis init :", Moralis)

//const hh = initMoralis()
export default Moralis
