const { default: axios } = require("axios")

exports.webhookConnection = async(accessToken)=>
{
    try {
        const body = {
        notificationUrl :process.env.WEBHOOK_CALLBACK_URL,
        specification: {
        options: {
            filters: {
            dataTypes: ["tableData"]
            },
        },
        },
    }

    const response = await axios.post(`https://api.airtable.com/v0/bases/appmxMWXP5u2XqIzQ/webhooks`,body,{
        headers:{
            Authorization: "Bearer "+ accessToken,
            "Content-Type" :"application/json"
        }
    })

    console.log("webhook response :",response.data)
    return response.data;
    } catch (error) {
        console.log("Error while registering Webhook :",error.message || error)
    }

}

