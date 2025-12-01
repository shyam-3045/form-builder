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
        return <p>...Loading</p>
    }
    if(isError)
    {
        return <p> {error.message} </p>
    }
    return (
    <div>
      <h2>Responses</h2>

      {responses.value.length === 0 && <p>No responses found !</p>}

      {responses.value.map(res => (
        <div key={res.submissionId} style={{ marginBottom: "12px" }}>
          <div><strong>ID:</strong> {res.submissionId}</div>
          <div><strong>Created:</strong> {new Date(res.createdAt).toLocaleString()}</div>
          <div><strong>Status:</strong> {res.status}</div>
          <div><strong>Preview:</strong> {res.AnswerPreview}</div>
          <hr />
        </div>
      ))}
      <h3>Exports :</h3>
      <button onClick={() => ExportJSON(responses.value)}>
             Export JSON
      </button>

      <button onClick={() => ExportCSV(responses.value)}>
            Export CSV
       </button>
    </div>
  )
}

export default ResponsesPage