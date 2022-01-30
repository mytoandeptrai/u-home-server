const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    categories: { type: Array, required: true },
    status: { type: String, default: "system_verifying" },
    payment_method: {
      type: String,
      default: "cash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("issue", issueSchema);
