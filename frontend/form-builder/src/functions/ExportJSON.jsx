const ExportJSON = (data) => {
  const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const jsonURL = URL.createObjectURL(jsonData);
  const link = document.createElement('a');
  link.href = jsonURL
  link.download = "responses.json"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default ExportJSON