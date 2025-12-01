const crypto = require("crypto");
const axios=require("axios");
const { URLSearchParams } = require("url");
const User = require("../models/User");
const webhook = require("../models/webhook");
const { webhookConnection } = require("../config/webhookConnection");

exports.oauthLogin = (req, res) => {
  try {
    const state = crypto.randomBytes(16).toString("hex")
    const codeVerifier = crypto
      .randomBytes(32)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")


    res.cookie("airtable_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("airtable_code_verifier", codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
    });

    const queryParams = new URLSearchParams({
      client_id: process.env.AIRTABLE_CLIENT_ID,
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
      response_type: "code",
      scope:
        "data.records:read data.records:write schema.bases:read webhook:manage user.email:read",
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authorizationURL =
      `${process.env.AIRTABLE_AUTH_URL}?${queryParams.toString()}`;

    res.redirect(authorizationURL);
  } catch (error) {
    console.error("Error in oauthLogin:", error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.oauthCallback=async(req,res)=>
{
    try {
        const code = req.query.code
        const state =req.query.state
        
        const savedState = req.cookies.airtable_oauth_state
        const codeVerifier = req.cookies.airtable_code_verifier

        if (!state || !code)
        {
            console.log("Missing state and code in params")
            return res.status(400).json({ok :"false" , msg : "Missing state and code in params"})
        }

        if(state !== savedState)
        {
            console.log("state and savedState is not same")
            return res.status(400).json({ok :"false" , msg : "state and savedState is not same"})

        }

        const credentials = Buffer.from(process.env.AIRTABLE_CLIENT_ID + ":" + process.env.AIRTABLE_CLIENT_SECRET ).toString("base64")

        const token= await axios.post(process.env.AIRTABLE_TOKEN_URL, new URLSearchParams({
            code : code,
            client_id : process.env.AIRTABLE_CLIENT_ID,
            redirect_uri : process.env.AIRTABLE_REDIRECT_URI,
            grant_type:"authorization_code",
            code_verifier: codeVerifier,

        }).toString(),{
            headers:{
                "Authorization" : "Basic " + credentials,
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        })

  
        const accessToken = token?.data?.access_token
        const refreshToken = token?.data?.refresh_token

        const userDetails = await axios.get("https://api.airtable.com/v0/meta/whoami",{
         headers:{
            Authorization:"Bearer " + accessToken
         }
        })
      
        const UserID = userDetails.data.id
        const email =userDetails.data.email

        const user = await User.findOneAndUpdate({
            UserID :UserID
        },
        {UserID,
        email ,
        accessToken : accessToken,
        refreshToken : refreshToken,
        lastLoginAt : new Date()
      },
      {
        upsert :true , new:true
      }
    )
 

      // const webhookExists = await webhook.findOne({
      //   owner : user._id,
      //   baseID: process.env.WEBHOOK_BASE_ID
      // })
      
      // if(! webhookExists)
      // {
      //   const WebHook = await webhookConnection(accessToken)
      //   console.log("Webhook :",WebHook)

      //   await webhook.create({
      //     baseID: process.env.WEBHOOK_BASE_ID,
      //     tableID: process.env.WEBHOOK_TABLE_ID,
      //     webhookID: WebHook.id,
      //     expirationTime: WebHook.expirationTime,
      //     macSecretBase64: WebHook.macSecretBase64,
      //     owner: user._id
      //   })
      // }


     

      res.cookie("app_user_id",user._id.toString(),{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        path:"/"

      })
      res.clearCookie("airtable_oauth_state")
      res.clearCookie("airtable_code_verifier")
    
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
    } catch (error) {
        console.log("Error occures in oauth callback :",error)
        return res.status(500).json({ok :"false" , msg : "Internal Server Error",error : error.message})
    }
}