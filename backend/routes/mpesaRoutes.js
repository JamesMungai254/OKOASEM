const express = require("express");
const {
  initiatePayment,
  mpesaCallback
} = require("../controllers/mpesaController");

const router = express.Router();

router.post("/pay", initiatePayment);
router.post("/mpesa/callback", mpesaCallback);

module.exports = router;
