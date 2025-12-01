const express = require("express")
const {getBases,getTablesFrombase,getFieldsFromTable,} = require("../controllers/bases")
const userAuth = require("../middleware/userAuthenticateMiddleware")
const router = express.Router()

router.get("/bases", userAuth, getBases)
router.get("/bases/:baseID/tables", userAuth, getTablesFrombase)
router.get("/bases/:baseID/tables/:tableID/fields",userAuth,getFieldsFromTable)

module.exports = router;
