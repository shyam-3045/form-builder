import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useForms, useSubmitForms } from "../../hooks/customQuery/form"
import shouldShowQuestion from "../../utils/showQuestionCOntroller"

const FormPage = ({ preview = false }) => {
  const { formID } = useParams()
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState([])

  const { data, isLoading, error } = useForms(formID)
  const { mutate: submitForm  } = useSubmitForms()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error fetching form</p>

  const form = data.value

  const visibleQuestions = form.questions.filter(ques =>
    shouldShowQuestion(ques.conditionalRules, answers)
  )

  const onSubmit = () => {
    if (preview) return

    const missingRequired = visibleQuestions.filter(
      q => q.required && !answers[q.questionKey]
    )

    if (missingRequired.length > 0) {
      setErrors(missingRequired.map(q => q.questionKey))
      return
    }

    setErrors([])
    submitForm({ formID, answers })
    alert("Form submitted Successfully !!!")
  }

  return (
    <div>
      <h2>{form.title}</h2>

      {visibleQuestions.map(q => (
        <div key={q.questionKey} style={{ marginBottom: "10px" }}>
          <label>
            {q.label}
            {q.required && <span style={{ color: "red" }}> *</span>}
          </label>
          <br />
          <input
            type="text"
            onChange={e =>
              setAnswers(prev => ({
                ...prev,
                [q.questionKey]: e.target.value
              }))
            }
          />
          {errors.includes(q.questionKey) && (
            <div style={{ color: "red", fontSize: "12px" }}>
              This field is required
            </div>
          )}
        </div>
      ))}

      {!preview ? (
        <button onClick={onSubmit}>Submit</button>
      ) : (
        <button disabled>Preview Mode</button>
      )}
    </div>
  )
}

export default FormPage
