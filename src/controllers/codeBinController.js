const SnipAI = require("../models/SnipAI ");

// Create a new SnipAI
exports.createCodeBin = async (req, res) => {
  try {
    const { title, code } = req.body;
    const newCodeBin = new SnipAI({ title, code });
    await newCodeBin.save();
    res.status(201).json(newCodeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all CodeBins
exports.getAllCodeBins = async (req, res) => {
  try {
    const codeBins = await SnipAI.find();
    res.status(200).json(codeBins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single SnipAI  by ID
exports.getCodeBinById = async (req, res) => {
  try {
    const codeBin = await SnipAI.findById(req.params.id);
    if (!codeBin) return res.status(404).json({ error: "SnipAI  not found" });
    res.status(200).json(codeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a SnipAI
exports.updateCodeBin = async (req, res) => {
  try {
    const updatedCodeBin = await SnipAI.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCodeBin)
      return res.status(404).json({ error: "SnipAI  not found" });
    res.status(200).json(updatedCodeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a SnipAI
exports.deleteCodeBin = async (req, res) => {
  try {
    const deletedCodeBin = await SnipAI.findByIdAndDelete(req.params.id);
    if (!deletedCodeBin)
      return res.status(404).json({ error: "SnipAI  not found" });
    res.status(200).json({ message: "SnipAI  deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
