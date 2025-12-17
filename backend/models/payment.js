const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  checkoutRequestID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // <-- Auto-delete after 10 minutes
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
