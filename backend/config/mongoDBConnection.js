const mongoose = require("mongoose")


const mongoConnection =async ()=>
{
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("MongoDB connected !"))
    .catch((err)=> console.error("Error while connecting mongoDb:", err))
}   

module.exports = mongoConnection