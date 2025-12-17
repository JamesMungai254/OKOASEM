const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();  


// Allow CORS for all methods including preflight
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://okoasemfrontend.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // respond OK to preflight
  }
  next();
});
app.options('*', cors());

const {
  initiatePayment,
  mpesaCallback
} = require("../controllers/mpesaController");

// Use consistent endpoint name
router.post("/initiate-payment", initiatePayment);
router.post("/mpesa/callback", mpesaCallback);

module.exports = router;
