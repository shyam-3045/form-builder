import { Link } from "react-router-dom"
import { useAllForms } from "../../hooks/customQuery/form"

export const Dashboard = () => {

    const {data ,isLoading,isError,error}=useAllForms()
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
      <h2>My Forms</h2>

      {data.length === 0 && <p>No forms created yet</p>}

      {data.map(form => (
        <div key={form._id} style={{ marginBottom: "12px" }}>
          <h2>{form.title || "Untitled Form"}</h2>
          <br />

          <Link to={`/form/${form._id}`}>
            Open
          </Link>
          {" | "}
          <Link to={`/form/${form._id}/preview`}>
            Preview
          </Link>
          {" | "}
          <Link to={`/forms/${form._id}/responses`}>
            Responses
          </Link>
        </div>
      ))}
    </div>
  )
}
