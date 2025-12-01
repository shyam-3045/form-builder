const shouldShowQuestion = (rules , answeredSoFar)=>
{
    if (!rules)
    {
        return true
    }

    const checkCondition = rules.conditions.map(c => {
    const answer = answeredSoFar[c.questionKey]
    console.log(answer)

    if (answer === undefined || answer === null) 
    {
        return false
    }
        

    if (c.operator === "equals") 
    {
        return answer === c.value
    }
    if (c.operator === "notEquals") 
    {
        return answer !== c.value
    }

    if (c.operator === "contains") {
      if (Array.isArray(answer)) 
      {
        return answer.includes(c.value)
      }
      if (typeof answer === "string") 
      {
        return answer.includes(c.value)
      }
      return false
    }

    return false
  })
  
  if (rules.logic === "AND") 
  {
    return checkCondition.every(Boolean)
  }
  if (rules.logic === "OR") {
    return checkCondition.some(Boolean)
  }

  return true

}

export default shouldShowQuestion