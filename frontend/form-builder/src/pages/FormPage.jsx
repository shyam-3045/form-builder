import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useForms, useSubmitForms } from "../../hooks/customQuery/form"
import shouldShowQuestion from "../../utils/showQuestionCOntroller"

const FormPage = () => {
  const { formID } = useParams()
  const [answers, setAnswers] = useState({})

  const { data, isLoading, error } = useForms(formID)
  const {mutate : submitForm,data:formData}=useSubmitForms()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error fetching form</p>

  const form = data.value

  const visibleQuestions = form.questions.filter(q =>
    shouldShowQuestion(q.conditionalRules, answers)
  )
  
  console.log(form.questions)
  console.log(formID,answers)
  const onSubmit = () => {
    const missingRequired = visibleQuestions.filter(
      q => q.required && !answers[q.questionKey]
    )

    if (missingRequired.length > 0) {
      alert("Required fields are missing")
      return
    }
    submitForm({formID,answers})
    console.log("Form valid, answers:", answers)
  }

  return (
    <div>
      <h2>{form.title || "Form"}</h2>

      {visibleQuestions.map(q => (
        <div key={q.questionKey} style={{ marginBottom: "10px" }}>
          <label>{q.label}</label>
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
        </div>
      ))}

      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}

export default FormPage
