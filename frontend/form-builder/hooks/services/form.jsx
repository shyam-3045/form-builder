import api from "../../utils/config/axios"

export const getMyForms = async (formID)=>
{
    const res = await api.get(`/airtable/form/${formID}`,{
        withCredentials:true
    })
    return res.data
}

export const submitForms =async(formID,answers)=>
{
    const res = await api.post(`/airtable/forms/${formID}/submit`,answers,{
        withCredentials:true
    }
    )
}