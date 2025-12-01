const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    UserID: {
        type : String,
        required : true,
        unique:true
    },
    email :String,
    accessToken: String,
    refreshToken: String,
    lastLoginAt: Date
  },
  { timestamps: true }

)

module.exports=mongoose.model("User",UserSchema)