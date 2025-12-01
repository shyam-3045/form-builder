const express = require("express")
const { oauthLogin, oauthCallback } = require("../controllers/oauth")
const router = express.Router()

router.get("/airtable/login",oauthLogin);
router.get("/airtable/callback",oauthCallback)

module.exports=router