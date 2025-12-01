import Papa from "papaparse"

const ExportCSV = (data) => {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "responses.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export default ExportCSV