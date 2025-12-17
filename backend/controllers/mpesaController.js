const axios = require("axios");
const moment = require("moment");
const Payment = require("../models/payment"); // Make sure the path is correct
require('dotenv').config();

const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return data.access_token;
};

exports.initiatePayment = async (req, res) => {
  try {
    const { phone, fileId } = req.body;
    const amount = 5; // Fixed amount

    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const shortcode = "174379";
    const passkey = process.env.MPESA_PASSKEY;

    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const stkRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: "https://okoasembackend.onrender.com/api/mpesa/callback",
      AccountReference: "OKOASEM",
      TransactionDesc: "File download payment"
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Save pending payment
    const payment = new Payment({
      phone,
      amount,
      fileId,
      checkoutRequestID: data.CheckoutRequestID,
      status: "PENDING"
    });
    await payment.save();

    res.json({ success: true, message: "STK Push sent", checkoutRequestID: data.CheckoutRequestID });

  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};


exports.mpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    console.log("MPESA CALLBACK:", JSON.stringify(callbackData));

    const payment = await Payment.findOne({ checkoutRequestID: callbackData.CheckoutRequestID });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (callbackData.ResultCode === 0) {
      payment.status = "SUCCESS";
    } else {
      payment.status = "FAILED";
    }

    await payment.save();

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (err) {
    console.error("MPESA Callback Error:", err);
    res.status(500).json({ error: "Callback processing failed" });
  }
};
