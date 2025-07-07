const Expenditure = require('../models/Expenditure');

exports.getAll = async (req, res) => {
  const expenditures = await Expenditure.find({ user: req.user._id }).sort({ date: -1 });
  res.json(expenditures);
};

exports.create = async (req, res) => {
  const { date, amount, category, description } = req.body;
  const expenditure = new Expenditure({ user: req.user._id, date, amount, category, description });
  await expenditure.save();
  res.status(201).json(expenditure);
};

exports.remove = async (req, res) => {
  await Expenditure.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
};

exports.update = async (req, res) => {
  const { date, amount, category, description } = req.body;
  const expenditure = await Expenditure.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { date, amount, category, description },
    { new: true }
  );
  res.json(expenditure);
};
