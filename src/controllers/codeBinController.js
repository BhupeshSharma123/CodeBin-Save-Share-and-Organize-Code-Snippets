const CodeBin = require("../models/CodeBin");

// Create a new CodeBin
exports.createCodeBin = async (req, res) => {
  try {
    const { title, code } = req.body;
    const newCodeBin = new CodeBin({ title, code });
    await newCodeBin.save();
    res.status(201).json(newCodeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all CodeBins
exports.getAllCodeBins = async (req, res) => {
  try {
    const codeBins = await CodeBin.find();
    res.status(200).json(codeBins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single CodeBin by ID
exports.getCodeBinById = async (req, res) => {
  try {
    const codeBin = await CodeBin.findById(req.params.id);
    if (!codeBin) return res.status(404).json({ error: "CodeBin not found" });
    res.status(200).json(codeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a CodeBin
exports.updateCodeBin = async (req, res) => {
  try {
    const updatedCodeBin = await CodeBin.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCodeBin) return res.status(404).json({ error: "CodeBin not found" });
    res.status(200).json(updatedCodeBin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a CodeBin
exports.deleteCodeBin = async (req, res) => {
  try {
    const deletedCodeBin = await CodeBin.findByIdAndDelete(req.params.id);
    if (!deletedCodeBin) return res.status(404).json({ error: "CodeBin not found" });
    res.status(200).json({ message: "CodeBin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
