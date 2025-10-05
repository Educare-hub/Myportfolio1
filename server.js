// --- server.js ---
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm install node-fetch@2
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/api/mpesa-pay", async (req, res) => {
  const { phone, email } = req.body;

  if (!phone || !email) return res.json({ success: false, message: "Missing phone or email" });

  try {
    // STEP 1: Get OAuth token from Safaricom (ConsumerKey + ConsumerSecret)
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` }
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // STEP 2: Trigger STK Push
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g,"").slice(0,14);
    const password = Buffer.from(`${process.env.SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString("base64");

    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      body: JSON.stringify({
        BusinessShortCode: process.env.SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1", // change to 0.3 USD equivalent in KES
        PartyA: phone,
        PartyB: process.env.SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "88Resume",
        TransactionDesc: "Resume Upgrade"
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    const stkData = await stkRes.json();
    console.log(stkData);

    res.json({ success: true, message: "STK Push initiated", data: stkData });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
