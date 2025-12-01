const shouldShowQuestion = (rules , answeredSoFar)=>
{
    if (!rules)
    {
        return true
    }

    const checkCondition = rules.conditions.map(c => {
        let answer = answeredSoFar[c.questionKey]

        if (answer === undefined || answer === null) 
        {
            return false
        }

        if (typeof answer === "string") {
            answer = answer.toLowerCase()
        }

        let value = c.value
        if (typeof value === "string") {
            value = value.toLowerCase()
        }

        if (c.operator === "equals") 
        {
            return answer === value
        }

        if (c.operator === "notEquals") 
        {
            return answer !== value
        }

        if (c.operator === "contains") {
            if (Array.isArray(answer)) 
            {
                return answer.map(v =>
                  typeof v === "string" ? v.toLowerCase() : v
                ).includes(value)
            }
            if (typeof answer === "string") 
            {
                return answer.includes(value)
            }
            return false
        }

        return false
    })

    if (rules.logic === "AND") 
    {
        return checkCondition.every(Boolean)
    }
    if (rules.logic === "OR") 
    {
        return checkCondition.some(Boolean)
    }

    return true
}

module.exports = shouldShowQuestion
