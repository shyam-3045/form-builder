const express = require("express");
const userAuth = require("../middleware/userAuthenticateMiddleware");
const { createForm, getForm, submitForm, getFormResponse, getAllForm } = require("../controllers/form");
const router = express.Router();

router.post("/forms", userAuth, createForm);
router.get("/forms", userAuth, getAllForm);
router.get("/form/:formID",userAuth,getForm)
router.post("/forms/:formID/submit",userAuth,submitForm)
router.get("/forms/:formID/responses",userAuth,getFormResponse)
module.exports = router;

