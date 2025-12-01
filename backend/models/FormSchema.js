const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
 questionKey: { 
    type: String, required: true 
},
  fieldId: { 
    type: String, required: true 
},
  label: { 
    type: String, required: true 
},
  type: { 
    type: String, required: true 
},
  required: {
     type: Boolean, default: false
     },
  conditionalRules: {
     type: Object, default: null 
    }
})

const FormSchema = new mongoose.Schema({
    owner : {
        type:mongoose.Schema.Types.ObjectId ,
        ref: "User",
        required :true
    },
    title: {
        type:String,
        required: true,
        
  },
    airtableBaseID :{
        type : String,
        required :true
    },
    airtableTableID:{
        type : String,
        required:true
    },
    questions:[QuestionSchema]
},{
    timestamps:true
})

module.exports = mongoose.model("Form",FormSchema)