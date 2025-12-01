import { Link } from "react-router-dom"
import { useAllForms } from "../../hooks/customQuery/form"

export const Dashboard = () => {

    const {data ,isLoading,isError,error}=useAllForms()
    if (isLoading)
    {
        return <p className="loading-text">...Loading</p>
    }
    if(isError)
    {
        return <p className="error-text">{error.message}</p>
    }

  return (
    <div id="dashboard">
      <h2 className="dashboard-title">My Forms</h2>

      {data.length === 0 && <p className="empty-text">No forms created yet</p>}

      {data.map(form => (
        <div key={form._id} className="form-card">
          <h2 className="form-title">{form.title || "Untitled Form"}</h2>

          <div className="form-links">
            <Link to={`/form/${form._id}`} className="form-link">
              Open
            </Link>
            <span>|</span>
            <Link to={`/form/${form._id}/preview`} className="form-link">
              Preview
            </Link>
            <span>|</span>
            <Link to={`/forms/${form._id}/responses`} className="form-link">
              Responses
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
