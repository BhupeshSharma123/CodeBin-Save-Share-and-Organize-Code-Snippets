import { Schema, model } from "mongoose";

// Define the schema for CodeBin
const CodeBinSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt'
);

// Create and export the model
const CodeBin = model("CodeBin", CodeBinSchema);
export default CodeBin;
