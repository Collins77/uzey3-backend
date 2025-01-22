const { default: axios } = require("axios");
const moment = require("moment");
const Payment = require("../models/Payment");
const crypto = require("crypto");


const generateOAuthSignature = (method, url, params, consumerSecret, tokenSecret = "") => {
    const parameterString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
  
    const signatureBaseString = [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(parameterString),
    ].join("&");
  
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
    return crypto.createHmac("sha1", signingKey).update(signatureBaseString).digest("base64");
  };
  
  // Callback function for MPesa
const createOrder = async (req, res) => {
    const { amount, email, description } = req.body;
  
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const pesapalBaseUrl = process.env.PESAPAL_BASE_URL;
    const redirectUrl = process.env.PESAPAL_REDIRECT_URL;
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL;
  
    const token = ""; // Pesapal API does not require a token for signature calculation
    const timestamp = new Date().toISOString();
  
    const params = {
      oauth_consumer_key: consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString("hex"),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_version: "1.0",
      amount: amount,
      description: description,
      type: "MERCHANT",
      reference: `REF-${Date.now()}`,
      first_name: "Test",
      last_name: "User",
      email: email,
      phone_number: "254791448827",
      currency: "KES",
      redirect_url: redirectUrl,
      callback_url: callbackUrl,
    };
  
    const signature = generateOAuthSignature("POST", pesapalBaseUrl, params, consumerSecret, token);
    params.oauth_signature = signature;
  
    try {
      const response = await axios.post(pesapalBaseUrl, null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params,
      });
  
      if (response.data) {
        res.status(200).json({ redirect_url: response.data });
      } else {
        res.status(500).json({ error: "Failed to create Pesapal order." });
      }
    } catch (error) {
      console.error("Pesapal Order Error:", error);
      res.status(500).json({ error: "An error occurred while creating the Pesapal order." });
    }
}

const callBack = async (req, res) => {
    const { pesapal_transaction_tracking_id, pesapal_merchant_reference } = req.body;
  
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const url = `https://www.pesapal.com/api/querypaymentstatus`;
  
    const params = {
      oauth_consumer_key: consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString("hex"),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_version: "1.0",
      pesapal_merchant_reference,
      pesapal_transaction_tracking_id,
    };
  
    const signature = generateOAuthSignature("GET", url, params, consumerSecret);
    params.oauth_signature = signature;
  
    try {
      const response = await axios.get(url, { params });
  
      if (response.data) {
        console.log("Payment Status:", response.data);
        // Handle payment success or failure here
        res.status(200).send("Payment status received.");
      } else {
        res.status(500).send("Failed to verify payment status.");
      }
    } catch (error) {
      console.error("Pesapal Callback Error:", error);
      res.status(500).send("An error occurred during payment verification.");
    }
  }
  

module.exports = {createOrder, callBack}