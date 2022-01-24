const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: String,
    worker: String,
    createdBy: String,
    status: {
      type: String,
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("issue", issueSchema);
