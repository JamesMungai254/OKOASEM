const express = require("express");
const router = express.Router();
const cors = require('cors');

// Enable CORS for this router
router.use(cors({
  origin: 'https://okoasemfrontend.onrender.com',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

const {
  initiatePayment,
  mpesaCallback
} = require("../controllers/mpesaController");



router.post("/pay", initiatePayment);
router.post("/mpesa/callback", mpesaCallback);

module.exports = router;
