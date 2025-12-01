const mongoose = require("mongoose")

const FormResponseSchema= new mongoose.Schema({
    formID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    airtableRecordId: {
      type: String,
      required: true
    },
    answers: {
      type: Object,
      required: true
    },
    deletedInAirTable:{
        type:Boolean,
        default : false
    },
    createdAt :{
        type:Date,
        default : new Date()
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Response",FormResponseSchema)