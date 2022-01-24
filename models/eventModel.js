const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    worker: String,
    createdBy: String,
    startDate: String,
    endDate: String,
    percentSale: Number,
    maxValue: String,
    minValue: String,
    condition: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
