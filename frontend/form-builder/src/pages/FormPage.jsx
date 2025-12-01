import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useForms, useSubmitForms } from "../../hooks/customQuery/form"
import shouldShowQuestion from "../../utils/showQuestionCOntroller"

const FormPage = ({ preview = false }) => {
  const { formID } = useParams()
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState([])

  const { data, isLoading, error } = useForms(formID)
  const { mutate: submitForm } = useSubmitForms()

  if (isLoading) return <p className="loading-text">Loading...</p>
  if (error) return <p className="error-text">Error fetching form</p>

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
    <div id="form-page">
      <h2 className="form-page-title">{form.title}</h2>

      {visibleQuestions.map(q => (
        <div key={q.questionKey} className="question-block">
          <label className="question-label">
            {q.label}
            {q.required && <span className="required">*</span>}
          </label>

          <input
            className={`question-input ${
              errors.includes(q.questionKey) ? "input-error" : ""
            }`}
            type="text"
            onChange={e =>
              setAnswers(prev => ({
                ...prev,
                [q.questionKey]: e.target.value
              }))
            }
          />
          <p>(Try Engineer)</p>

          {errors.includes(q.questionKey) && (
            <div className="error-text small">
              This field is required
            </div>
          )}
        </div>
      ))}

      {!preview ? (
        <button className="form-button" onClick={onSubmit}>Submit</button>
      ) : (
        <button className="form-button disabled" disabled>Preview Mode</button>
      )}
    </div>
  )
}

export default FormPage
