const { default: axios } = require("axios")
const User = require("../models/User")

exports.getBases =async(req,res)=>
{
    try {
        const user = req.user

        const bases = await axios.get("https://api.airtable.com/v0/meta/bases",{
            headers:{
                Authorization : "Bearer " + user.accessToken
            }
            
        })
        console.log("user bases :",bases.data)
        return  res.status(200).json({ok:true , msg:"retrived bases successfully !",value:bases.data})
        
    } catch (error) {
        console.log("Error occures in getting bases :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
    }
}

exports.getTablesFrombase = async(req,res)=>
{
    try {
        const { baseID } = req.params

        const tables = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseID}/tables`,{
            headers:{
                Authorization: "Bearer " + req.user.accessToken
            }
        })
        return res.status(200).json({ok:true,msg:"retreives all tables from the bases",value:tables.data})
    } catch (error) {
        console.log("Error occures in getting tables from base :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
        
    }
}

exports.getFieldsFromTable = async(req,res)=>
{
    try {
         const { baseID,tableID }=req.params
         if(!baseID || !tableID)
         {
            return res.status(400).json({
                ok:false,
                msg:"required fields are missing (baseID or tableID)"
            })
         }

         const tables = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseID}/tables`,{
            headers:{
                Authorization: "Bearer " + req.user.accessToken
            }
        })

        const table = tables.data.tables.find( t => t.id == tableID)

        if(!table)
        {
            return res.status(400).json({ok:false,msg:"table not found"})
        }
         const allowedTypes = [
      "singleLineText",
      "multilineText",
      "singleSelect",
      "multipleSelects",
      "multipleAttachments"
    ]

    const filteredFields = table.fields
      .filter(f => allowedTypes.includes(f.type))
      .map(f => ({
        fieldId: f.id,
        label: f.name,
        type: f.type,
        options: f.options?.choices || null
      }))


        return res.status(200).json({ok:true,msg:"retreives all fileds from the tables",value:filteredFields})
    } catch (error) {
        console.log("Error occures in getting fileds from tables :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
    }
}