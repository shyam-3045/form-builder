const mongoose= require("mongoose")

const WebhookSchema = new mongoose.Schema({
    baseID :{
        type:String
    },
    tableID:{
        type:String
    },
    webhookID:{
        type:String
    },
    expirationTime:{
        type : Date
    },
    macSecretBase64:{
        type: String
    },
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
    timestamps:true
})

module.exports = mongoose.model("WebHook",WebhookSchema)