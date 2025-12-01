import api from "../../utils/config/axios"

export const getMyForms = async (formID)=>
{
    const res = await api.get(`/airtable/form/${formID}`)
    return res.data
}

export const submitForms =async(formID,answers)=>
{
    const res = await api.post(`/airtable/forms/${formID}/submit`,answers )
}

export const getAllForms = async()=>
{
    const res = await api.get("/airtable/forms")
    return res.data.value
}

export const getResponses = async (formID)=>
{
    const res = await api.get(`/airtable/forms/${formID}/responses`)
    return res.data
}

