const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
