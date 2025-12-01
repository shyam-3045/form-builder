const express = require("express")
const { airtableWebhook } = require("../controllers/webhook")
const router = express.Router()

router.post("/airtable",airtableWebhook)

module.exports=router