import React from 'react'
import { useResponses } from '../../hooks/customQuery/form'
import { useParams } from 'react-router-dom'
import ExportJSON from '../functions/ExportJSON'
import ExportCSV from '../functions/ExportCSV'

const ResponsesPage = () => {
    const { formID } = useParams()
    const {data : responses , isLoading,isError,error }=useResponses(formID)

    if (isLoading)
    {
        return <p className="loading-text">...Loading</p>
    }
    if(isError)
    {
        return <p className="error-text">{error.message}</p>
    }

    return (
    <div id="responses-page">
      <h2 className="responses-title">Responses</h2>

      {responses.value.length === 0 && (
        <p className="empty-text">No responses found !</p>
      )}

      {responses.value.map(res => (
        <div key={res.submissionId} className="response-card">
          <div className="response-row">
            <span className="response-label">ID</span>
            <span>{res.submissionId}</span>
          </div>

          <div className="response-row">
            <span className="response-label">Created</span>
            <span>{new Date(res.createdAt).toLocaleString()}</span>
          </div>

          <div className="response-row">
            <span className="response-label">Status</span>
            <span>{res.status}</span>
          </div>

          <div className="response-row">
            <span className="response-label">Preview</span>
            <span>{res.AnswerPreview}</span>
          </div>
        </div>
      ))}

      <div className="export-section">
        <h3 className="export-title">Exports</h3>

        <div className="export-buttons">
          <button className="export-button" onClick={() => ExportJSON(responses.value)}>
            Export JSON
          </button>

          <button className="export-button" onClick={() => ExportCSV(responses.value)}>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResponsesPage
