const { response } = require("express")
const { default: shouldShowQuestion } = require("../../frontend/form-builder/utils/showQuestionCOntroller")
const Response = require("../models/FormResponse")
const Form = require("../models/FormSchema")
const axios = require("axios")


exports.createForm = async(req,res)=>
{
    try {
        const { airtableBaseId, airtableTableId, questions } = req.body

        if(!questions)
        {
            return res.status(400).json({ok:false , msg:"required parameters missing "})
        }

        const formattedQuestions = questions.map(ques => ({
        questionKey: ques.questionKey,
        fieldId: ques.fieldId,
        label: ques.label || ques.questionKey,
        type: ques.type,
        required: ques.required || false,
        conditionalRules: ques.conditionalRules
        }))

        const form = await Form.create({
        owner: req.user._id,
        airtableBaseID:airtableBaseId,
        airtableTableID:airtableTableId,
        questions: formattedQuestions
        })
        
        return res.status(200).json({ok:true,msg:"Created form successfully !",value:form })
    } catch (error) {
        console.log("Error occures in creating form :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
    }
}

exports.getForm=async(req,res)=>
{
    try {
        const { formID }=req.params
        
        const form = await Form.findById(formID)

        if(!form)
        {
            return res.status(400).json({ok:false,msg:"Form not found !"}) 
        }
        return res.status(200).json({ok:true,msg:"retrived form successfully !",value:form})


    } catch (error) {
        console.log("Error occures in getting form :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
    }
}



exports.submitForm=async(req,res)=>
{
    try {
        const { formID }=req.params
        console.log(formID)
        console.log(req.body)

        const form = await Form.findById(formID)
        if(!form)
        {
            return res.status(400).json({ok:false , msg:"Form not found !"}) 
        }
        console.log(form)

        const answers = req.body
        const visibleQuestions = form.questions.filter(ques =>
            shouldShowQuestion(ques.conditionalRules,answers)
        )

        for (const ques of visibleQuestions)
        {
            const value = answers[ques.questionKey]
            if (ques.required && (value === undefined || value === null || value === ""))
            {
                return res.status(400).json({ok:false,msg:"required questions are missing"})
            }

            if (ques.type === "singleSelect") {
                if (value !== undefined) {
                    const allowed = ques.options.choices.map(c => c.name)
                    if (!allowed.includes(value)) {
                     return res.status(400).json({ok: false,msg: "Invalid single select value"})
                    }
                }
            }

            if (ques.type === "multiSelect") {
                if (value !== undefined) {
                    if (!Array.isArray(value)) {
                        return res.status(400).json({ok: false,msg: "Invalid multi select value"})
                    }

                    const allowed = ques.options.choices.map(c => c.name)
                    const invalid = value.filter(v => !allowed.includes(v))

                    if (invalid.length > 0) {
                        return res.status(400).json({ok: false,msg: "Invalid multi select value"})
                    }
                }
            }
            
        }

        const fields={}
        for(const ques of visibleQuestions)
        {
            fields[ques.fieldId] = answers[ques.questionKey]
        }
        

        const response = await axios.post(`https://api.airtable.com/v0/${form.airtableBaseID}/${form.airtableTableID}`,
            {
                 fields
            },
            {
                headers:{
                    Authorization : "Bearer " + req.user.accessToken
                }
            }
    )
        await Response.create({
            formID,
            airtableRecordId:response.data.id,
            answers
        })

        return res.status(200).json({ok:true,msg:"Form submitted successfully and saved !"})
    } catch (error) {
       console.log("Error occures in submiting form :",error)
       return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message}) 
    }
}

exports.getFormResponse =async(req,res)=>
{
    try {
        const { formID }=req.params
        console.log(formID)

        const form = await Form.findById(formID)

        if(!formID)
        {
            return res.status(400).json({ok:false , msg:"Form not found"})
        }

        const formResponse = await Response.find({formID}).sort({createdAt : -1}).lean()

        const finalFormData= formResponse.map(resp=>({
            submissionId:resp._id,
            createdAt :resp.createdAt,
            status: resp.deletedInAirTable ? "Deleted":"Active",
            AnswerPreview: Object.entries(resp.answers).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(", ")
        })
        )

        return res.status(200).json({ok:true,msg:"Retrives the form responses successfully !",value:finalFormData})
    } catch (error) {
        console.log("Error occures in getting formresponse  :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message}) 
    }
}

exports.getAllForm = async(req,res)=>
{
 try {

    const user = req.user._id

    const forms = await Form.find({owner : user},{
        title : 1,
        createdAt:1
    }).sort({ createdAt : -1})

    return res.status(200).json({ok:true,msg:"Retrived all the forms!",value:forms})
 } catch (error) {
    console.log("Error occures in getting formresponse  :",error)
    return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
 }
}