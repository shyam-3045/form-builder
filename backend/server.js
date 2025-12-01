const express = require("express");
const app= express();
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()
const mongoConnection=require("./config/mongoDBConnection");
const { urlencoded } = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

app.use(cors({ 
       origin: process.env.FRONTEND_URL.split(","),    
       credentials: true
  })
)

app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).send("Ok");
});
app.use("/auth",require("./routes/oauth"))
app.use("/airtable",require("./routes/bases"))
app.use("/airtable",require("./routes/form"))
app.use("/webhooks",require("./routes/webhooks"))


mongoConnection()

app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})
